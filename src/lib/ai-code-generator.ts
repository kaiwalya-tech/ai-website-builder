import { GoogleGenerativeAI } from '@google/generative-ai'
import { ProcessedUserData } from './user-data-processor'


interface GenerationResult {
  success: boolean
  components: Record<string, any>
  message?: string
  error?: string
  expectedCount?: number // ✅ Add this field
}


export interface GeneratedCodeStructure {
  components: {
    [key: string]: {
      html: string
      css: string
      javascript: string
      metadata: {
        description: string
        dependencies: string[]
      }
    }
  }
  globalStyles: string
  structure: string[]
  assets: {
    colors: Record<string, string>
    fonts: string[]
    images: string[]
  }
}

export class AICodeGenerator {
  private geminiModel: any
  private genAI: GoogleGenerativeAI

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    this.geminiModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }
  
  async generateWebsiteCode(userInput: ProcessedUserData, userId?: string): Promise<GenerationResult> {
    try {
      console.log('🤖 Starting AI code generation with file management...')
      
      const finalUserId = userId || 'default_user'
      console.log('👤 Using userId:', finalUserId)
      
      // ✅ Get AI-powered component analysis
      const components = await this.analyzeUserRequirements(userInput.originalInput)
      console.log(`🔧 Generating ${components.length} components with 6s intervals...`)
      
      // ✅ Pass the AI-selected components to the generation method
      const result = await this.generateComponentsWithFiles(userInput, components, finalUserId)
      
      if (result.success) {
        console.log('✅ Website code generated and files saved')
        return {
          success: true,
          components: result.components,
          message: `Generated ${components.length} components successfully`,
          expectedCount: components.length // ✅ This will now be correct
        }
      } else {
        console.warn('⚠️ Some components failed, but continuing with generated ones')
        return {
          success: true,
          components: result.components || {},
          message: `Generated with some fallbacks`,
          expectedCount: components.length
        }
      }
    } catch (error) {
      console.error('❌ Website generation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        components: {},
        expectedCount: 3
      }
    }
  }
  
  // ✅ Add this public wrapper method to AICodeGenerator class
