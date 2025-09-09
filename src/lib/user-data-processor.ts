import { UserPreferences } from './gemini'

export interface ProcessedUserData {
  originalInput: UserPreferences
  enhancedDescription: string
  userId?: string 
  businessContext: {
    industry: string
    targetAudience: string
    primaryGoals: string[]
    keyFeatures: string[]
  }
  technicalRequirements: {
    sections: string[]
    functionality: string[]
    styling: {
      theme: 'light' | 'dark'
      personality: string
      colorPalette: string
    }
  }
  contentStrategy: {
    tone: string
    messaging: string[]
    callsToAction: string[]
  }
}

export class UserDataProcessor {
  
  static async processUserInput(userInput: UserPreferences): Promise<ProcessedUserData> {
    console.log('🔄 Processing user input for AI generation...')
    
    const businessContext = this.analyzeBusinessContext(userInput)
    const contentStrategy = this.defineContentStrategy(userInput, businessContext)
    const enhancedDescription = this.enhanceDescription(userInput, businessContext)
    
    // ✅ Use ordered sections
    const orderedSections = this.getOrderedSections(userInput.selectedFeatures || [])
    
    const technicalRequirements = {
      sections: orderedSections, // ✅ Use ordered sections instead of random order
      functionality: [
        'responsive-design',
        'seo-optimization', 
        'performance-optimization'
      ],
      styling: {
        theme: userInput.colorScheme || 'light',
        personality: this.generatePersonality(userInput.businessDescription),
        colorPalette: userInput.colorScheme === 'dark' ? 'modern-dark' : 'welcoming-light'
      }
    }
    
    return {
      originalInput: userInput,
      enhancedDescription,
      businessContext,
      technicalRequirements,
      contentStrategy
    }
  }
  
  
  // ✅ Add this function to ensure proper component order
static getOrderedSections(selectedFeatures: string[]): string[] {
  // Define the logical website structure order (top to bottom)
  const sectionOrder = [
    'header',      // Always first
    'hero',        // Welcome section
    'about-us',    // Company info
    'services',    // What you offer
    'contact-form',// How to reach you
    'photo-gallery', // Visual showcase
    'testimonials', // Social proof
    'location',    // Where to find you
    'social',      // Social media links
    'footer'       // Always last
  ]
  
  // ✅ Map selected features to technical sections
  const featureMapping: Record<string, string> = {
    'about': 'about-us',
    'services': 'services', 
    'contact': 'contact-form',
    'gallery': 'photo-gallery',
    'testimonials': 'testimonials',
    'location': 'location',
    'social': 'social'
  }
  
  // Always include header, hero, and footer
  const requiredSections = ['header', 'hero', 'footer']
  const mappedFeatures = selectedFeatures.map(f => featureMapping[f]).filter(Boolean)
  
  // Combine and maintain order
  const allSections = [...requiredSections, ...mappedFeatures]
  const uniqueSections = [...new Set(allSections)]
  
  // ✅ Return in proper order
  return sectionOrder.filter(section => uniqueSections.includes(section))
}

  private static analyzeBusinessContext(input: UserPreferences) {
    const industryMap: Record<string, any> = {
      'Restaurant': {
        targetAudience: 'Food lovers, families, local diners',
        primaryGoals: ['Showcase menu', 'Enable reservations', 'Build trust'],
        keyFeatures: ['Menu display', 'Location info', 'Reviews', 'Contact']
      },
      'Retail/E-commerce': {
        targetAudience: 'Online shoppers, product seekers',
        primaryGoals: ['Drive sales', 'Showcase products', 'Build brand'],
        keyFeatures: ['Product catalog', 'Shopping experience', 'Trust signals']
      },
      'Services': {
        targetAudience: 'Potential clients, B2B customers',
        primaryGoals: ['Generate leads', 'Establish expertise', 'Convert visitors'],
        keyFeatures: ['Service descriptions', 'Portfolio', 'Contact forms']
      },
      'Healthcare': {
        targetAudience: 'Patients, caregivers, medical seekers',
        primaryGoals: ['Build trust', 'Provide information', 'Enable appointments'],
        keyFeatures: ['Services info', 'Appointment booking', 'Trust building']
      }
    }
    
    const context = industryMap[input.websiteType] || industryMap['Services']
    
    return {
      industry: input.websiteType,
      targetAudience: context.targetAudience,
      primaryGoals: context.primaryGoals,
      keyFeatures: [...context.keyFeatures, ...input.selectedFeatures]
    }
  }
  

