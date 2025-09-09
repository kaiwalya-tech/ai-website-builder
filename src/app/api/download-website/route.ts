import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// Install: npm install adm-zip
const AdmZip = require('adm-zip')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId parameter' },
        { status: 400 }
      )
    }
    
    // Get user's generated website folder
    const userDir = path.join(process.cwd(), 'generated', userId)
    
    if (!fs.existsSync(userDir)) {
      return NextResponse.json(
        { success: false, error: 'Website folder not found' },
        { status: 404 }
      )
    }
    
    console.log('📦 Creating zip for folder:', userDir)
    
    // Create zip archive
    const zip = new AdmZip()
    
    // Add all files from user directory
    zip.addLocalFolder(userDir, false) // false = don't add root folder name
    
    // Generate zip buffer
    const zipBuffer = zip.toBuffer()
    
    console.log('✅ Zip created, size:', zipBuffer.length, 'bytes')
    
    // Return zip file as download
    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="website_${userId}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error: any) {
    console.error('❌ Download zip creation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create zip file', details: error.message },
      { status: 500 }
    )
  }
}