public async getAnalyzedComponents(userInput: any): Promise<string[]> {
  return await this.analyzeUserRequirements(userInput)
}


  private async createUserFolder(userId: string) {
    try {
      // ✅ Fix: Use absolute URL for server-side fetch
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
      const url = `${baseUrl}/api/manage-files`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createFolder',
          userId: userId
        })
      })

      const result = await response.json()
      if (result.success) {
        console.log('📁 User folder created:', result.message)
      } else {
        console.error('❌ Folder creation failed:', result.error)
      }
    } catch (error) {
      console.error('❌ Folder creation error:', error)
    }
  }

  // ✅ Correct model selection based on official API documentation
  private selectOptimalModel(taskType: 'design-system' | 'component-generation' | 'chat-analysis'): string {
    switch (taskType) {
      case 'design-system':
        return 'gemini-2.5-flash' // Complex design system generation
      case 'component-generation':
        return 'gemini-2.5-flash' // Complex HTML/CSS/JS generation
      case 'chat-analysis':
        return 'gemini-2.5-flash' // Use same model for consistency
      default:
        return 'gemini-2.5-flash'
    }
  }

  private async analyzeUserRequirements(userInput: any): Promise<string[]> {
    console.log('🤖 Getting AI component analysis...')
    
    try {
      const response = await fetch('http://localhost:3000/api/analyze-components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput })
      })
      
      if (!response.ok) {
        throw new Error(`Analysis API failed: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.data.components) {
        console.log('✅ AI selected components:', result.data.components)
        console.log('💭 AI reasoning:', result.data.reasoning)
        return result.data.components
      }
      
      throw new Error('Invalid analysis response')
      
    } catch (error) {
      console.error('⚠️ AI analysis failed, using fallback:', error)
      
      // Smart fallback based on user input
      const description = userInput.businessDescription?.toLowerCase() || ''
      const websiteType = userInput.websiteType?.toLowerCase() || ''
      
      let components = ['header', 'hero', 'footer']
      
      if (websiteType.includes('restaurant') || description.includes('food') || description.includes('restaurant')) {
        components.push('about-us')
      } else if (websiteType.includes('business') || description.includes('service')) {
        components.push('services')
      }
      
      console.log('🔧 Fallback components:', components)
      return components
    }
  }




  private async generateComponentsWithFiles(
    data: ProcessedUserData,
    components: string[],  // ✅ Add this parameter for AI-selected components
    userId: string
  ): Promise<any> {
    const results: any = {}
    const sections = components  // ✅ Use AI-selected components, not hardcoded ones
  
    console.log(`🔧 Generating ${sections.length} components with 6s intervals...`)
  
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
  
      console.log(`📝 Generating ${section} component (${i + 1}/${sections.length})...`)
  
      try {
        // Generate component with AI
        const component = await this.generateSingleComponentWithRetry(section, data, {})
        results[section] = component
  
        // ✅ Always save component files (including fallbacks)
        await this.saveComponentFiles(userId, section, component)
  
        // Rate limiting: Wait 6+ seconds between API calls
        if (i < sections.length - 1) {
          console.log('⏳ Waiting 6s for API rate limit...')
          await new Promise(resolve => setTimeout(resolve, 6000))
        }
  
      } catch (error) {
        console.error(`❌ Component generation failed for ${section}:`, error)
  
        // ✅ Generate and save fallback
        const fallbackComponent = this.getEnhancedFallback(section)
        results[section] = fallbackComponent
  
        // ✅ Save fallback component
        await this.saveComponentFiles(userId, section, fallbackComponent)
        console.log(`🔄 Using fallback content for ${section}`)
      }
    }
  
    return {
      success: Object.keys(results).length > 0,
      components: results,
      successCount: Object.keys(results).length,
      totalAttempted: sections.length
    }
  }
  



  private async generateSingleComponentWithRetry(
    componentName: string,
    data: ProcessedUserData,
    designSystem: any,
    maxRetries = 2 // ✅ Reduced from 3 to 2 to save API quota
  ): Promise<any> {

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📝 Generating ${componentName} component (attempt ${attempt}/${maxRetries})...`)

        const prompt = this.buildComponentPrompt(componentName, data, designSystem)
        const response = await this.geminiModel.generateContent(prompt)
        const responseText = response.response.text()

        if (responseText && responseText.trim().length > 0) {
          return this.parseComponentResponse(responseText, componentName)
        } else {
          throw new Error('Empty response from AI')
        }

      } catch (error: any) {
        console.warn(`⚠️ Attempt ${attempt} failed for ${componentName}:`, error.message)

        // ✅ Handle specific API errors
        if (error.message?.includes('overloaded') || error.message?.includes('503')) {
          console.log(`⏳ API overloaded, waiting longer before retry...`)
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 15000)) // Wait 15s for overload
            continue
          }
        }

        if (attempt === maxRetries) {
          console.log(`🔄 Using enhanced fallback for ${componentName}`)
          return this.getEnhancedFallback(componentName)
        }

        // Normal retry wait
        await new Promise(resolve => setTimeout(resolve, 6000))
      }
    }

    return this.getEnhancedFallback(componentName)
  }



  private createOptimizedPrompt(sectionName: string, data: ProcessedUserData, designSystem: any): string {
    // Optimized, shorter prompts to reduce token usage
    return `Generate ${sectionName} component for ${data.businessContext.industry} website.
  
  Business: ${data.originalInput.businessDescription.substring(0, 150)}...
  Theme: ${data.technicalRequirements.styling.theme}
  Colors: ${JSON.stringify(designSystem.colorPalette)}
  
  Return JSON only:
  {
    "html": "<semantic HTML with Tailwind classes>",
    "css": "/* Custom CSS if needed */",
    "javascript": "// JavaScript functionality",
    "metadata": {"description": "Component purpose", "dependencies": []}
  }
  
  Requirements: Professional ${data.businessContext.industry} content, mobile-responsive, conversion-focused.`
  }

  private async saveComponentFiles(userId: string, componentName: string, componentData: any): Promise<void> {
    try {
      console.log(`💾 Saving files for ${componentName}...`)
      console.log(`📦 Component data keys:`, Object.keys(componentData))

      // ✅ Use absolute URL for server-side fetch
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

      // ✅ Correct request body format
      const requestBody = {
        action: 'saveComponent',  // ✅ Make sure this matches API expectation
        userId: userId,
        componentName: componentName,
        files: componentData       // ✅ Pass the component data as 'files'
      }

      console.log(`🔗 Making request to: ${baseUrl}/api/manage-files`)
      console.log(`📋 Request body:`, JSON.stringify(requestBody, null, 2))

      const response = await fetch(`${baseUrl}/api/manage-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AI-Website-Builder/1.0'
        },
        body: JSON.stringify(requestBody)
      })

      console.log(`📡 Response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ API Error Response:`, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      console.log(`✅ Save result:`, result)

      if (result.success) {
        console.log(`✅ Successfully saved ${componentName} files:`, result.files)
      } else {
        throw new Error(result.error || 'Save operation failed')
      }
    } catch (error) {
      console.error(`❌ Failed to save ${componentName} files:`, error)
      throw error
    }
  }


  private async generateDesignSystem(data: ProcessedUserData): Promise<any> {
    const prompt = `
You are an expert web designer and developer. Create a comprehensive design system for this website:

${data.enhancedDescription}

DESIGN REQUIREMENTS:
- Theme: ${data.technicalRequirements.styling.theme}
- Personality: ${data.technicalRequirements.styling.personality}
- Industry: ${data.businessContext.industry}

Generate ONLY a JSON object with this exact structure:
{
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex", 
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "textSecondary": "#hex"
  },
  "typography": {
    "headingFont": "font-name",
    "bodyFont": "font-name", 
    "sizes": {
      "h1": "size",
      "h2": "size",
      "body": "size"
    }
  },
  "spacing": {
    "sections": "value",
    "elements": "value",
    "components": "value"
  },
  "borderRadius": "value",
  "shadows": {
    "card": "shadow-value",
    "button": "shadow-value"
  }
}

Make colors appropriate for ${data.businessContext.industry} with ${data.technicalRequirements.styling.theme} theme.
`

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const result = await model.generateContent(prompt)
      const response = await result.response.text()

      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      return this.getFallbackDesignSystem(data.technicalRequirements.styling.theme)
    } catch (error) {
      console.error('Design system generation error:', error)
      return this.getFallbackDesignSystem(data.technicalRequirements.styling.theme)
    }
  }

  private async generateComponents(data: ProcessedUserData, designSystem: any): Promise<any> {
    const components: any = {}
    const sections = data.technicalRequirements.sections

    console.log(`🔧 Generating ${sections.length} components...`)

    for (const section of sections) {
      console.log(`📝 Generating ${section} component...`)

      const component = await this.generateSingleComponent(section, data, designSystem)
      components[section] = component

      // ✅ Add delay between API calls to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
    }

    return components
  }
  private buildComponentPrompt(componentName: string, data: ProcessedUserData, designSystem: any): string {
    const prompt = `Generate a professional ${componentName} component for a ${data.originalInput.websiteType}.
  
  Business: ${data.originalInput.businessDescription}
  Theme: ${data.technicalRequirements.styling.theme}
  
  CRITICAL: Return ONLY valid JSON with this EXACT structure:
  {
    "${componentName}.html": "semantic HTML with Tailwind classes",
    "${componentName}.css": "custom CSS if needed",
    "${componentName}.js": "JavaScript if needed"
  }
  
  Requirements:
  1. Use semantic HTML5 elements
  2. Use Tailwind CSS classes for styling
  3. Make it fully responsive (mobile-first)
  4. NO escape characters in strings - use proper JSON formatting
  5. Keep HTML content on single lines where possible
  6. Return ONLY the JSON object - no markdown, no explanations
  
  Component Guidelines:
  - ${componentName}: ${this.getComponentGuideline(componentName)}
  
  Generate valid, parseable JSON now:`

    return prompt
  }

  // ✅ Add component-specific guidelines
  private getComponentGuideline(componentName: string): string {
    const guidelines: Record<string, string> = {
      'header': 'Navigation with logo, menu items, responsive hamburger menu',
      'hero': 'Eye-catching banner with heading, description, call-to-action buttons',
      'about-us': 'Personal/company introduction with highlights and achievements',
      'skills': 'Technical skills organized in categories with skill tags',
      'projects': 'Portfolio projects with images, descriptions, and links',
      'education': 'Academic background with timeline layout',
      'services': 'Service offerings in card layout with descriptions',
      'contact-form': 'Professional contact form with validation styling',
      'footer': 'Footer with links, social icons (24px max), and copyright'
    }

    return guidelines[componentName] || 'Professional section with relevant content'
  }



  private parseComponentResponse(responseText: string, componentName: string): any {
    console.log(`🔍 Parsing ${componentName} response`)

    try {
      let text = responseText.trim()
      text = text.replace(/``````\s*/g, '')

      const start = text.indexOf('{')
      const end = text.lastIndexOf('}') + 1

      if (start !== -1 && end > start) {
        const jsonStr = text.substring(start, end)

        try {
          const parsed = JSON.parse(jsonStr)

          // ✅ ALWAYS ensure consistent naming
          const result = {
            [`${componentName}.html`]: parsed[`${componentName}.html`] || parsed['html'] || '',
            [`${componentName}.css`]: parsed[`${componentName}.css`] || parsed['css'] || '',
            [`${componentName}.js`]: parsed[`${componentName}.js`] || parsed['js'] || ''
          }

          console.log(`✅ Successfully parsed ${componentName}`)
          return result

        } catch (parseError) {
          console.warn(`⚠️ JSON parse failed for ${componentName}, using fallback`)
        }
      }
    } catch (error) {
      console.error(`❌ Parse error for ${componentName}:`, error)
    }

    return this.getEnhancedFallback(componentName)
  }







  // ✅ FIX: Return component-specific keys instead of generic ones
private getEnhancedFallback(componentName: string): any {
  const fallbacks: Record<string, any> = {
    'header': {
      [`${componentName}.html`]: `<header class="bg-gray-900 text-white shadow-lg py-4 relative z-50">
        <div class="container mx-auto px-4 flex justify-between items-center">
          <div class="text-2xl font-bold text-primary-400">Your Website</div>
          <nav class="hidden md:flex space-x-8">
            <a href="#home" class="hover:text-primary-400 transition-colors">Home</a>
            <a href="#about" class="hover:text-primary-400 transition-colors">About</a>
            <a href="#contact" class="hover:text-primary-400 transition-colors">Contact</a>
          </nav>
        </div>
      </header>`,
      [`${componentName}.css`]: '',
      [`${componentName}.js`]: ''
    },
    'hero': {
      [`${componentName}.html`]: `<section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div class="container mx-auto px-6 text-center">
          <h1 class="text-5xl font-bold mb-6">Welcome to Your Website</h1>
          <p class="text-xl mb-8">Professional service with excellence and dedication</p>
          <button class="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg text-lg font-semibold">Get Started</button>
        </div>
      </section>`,
      [`${componentName}.css`]: '',
      [`${componentName}.js`]: ''
    },
    'footer': {
      [`${componentName}.html`]: `<footer class="bg-gray-900 text-white py-16">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div class="text-2xl font-bold mb-4 text-primary-400">Your Website</div>
              <p class="text-gray-300 mb-6">Professional service and excellence.</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
              <ul class="space-y-2">
                <li><a href="#about" class="text-gray-300 hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#services" class="text-gray-300 hover:text-primary-400 transition-colors">Services</a></li>
                <li><a href="#contact" class="text-gray-300 hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
              <div class="text-gray-300 space-y-2">
                <div>📧 hello@yourwebsite.com</div>
                <div>📞 (555) 123-4567</div>
                <div>📍 123 Business St, City 12345</div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-700 pt-8 text-center">
            <p class="text-gray-400">&copy; 2025 Your Website. All rights reserved.</p>
          </div>
        </div>
      </footer>`,
      [`${componentName}.css`]: '',
      [`${componentName}.js`]: ''
    },
    'contact-form': {
      [`${componentName}.html`]: `<section id="contact-form" class="py-20 bg-primary-600 text-white">
        <div class="container mx-auto px-6 max-w-4xl">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold mb-6">Get In Touch</h2>
            <p class="text-xl opacity-90">Ready to get started? Contact us today.</p>
          </div>
          <form class="max-w-2xl mx-auto bg-white rounded-lg p-8 text-gray-900">
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-semibold mb-2">Your Name</label>
                <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Enter your name">
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Your Email</label>
                <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Enter your email">
              </div>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-semibold mb-2">Message</label>
              <textarea rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-vertical" placeholder="Your message..."></textarea>
            </div>
            <div class="text-center">
              <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">Send Message</button>
            </div>
          </form>
        </div>
      </section>`,
      [`${componentName}.css`]: '',
      [`${componentName}.js`]: ''
    },
    'about-us': {
      [`${componentName}.html`]: `<section id="about-us" class="py-20 bg-gray-50">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">About Us</h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">We are dedicated to providing exceptional service and value to our customers.</p>
          </div>
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p class="text-gray-600 mb-6">Built on excellence and innovation, we continue to set new standards.</p>
            </div>
            <div class="bg-white p-8 rounded-lg shadow-lg">
              <div class="text-primary-500 text-4xl font-bold mb-2">10+</div>
              <div class="text-gray-900 font-semibold mb-1">Years Experience</div>
              <div class="text-gray-600">Delivering excellence</div>
            </div>
          </div>
        </div>
      </section>`,
      [`${componentName}.css`]: '',
      [`${componentName}.js`]: ''
    }
  }

  return fallbacks[componentName] || {
    [`${componentName}.html`]: `<section class="py-16">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-2xl font-bold">${componentName.replace('-', ' ')} Component</h2>
      </div>
    </section>`,
    [`${componentName}.css`]: '',
    [`${componentName}.js`]: ''
  }
}



  private async generateSingleComponent(
    sectionName: string,
    data: ProcessedUserData,
    designSystem: any
  ): Promise<any> {
    const maxRetries = 3
    let retryCount = 0

    while (retryCount < maxRetries) {
      try {
        const sectionPrompts = this.getSectionSpecificPrompt(sectionName, data)

        const prompt = `
  You are an expert frontend developer. Generate a complete, modern website component.
  
  COMPONENT: ${sectionName}
  BUSINESS: ${data.businessContext.industry}
  CONTENT TONE: ${data.contentStrategy.tone}
  
  ${sectionPrompts}
  
  DESIGN SYSTEM TO USE:
  - Colors: ${JSON.stringify(designSystem.colorPalette)}
  - Fonts: ${JSON.stringify(designSystem.typography)}
  
  Generate ONLY a JSON object with this structure:
  {
    "html": "<complete HTML for this section>",
    "css": "/* Complete CSS styles for this section */",
    "javascript": "// Any needed JavaScript functionality",
    "metadata": {
      "description": "What this component does",
      "dependencies": ["list of external dependencies needed"]
    }
  }
  
  Requirements:
  - Use modern HTML5 semantic elements
  - Mobile-first responsive design
  - Include realistic, ${data.businessContext.industry}-specific content
  - Make it conversion-focused and professional
  `

        // ✅ Switch to Gemini 1.5 Flash (more stable)
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }

        throw new Error('No valid JSON found in response')

      } catch (error: any) {
        retryCount++
        console.warn(`Component generation attempt ${retryCount} failed for ${sectionName}:`, error.message)

        if (error.message.includes('503') || error.message.includes('overloaded')) {
          // Exponential backoff for 503 errors
          const waitTime = Math.pow(2, retryCount) * 1000
          console.log(`Waiting ${waitTime}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        } else if (retryCount >= maxRetries) {
          console.error(`Max retries reached for ${sectionName}`)
          return this.getFallbackComponent(sectionName, data)
        }
      }
    }

    return this.getFallbackComponent(sectionName, data)
  }


  private getSectionSpecificPrompt(section: string, data: ProcessedUserData): string {
    const prompts: Record<string, string> = {
      'header': `Create a navigation header with logo area for "${data.originalInput.websiteType}" and menu items. Include CTA button.`,

      'hero': `Create a compelling hero section that ${data.businessContext.primaryGoals[0]}. 
      Include headline, subheadline, CTA button, and visual element placeholder. 
      Make it specific to ${data.businessContext.industry}.`,

      'about-us': `Create an About Us section explaining the business story, values, and what makes them unique in ${data.businessContext.industry}.`,

      'services': `Create a services section showcasing key offerings for a ${data.businessContext.industry} business. Include 3-4 service cards.`,

      'contact-form': `Create a professional contact form with name, email, message fields and a submission button. Include contact information display.`,

      'testimonials': `Create a testimonials section with 2-3 realistic testimonials for a ${data.businessContext.industry} business.`,

      'footer': `Create a footer with business information, quick links, contact details, and social media placeholders.`
    }

    return prompts[section] || `Create a ${section} section appropriate for a ${data.businessContext.industry} website.`
  }

  private async generateGlobalStyles(data: ProcessedUserData, designSystem: any): Promise<string> {
    const prompt = `
Generate global CSS styles for the website using this design system:

${JSON.stringify(designSystem, null, 2)}

Create CSS that includes:
- CSS custom properties (variables) for the color palette
- Base typography styles  
- Common utility classes
- Responsive breakpoints
- Smooth animations and transitions

Return ONLY the CSS code, no explanations.
`

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const result = await model.generateContent(prompt)
      return await result.response.text()
    } catch (error) {
      console.error('Global styles generation error:', error)
      return this.getFallbackGlobalStyles(designSystem)
    }
  }

  private compileCodeStructure(components: any, globalStyles: string, designSystem: any): GeneratedCodeStructure {
    return {
      components,
      globalStyles,
      structure: Object.keys(components),
      assets: {
        colors: designSystem.colorPalette || {},
        fonts: [designSystem.typography?.headingFont, designSystem.typography?.bodyFont].filter(Boolean) || [],
        images: []
      }
    }
  }

  // Fallback methods
  private getFallbackDesignSystem(theme: 'light' | 'dark') {
    const lightColors = {
      primary: '#2563eb', secondary: '#64748b', accent: '#f59e0b',
      background: '#ffffff', surface: '#f8fafc', text: '#1e293b', textSecondary: '#64748b'
    }

    const darkColors = {
      primary: '#3b82f6', secondary: '#94a3b8', accent: '#fbbf24',
      background: '#0f172a', surface: '#1e293b', text: '#f1f5f9', textSecondary: '#94a3b8'
    }

    return {
      colorPalette: theme === 'dark' ? darkColors : lightColors,
      typography: { headingFont: 'Inter', bodyFont: 'Inter', sizes: { h1: '3rem', h2: '2rem', body: '1rem' } },
      spacing: { sections: '6rem', elements: '2rem', components: '1rem' },
      borderRadius: '0.5rem',
      shadows: { card: '0 4px 6px -1px rgba(0,0,0,0.1)', button: '0 2px 4px -1px rgba(0,0,0,0.1)' }
    }
  }

  // ✅ Update getFallbackComponent method with better styling
  private getFallbackComponent(componentName: string, data: ProcessedUserData): any {
    const businessName = data.originalInput.businessDescription.split(' ').slice(0, 3).join(' ')
    const websiteType = data.originalInput.websiteType || 'Business'
    const theme = data.originalInput.colorScheme || 'light'

    const fallbacks: Record<string, any> = {
      'header': {
        html: `<header class="header-section bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
        <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">${businessName}</div>
          </div>
          <div class="hidden md:flex space-x-8">
            <a href="#hero" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</a>
            <a href="#about-us" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a>
            <a href="#services" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Services</a>
            <a href="#contact-form" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a>
          </div>
        </nav>
      </header>`,
        css: `.header-section { position: sticky; top: 0; z-index: 50; } .container { max-width: 1200px; }`,
        js: '// Header functionality'
      },
      'hero': {
        html: `<section id="hero" class="hero-section min-h-screen bg-gradient-to-br from-primary-600 to-secondary-700 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-black bg-opacity-20 dark:bg-opacity-40"></div>
        <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">${businessName}</h1>
          <p class="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">Experience authentic ${websiteType.toLowerCase()} excellence with our premium services and dedication to quality</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact-form" class="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">Get Started</a>
            <a href="#about-us" class="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">Learn More</a>
          </div>
        </div>
      </section>`,
        css: `.hero-section { background-attachment: fixed; } @media (max-width: 768px) { .hero-section { background-attachment: scroll; } }`,
        js: '// Hero functionality'
      },
      'about-us': {
        html: `<section id="about-us" class="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">About ${businessName}</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">We are a dedicated ${websiteType.toLowerCase()} committed to providing exceptional service and value to our customers. Our passion drives everything we do.</p>
          </div>
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Story</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">Built on a foundation of excellence and innovation, we continue to set new standards in our industry.</p>
              <div class="space-y-4">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-primary-500 rounded-full mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Premium Quality Service</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-primary-500 rounded-full mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Expert Professional Team</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-primary-500 rounded-full mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Customer Satisfaction Focus</span>
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-xl">
              <div class="text-primary-500 text-4xl font-bold mb-2">10+</div>
              <div class="text-gray-900 dark:text-white font-semibold mb-1">Years Experience</div>
              <div class="text-gray-600 dark:text-gray-300">Delivering excellence</div>
            </div>
          </div>
        </div>
      </section>`,
        css: `.container { max-width: 1200px; }`,
        js: ''
      },
      'services': {
        html: `<section id="services" class="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Discover our comprehensive range of premium services designed to exceed your expectations</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="group bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div class="w-8 h-8 bg-primary-500 rounded-lg"></div>
              </div>
              <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Premium Service</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">High-quality service with attention to detail and professional excellence.</p>
              <a href="#contact-form" class="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300">Learn More →</a>
            </div>
            <div class="group bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div class="w-8 h-8 bg-secondary-500 rounded-lg"></div>
              </div>
              <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Expert Consultation</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">Professional guidance tailored to your specific needs and requirements.</p>
              <a href="#contact-form" class="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300">Learn More →</a>
            </div>
            <div class="group bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div class="w-8 h-8 bg-accent-500 rounded-lg"></div>
              </div>
              <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">24/7 Support</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">Round-the-clock assistance ensuring your needs are always met.</p>
              <a href="#contact-form" class="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300">Learn More →</a>
            </div>
          </div>
        </div>
      </section>`,
        css: `.container { max-width: 1200px; }`,
        js: ''
      },
      'contact-form': {
        html: `<section id="contact-form" class="py-20 bg-primary-600 dark:bg-gray-800 text-white transition-colors duration-300">
        <div class="container mx-auto px-6">
          <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p class="text-xl text-primary-100 dark:text-gray-300 max-w-2xl mx-auto">Ready to get started? Contact us today and let's discuss how we can help you achieve your goals.</p>
          </div>
          <div class="max-w-2xl mx-auto">
            <form class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-primary-100 dark:text-gray-300">Your Name</label>
                  <input type="text" class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-primary-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="Enter your name">
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-primary-100 dark:text-gray-300">Your Email</label>
                  <input type="email" class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-primary-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="Enter your email">
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-primary-100 dark:text-gray-300">Subject</label>
                <input type="text" class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-primary-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="What's this about?">
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-primary-100 dark:text-gray-300">Message</label>
                <textarea rows="6" class="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-primary-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-vertical" placeholder="Tell us more about your project..."></textarea>
              </div>
              <div class="text-center">
                <button type="submit" class="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </section>`,
        css: `.container { max-width: 1200px; }`,
        js: ''
      },
      'footer': {
        html: `<footer class="bg-gray-900 dark:bg-black text-white py-16 transition-colors duration-300">
        <div class="container mx-auto px-6">
          <div class="grid md:grid-cols-4 gap-8 mb-12">
            <div class="md:col-span-2">
              <div class="text-3xl font-bold mb-4 text-primary-400">${businessName}</div>
              <p class="text-gray-300 mb-6 max-w-md">Your trusted ${websiteType.toLowerCase()} partner, committed to excellence and customer satisfaction.</p>
              <div class="flex space-x-4">
                <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer">
                  <span class="text-white text-sm">f</span>
                </div>
                <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer">
                  <span class="text-white text-sm">t</span>
                </div>
                <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer">
                  <span class="text-white text-sm">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-4">Quick Links</h3>
              <ul class="space-y-2">
                <li><a href="#about-us" class="text-gray-300 hover:text-primary-400 transition-colors">About Us</a></li>
                <li><a href="#services" class="text-gray-300 hover:text-primary-400 transition-colors">Services</a></li>
                <li><a href="#contact-form" class="text-gray-300 hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-4">Contact Info</h3>
              <div class="space-y-2 text-gray-300">
                <div>📧 hello@${businessName.toLowerCase().replace(/\s+/g, '')}.com</div>
                <div>📞 (555) 123-4567</div>
                <div>📍 123 Business St, City, State 12345</div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-700 pt-8 text-center">
            <p class="text-gray-400">&copy; 2025 ${businessName}. All rights reserved. | Built with AI Website Builder</p>
          </div>
        </div>
      </footer>`,
        css: `.container { max-width: 1200px; }`,
        js: ''
      }
    }

    return fallbacks[componentName] || {
      html: `<section id="${componentName}" class="py-16 bg-gray-50 dark:bg-gray-800"><div class="container mx-auto px-6 text-center"><h2 class="text-2xl font-bold text-gray-900 dark:text-white">${componentName.replace('-', ' ')} Component</h2><p class="text-gray-600 dark:text-gray-300 mt-4">Content temporarily unavailable</p></div></section>`,
      css: '.container { max-width: 1200px; }',
      js: ''
    }
  }


  private getFallbackGlobalStyles(designSystem: any): string {
    return `
:root {
  --primary: ${designSystem.colorPalette?.primary || '#2563eb'};
  --background: ${designSystem.colorPalette?.background || '#ffffff'};
  --text: ${designSystem.colorPalette?.text || '#1e293b'};
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: var(--text); }
.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
`
  }

  private async generateDesignSystemWithRateLimit(data: ProcessedUserData): Promise<any> {
    try {
      // ✅ Use correct model name
      const model = this.genAI.getGenerativeModel({ model: this.selectOptimalModel('design-system') })
      return await this.generateDesignSystem(data)
    } catch (error: any) {
      console.error('Design system generation error:', error)

      // Return fallback design system
      return {
        colorPalette: {
          primary: '#C25E3E',
          secondary: '#708A63',
          accent: '#F5B749',
          background: '#FDFDFD',
          surface: '#FFFFFF',
          text: '#333333'
        },
        typography: {
          headingFont: 'Playfair Display',
          bodyFont: 'Lato'
        },
        spacing: {
          unit: '8px'
        }
      }
    }
  }



  private async generateGlobalStylesWithFiles(data: ProcessedUserData, designSystem: any, userId: string): Promise<string> {
    // For now, call existing method - will enhance with file saving later
    return await this.generateGlobalStyles(data, designSystem)
  }

}
