import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { promises as fsp } from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 API manage-files received POST request')
    
    const body = await req.json()
    console.log('📦 Request body:', JSON.stringify(body, null, 2))
    
    const { action, userId, componentName, files } = body

    if (!action || !userId) {
      console.error('❌ Missing action or userId')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' }, 
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      )
    }

    const userDir = path.join(process.cwd(), 'generated', userId)
    console.log('📁 User directory path:', userDir)

    if (action === 'saveComponent') {
      if (!componentName || !files) {
        return NextResponse.json({ success: false, error: 'Missing componentName or files' }, { status: 400 })
      }

      // ✅ Ensure directory exists before saving files
      try {
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true })
          console.log('📁 Created directory:', userDir)
        } else {
          console.log('📁 Directory already exists:', userDir)
        }
      } catch (dirError) {
        console.error('❌ Failed to create directory:', dirError)
        return NextResponse.json({ success: false, error: 'Failed to create directory' }, { status: 500 })
      }

      // Save files
      const savedFiles = []
      for (const [fileName, content] of Object.entries(files)) {
        try {
          const filePath = path.join(userDir, fileName)
          await fsp.writeFile(filePath, String(content), 'utf8')
          savedFiles.push(fileName)
          console.log(`✅ Saved: ${fileName}`)
        } catch (fileError) {
          console.error(`❌ Failed to save ${fileName}:`, fileError)
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `Saved ${componentName} files`,
        files: savedFiles
      })
    }

    if (action === 'getFiles') {
      console.log('🔍 Checking for files in:', userDir)
      
      if (!fs.existsSync(userDir)) {
        console.log('📁 Directory does not exist:', userDir)
        return NextResponse.json({ 
          success: true, 
          files: {},
          components: []
        })
      }
    
      try {
        const items = await fsp.readdir(userDir)
        console.log('📄 Found files:', items)
        
        const files: Record<string, Record<string, string>> = {}
        
        // ✅ FIX: Handle both naming schemes
        for (const item of items) {
          if (item.includes('.')) {
            const [componentName, extension] = item.split('.')
            
            // Handle component-specific files (header.html, hero.css, etc.)
            if (!files[componentName]) {
              files[componentName] = {}
            }
            
            const filePath = path.join(userDir, item)
            const content = await fsp.readFile(filePath, 'utf8')
            files[componentName][item] = content
            
          } else if (['html', 'css', 'js'].includes(item)) {
            // ✅ FIX: Handle generic fallback files (html, css, js)
            // Find the component they belong to by checking recent save operations
            const fallbackComponents = ['footer', 'contact-form'] // Most likely fallback components
            
            for (const componentName of fallbackComponents) {
              if (!files[componentName]) {
                const filePath = path.join(userDir, item)
                try {
                  const content = await fsp.readFile(filePath, 'utf8')
                  
                  if (!files[componentName]) {
                    files[componentName] = {}
                  }
                  
                  // Map generic file to component-specific name
                  files[componentName][`${componentName}.${item}`] = content
                  console.log(`🔄 Mapped generic '${item}' to '${componentName}.${item}'`)
                  break // Only assign to first matching component
                } catch (error) {
                  console.error(`Failed to read ${item}:`, error)
                }
              }
            }
          }
        }
        
        const components = Object.keys(files)
        console.log('✅ Retrieved files for user:', components)
        
        return NextResponse.json({ 
          success: true, 
          files,
          components
        })
        
      } catch (readError) {
        console.error('❌ Error reading directory:', readError)
        return NextResponse.json({ 
          success: true, 
          files: {},
          components: []
        })
      }
    }
    
    

    if (action === 'createFolder') {
      try {
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true })
          console.log('✅ Created folder for user:', userId)
        }
        return NextResponse.json({ 
          success: true, 
          message: `Folder created for user ${userId}` 
        })
      } catch (error) {
        console.error('❌ Failed to create folder:', error)
        return NextResponse.json({ success: false, error: 'Failed to create folder' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
    
  } catch (error: any) {
    console.error('❌ API manage-files error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  }
}