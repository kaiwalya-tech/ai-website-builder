import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    
    return NextResponse.json({
      success: true,
      message: `I received your message: "${message}". Chat functionality will be implemented in the next phase.`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Chat not implemented yet'
    }, { status: 500 })
  }
}
