import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface UserPreferences {
  businessDescription: string
  websiteType: string
  userEmail: string
  selectedFeatures: string[]
  colorScheme: 'light' | 'dark'
}

export interface GeneratedWebsite {
  components: ComponentData[]
  customizations: {
    colorScheme: string
    font: string
    theme: string
    animations: boolean
  }
  suggestions: string[]
}

export interface ComponentData {
  id: string
  type: 'navbar' | 'hero' | 'features' | 'contact' | 'contact-form' | 'about-us' | 'services' | 'testimonials' | 'blog' | 'gallery' | 'footer'
  content: Record<string, any>
  editable: boolean
} 

export interface ThemeCustomizations {
  colorScheme: string
  font: string
  theme: string
  animations: boolean
}

export class AIWebsiteGenerator {
  private model: any

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" })
  }

  // Generate website based on user preferences
  async generateWebsite(preferences: UserPreferences): Promise<GeneratedWebsite> {
    try {
      const prompt = this.createDetailedPrompt(preferences)
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return this.parseAIResponse(text, preferences)
    } catch (error) {
      console.error('AI Generation Error:', error)
      
      // Return fallback website structure
      return this.getFallbackWebsite(preferences)
    }
  }

  // Create detailed prompt based on user preferences
  private createDetailedPrompt(preferences: UserPreferences): string {
    return `
Create a professional website for ${preferences.websiteType}'s ${preferences.websiteType} business.

User Details:
- Name: ${preferences.websiteType}
- Business Type: ${preferences.websiteType}
- Website Goal: ${preferences.businessDescription}
- Selected Theme: ${preferences.colorScheme}
- Selected Template: ${preferences.colorScheme}

Generate a JSON response with this structure:
{
  "components": [
    {
      "id": "navbar",
      "type": "navbar",
      "content": {
        "brandName": "${preferences.websiteType}",
        "menuItems": ["Home", "About", "Services", "Contact"],
        "style": "${preferences.colorScheme}"
      },
      "editable": true
    },
    {
      "id": "hero", 
      "type": "hero",
      "content": {
        "headline": "Professional headline for ${preferences.websiteType}",
        "subheadline": "Compelling subheadline that addresses ${preferences.businessDescription}",
        "ctaText": "Get Started",
        "backgroundImage": "modern-${preferences.websiteType.toLowerCase()}-bg.jpg"
      },
      "editable": true
    }
  ],
  "customizations": {
    "colorScheme": "${preferences.colorScheme}",
    "font": "modern",
    "theme": "${preferences.colorScheme}",
    "animations": true
  },
  "suggestions": [
    "Add testimonials section",
    "Include contact form",
    "Add portfolio gallery"
  ]
}

Focus on:
1. Professional, industry-appropriate copy
2. Clear value propositions
3. Strong call-to-actions
4. SEO-friendly content
5. Conversion optimization

Make the content specific to ${preferences.websiteType} industry and ${preferences.businessDescription} goals.
`
  }

  // Parse AI response safely
  private parseAIResponse(response: string, preferences: UserPreferences): GeneratedWebsite {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        components: parsed.components || this.getDefaultComponents(preferences),
        customizations: parsed.customizations || this.getDefaultCustomizations(preferences),
        suggestions: parsed.suggestions || []
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      return this.getFallbackWebsite(preferences)
    }
  }

  // Fallback website when AI fails
  private getFallbackWebsite(preferences: UserPreferences): GeneratedWebsite {
    return {
      components: this.getDefaultComponents(preferences),
      customizations: this.getDefaultCustomizations(preferences),
      suggestions: [
        'Add more sections to showcase your services',
        'Include customer testimonials',
        'Add a contact form for lead generation'
      ]
    }
  }

  // Fixed default components with proper icon imports
private getDefaultComponents(preferences: UserPreferences): ComponentData[] {
    const businessName = preferences.websiteType || 'Your Business'
    
    return [
      {
        id: 'navbar',
        type: 'navbar',
        content: {
          brandName: businessName,
          menuItems: ['Home', 'About', 'Services', 'Contact'],
          style: preferences.colorScheme
        },
        editable: true
      },
      {
        id: 'hero',
        type: 'hero',
        content: {
          headline: `Welcome to ${businessName}`,
          subheadline: `Professional ${preferences.websiteType} services that deliver results`,
          ctaText: 'Get Started Today',
          backgroundImage: 'hero-bg.jpg'
        },
        editable: true
      },
      {
        id: 'features',
        type: 'features',
        content: {
          title: 'Why Choose Us',
          features: [
            {
              title: 'Professional Service',
              description: 'High-quality solutions tailored to your needs',
              icon: 'Award' // Fixed: Use component websiteType as string
            },
            {
              title: 'Fast Delivery',
              description: 'Quick turnaround times without compromising quality',
              icon: 'Zap' // Fixed: Use component websiteType as string
            },
            {
              title: 'Expert Support',
              description: '24/7 customer support from our experienced team',
              icon: 'Users' // Fixed: Use component websiteType as string
            }
          ]
        },
        editable: true
      },
      {
        id: 'contact',
        type: 'contact',
        content: {
          title: 'Contact Us',
          email: preferences.userEmail
        },
        editable: true
      },
      {
        id: 'footer',
        type: 'footer',
        content: {
          brandName: businessName,
          email: preferences.userEmail,
          year: new Date().getFullYear()
        },
        editable: true
      }
    ]
  }
  

  // Default theme customizations
  private getDefaultCustomizations(preferences: UserPreferences): ThemeCustomizations {
    return {
      colorScheme: preferences.colorScheme,
      font: 'modern',
      theme: preferences.colorScheme,
      animations: true
    }
  }
}