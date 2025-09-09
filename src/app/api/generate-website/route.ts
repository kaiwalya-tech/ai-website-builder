import { NextRequest, NextResponse } from 'next/server'
import { UserDataProcessor } from '@/lib/user-data-processor'
import { AICodeGenerator } from '@/lib/ai-code-generator'

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json()
    
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('🚀 Starting website generation for user:', userId)

    // Step 1: Process user input
    const processedData = await UserDataProcessor.processUserInput(userInput)
    console.log('✅ User data processed')

    // ✅ REMOVE THIS DUPLICATE AI ANALYSIS BLOCK:
    // const aiCodeGenerator = new AICodeGenerator()
    // const aiSelectedComponents = await aiCodeGenerator.getAnalyzedComponents(userInput)
    // processedData.technicalRequirements.sections = aiSelectedComponents

    // Step 2: Generate website code (AI analysis happens inside here)
    const generatedCode = await new AICodeGenerator().generateWebsiteCode(processedData, userId)
    console.log('✅ Website code generated and files saved')

    return NextResponse.json({
      success: true,
      message: 'Website generated successfully',
      data: {
        userId: userId,
        generatedCode: generatedCode,
        expectedCount: generatedCode.expectedCount || 5, // Use the count from AI generator
        metadata: {
          sectionsGenerated: generatedCode?.components ? Object.keys(generatedCode.components).length : 0,
          timestamp: new Date().toISOString(),
          theme: processedData?.technicalRequirements?.styling?.theme || 'default',
          filesLocation: `generated/${userId}`
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Website generation failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Website generation failed',
      fallback: {
        message: 'AI generation encountered an issue. Please try again.',
        canRetry: true
      }
    }, { status: 500 })
  }
}