import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface MessageAnalysis {
  componentTarget: string | null
  changeType: 'style' | 'content' | 'structure' | 'functionality'
  specificChanges: string[]
  confidence: number
}

export async function POST(req: NextRequest) {
  // ✅ FIX: Declare variables outside try-catch with defaults
  let message = ''
  let completedComponents: string[] = []
  let currentFiles: any = {}
  let userInput: any = {}

  try {
    // ✅ FIX: Extract data from request with defaults
    const requestData = await req.json()
    message = requestData.message || ''
    completedComponents = requestData.completedComponents || []
    currentFiles = requestData.currentFiles || {}
    userInput = requestData.userInput || {}

    console.log('🤖 Processing chat message:', message)
    console.log('📝 Available components:', completedComponents)

    const analysis = await analyzeMessageWithRetry(message, completedComponents)

    if (!analysis.componentTarget || analysis.confidence < 0.5) {
      return NextResponse.json({
        content: `I can help you modify these available components: ${completedComponents.join(', ')}

Please specify which component you'd like to change. For example:
• "Change the hero section title"
• "Update the header navigation" 
• "Modify the contact form"`,
        componentTarget: null,
        changeType: null,
        updatedCode: null
      })
    }

    const updatedCode = await generateUpdatedCode(
      analysis,
      currentFiles[analysis.componentTarget],
      userInput
    )

    const responseContent = `✅ I've updated the ${analysis.componentTarget.replace('-', ' ')} component!

Changes made:
${analysis.specificChanges.map(change => `• ${change}`).join('\n')}

The changes should now be visible in your preview. Would you like me to make any other adjustments?`

    return NextResponse.json({
      content: responseContent,
      componentTarget: analysis.componentTarget,
      changeType: analysis.changeType,
      updatedCode
    })

  } catch (error: any) {
    console.error('Chat message processing error:', error)
    
    // ✅ FIX: Now completedComponents is accessible here
    return NextResponse.json({
      content: `I'm having trouble processing your request right now. 

Available components: ${completedComponents.length > 0 ? completedComponents.join(', ') : 'Loading...'}

You can also use the Edit Mode to make direct changes to your website components.`,
      componentTarget: null,
      changeType: null,
      updatedCode: null
    })
  }
}

// ✅ UPDATED: Using only Gemini 2.5 Flash with retry logic
async function analyzeMessageWithRetry(message: string, completedComponents: string[], maxRetries = 3): Promise<MessageAnalysis> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      console.log(`🔄 Chat analysis: gemini-2.5-flash attempt ${attempt}/${maxRetries}`)

      const prompt = `Analyze this user message about updating a website component:

Message: "${message}"

Available components: ${completedComponents.join(', ')}

Extract:
1. Which component they want to modify (must be from available components)
2. Type of change: style, content, structure, or functionality  
3. Specific changes requested
4. Confidence level (0-1)

Respond with only this exact JSON format:
{"componentTarget": "component-name or null", "changeType": "style", "specificChanges": ["change1", "change2"], "confidence": 0.95}

Examples:
- "Change hero title" → {"componentTarget": "hero", "changeType": "content", "specificChanges": ["update title text"], "confidence": 0.9}
- "Make header blue" → {"componentTarget": "header", "changeType": "style", "specificChanges": ["change background to blue"], "confidence": 0.85}`

      const result = await model.generateContent(prompt)
      const response = await result.response.text()
      
      // JSON extraction
      const startIndex = response.indexOf('{')
      const endIndex = response.lastIndexOf('}')
      
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonStr = response.substring(startIndex, endIndex + 1)
        const parsed = JSON.parse(jsonStr)
        console.log('✅ Chat analysis successful:', parsed)
        return parsed
      }
      
      throw new Error('No valid JSON found in response')
      
    } catch (error: any) {
      console.warn(`⚠️ Gemini 2.5 Flash attempt ${attempt} failed:`, error.message)
      
      // Add progressive delay between retries
      if (attempt < maxRetries) {
        const delay = attempt * 2000 // 2s, 4s, 6s
        console.log(`⏳ Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  // ✅ Fallback analysis using keyword matching
  console.log('🔄 Using fallback keyword analysis')
  return analyzeMessageFallback(message, completedComponents)
}

// ✅ Smart fallback analysis
function analyzeMessageFallback(message: string, completedComponents: string[]): MessageAnalysis {
  const lowerMessage = message.toLowerCase()
  
  // Simple keyword matching for components
  let targetComponent = null
  for (const component of completedComponents) {
    if (lowerMessage.includes(component) || lowerMessage.includes(component.replace('-', ' '))) {
      targetComponent = component
      break
    }
  }
  
  // Determine change type based on keywords
  let changeType: 'style' | 'content' | 'structure' | 'functionality' = 'content'
  if (lowerMessage.includes('color') || lowerMessage.includes('style') || lowerMessage.includes('background')) {
    changeType = 'style'
  } else if (lowerMessage.includes('text') || lowerMessage.includes('title') || lowerMessage.includes('heading')) {
    changeType = 'content'
  }
  
  return {
    componentTarget: targetComponent,
    changeType,
    specificChanges: [message],
    confidence: targetComponent ? 0.8 : 0.4
  }
}

async function generateUpdatedCode(
  analysis: MessageAnalysis,
  currentComponent: any,
  userInput: any
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Update this website component code based on the user request:

Component: ${analysis.componentTarget}
Change Type: ${analysis.changeType}
Requested Changes: ${analysis.specificChanges.join(', ')}

Current HTML:
${currentComponent?.[`${analysis.componentTarget}.html`] || ''}

Current CSS:
${currentComponent?.[`${analysis.componentTarget}.css`] || ''}

Current JS:
${currentComponent?.[`${analysis.componentTarget}.js`] || ''}

Website Context: ${userInput?.websiteType} - ${userInput?.businessDescription}

Generate updated code that:
1. Implements the requested changes
2. Maintains responsive design
3. Keeps consistent styling with website theme
4. Preserves existing functionality

Respond with only this exact JSON format:
{"${analysis.componentTarget}.html": "updated html code", "${analysis.componentTarget}.css": "updated css code", "${analysis.componentTarget}.js": "updated js code"}`

    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    // JSON extraction
    const startIndex = response.indexOf('{')
    const endIndex = response.lastIndexOf('}')
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const jsonStr = response.substring(startIndex, endIndex + 1)
      return JSON.parse(jsonStr)
    }
    
    throw new Error('No valid JSON found in response')
    
  } catch (error) {
    console.error('Code generation error:', error)
    // Return original code if generation fails
    return {
      [`${analysis.componentTarget}.html`]: currentComponent?.[`${analysis.componentTarget}.html`] || '',
      [`${analysis.componentTarget}.css`]: currentComponent?.[`${analysis.componentTarget}.css`] || '',
      [`${analysis.componentTarget}.js`]: currentComponent?.[`${analysis.componentTarget}.js`] || ''
    }
  }
}