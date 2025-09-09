import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json()
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
Analyze this user input and determine which website components to generate. Be realistic about what can be successfully created.

User Input:
- Business Description: ${userInput.businessDescription}
- Website Type: ${userInput.websiteType}
- Features: ${userInput.selectedFeatures?.join(', ') || 'none specified'}

Available Components:
- header: Navigation menu and branding
- hero: Main banner with call-to-action
- footer: Contact info and links
- about-us: Company story and team
- services: Service offerings grid
- contact-form: Contact form with fields
- testimonials: Customer reviews
- gallery: Image showcase
- pricing: Pricing plans

Rules:
1. ALWAYS include: header, hero, footer (these are essential)
2. Choose 1-2 additional components that make sense for the business
3. Consider API limitations - simpler is better
4. Total components should be 3-5 maximum

Respond with ONLY a JSON object in this exact format:
{
  "components": ["header", "hero", "footer", "about-us"],
  "reasoning": "Selected header, hero, and footer as essential components. Added about-us because it's important for restaurants to tell their story and build trust with customers.",
  "expectedCount": 4
}
`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    console.log('🤖 AI Component Analysis Response:', text)
    
    // Parse AI response
    let analysisResult
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.warn('⚠️ Failed to parse AI response, using fallback')
      // Fallback based on website type
      const isRestaurant = userInput.websiteType?.toLowerCase().includes('restaurant')
      const isBusiness = userInput.websiteType?.toLowerCase().includes('business')
      
      analysisResult = {
        components: isRestaurant 
          ? ['header', 'hero', 'footer', 'about-us']
          : isBusiness 
          ? ['header', 'hero', 'footer', 'services']
          : ['header', 'hero', 'footer'],
        reasoning: `Fallback selection for ${userInput.websiteType} website`,
        expectedCount: isRestaurant || isBusiness ? 4 : 3
      }
    }
    
    // Validate and ensure essential components
    if (!analysisResult.components.includes('header')) {
      analysisResult.components.unshift('header')
    }
    if (!analysisResult.components.includes('hero')) {
      analysisResult.components.splice(1, 0, 'hero')
    }
    if (!analysisResult.components.includes('footer')) {
      analysisResult.components.push('footer')
    }
    
    // Update expected count
    analysisResult.expectedCount = analysisResult.components.length
    
    console.log('✅ Final component selection:', analysisResult)
    
    return NextResponse.json({
      success: true,
      data: analysisResult
    })
    
  } catch (error: any) {
    console.error('❌ Component analysis failed:', error)
    
    // Emergency fallback
    return NextResponse.json({
      success: true,
      data: {
        components: ['header', 'hero', 'footer'],
        reasoning: 'Emergency fallback - minimal viable website',
        expectedCount: 3
      }
    })
  }
}