  static generatePersonality(businessDescription: string): string {
    // Extract personality traits from business description
    const description = businessDescription.toLowerCase()
    
    if (description.includes('restaurant') || description.includes('food') || description.includes('cafe')) {
      return 'warm, inviting, appetizing'
    }
    
    if (description.includes('tech') || description.includes('software') || description.includes('app')) {
      return 'modern, innovative, professional'
    }
    
    if (description.includes('creative') || description.includes('design') || description.includes('art')) {
      return 'creative, inspiring, artistic'
    }
    
    if (description.includes('health') || description.includes('medical') || description.includes('fitness')) {
      return 'trustworthy, clean, professional'
    }
    
    if (description.includes('education') || description.includes('school') || description.includes('learning')) {
      return 'educational, approachable, inspiring'
    }
    
    // Default personality
    return 'professional, modern, trustworthy'
  }
  
  private static extractTechnicalRequirements(input: UserPreferences) {
    const sections = [
      'header', 'hero', 
      ...input.selectedFeatures.map(f => f.toLowerCase().replace(/[^a-z0-9]/g, '-')),
      'footer'
    ]
    
    const functionality = [
      'responsive-design',
      'seo-optimization', 
      'performance-optimization',
      ...(input.selectedFeatures.includes('Contact Form') ? ['form-handling'] : []),
      ...(input.selectedFeatures.includes('Photo Gallery') ? ['image-optimization'] : [])
    ]
    
    const styling = {
      theme: input.colorScheme,
      personality: this.getPersonalityFromBusiness(input.websiteType),
      colorPalette: input.colorScheme === 'dark' ? 'professional-dark' : 'welcoming-light'
    }
    
    return { sections, functionality, styling }
  }
  
  private static defineContentStrategy(input: UserPreferences, context: any) {
    const toneMap: Record<string, string> = {
      'Restaurant': 'warm, inviting, appetizing',
      'Services': 'professional, trustworthy, solution-focused',
      'Healthcare': 'caring, professional, reassuring',
      'Technology': 'innovative, clear, forward-thinking'
    }
    
    const tone = toneMap[input.websiteType] || 'professional, engaging'
    
    const messagingMap: Record<string, string[]> = {
      'Restaurant': ['Quality ingredients', 'Authentic flavors', 'Memorable experiences'],
      'Services': ['Expert solutions', 'Proven results', 'Client success']
    }
    
    const messaging = messagingMap[input.websiteType] || ['Quality service', 'Professional results']
    
    const callsToAction = context.primaryGoals.map((goal: string) => {
      switch(goal) {
        case 'Showcase menu': return 'View Our Menu'
        case 'Generate leads': return 'Get Free Consultation'
        case 'Enable appointments': return 'Book Appointment'
        default: return 'Get Started'
      }
    })
    
    return { tone, messaging, callsToAction }
  }
  
  private static enhanceDescription(input: UserPreferences, context: any): string {
    return `
Create a ${input.websiteType.toLowerCase()} website for a business that ${input.businessDescription}

TARGET AUDIENCE: ${context.targetAudience}

PRIMARY GOALS: ${context.primaryGoals.join(', ')}

KEY SECTIONS NEEDED: ${context.keyFeatures.join(', ')}

DESIGN REQUIREMENTS:
- Theme: ${input.colorScheme} (${input.colorScheme === 'dark' ? 'professional, modern, sleek' : 'clean, bright, welcoming'})
- Personality: ${this.getPersonalityFromBusiness(input.websiteType)}
- Must be mobile-responsive and modern
- Focus on user experience and conversion

SPECIFIC FEATURES TO IMPLEMENT: ${input.selectedFeatures.join(', ')}

The website should feel authentic to the ${input.websiteType.toLowerCase()} industry while being unique and engaging.
    `.trim()
  }
  
  private static getPersonalityFromBusiness(type: string): string {
    const personalities: Record<string, string> = {
      'Restaurant': 'warm, inviting, appetizing',
      'Retail/E-commerce': 'trendy, trustworthy, shopping-focused',
      'Services': 'professional, reliable, solution-oriented',
      'Healthcare': 'caring, trustworthy, clean',
      'Technology': 'innovative, modern, cutting-edge',
      'Creative/Portfolio': 'artistic, unique, inspiring'
    }
    
    return personalities[type] || 'professional, modern'
  }
}