'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from 'lucide-react'

interface LivePreviewProps {
  currentFiles: Record<string, Record<string, string>>
  completedComponents: string[]
  isDarkMode?: boolean
  generationProgress?: number
  isGenerating?: boolean
  generationState?: "idle" | "processing" | "generating" | "complete" | "error"
  userInput?: any
  currentComponent?: string
}

// ✅ Loading Animation Component
const LoadingAnimation = ({ progress = 0 }: { progress?: number }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev >= 95) return prev + 0.1 // Slow down near end
        return prev + 0.5 // Gradual increase over 3-4 minutes
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const displayProgress = Math.min(animatedProgress, 100)

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      
      {/* ✅ Multi-layer Spinner */}
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <div 
          className="absolute top-2 left-2 w-20 h-20 border-4 border-indigo-400 rounded-full border-r-transparent animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* ✅ Progress Text */}
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-gray-800 mb-3">
          🤖 AI Website Builder
        </h3>
        <p className="text-lg text-gray-600 animate-pulse">
          Creating your professional website...
        </p>
      </div>

      {/* ✅ Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Generation Progress</span>
          <span>{Math.round(displayProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${displayProgress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* ✅ Component Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mb-6">
        {['Header', 'Hero', 'About', 'Services', 'Contact', 'Footer'].map((component, index) => {
          const isCompleted = displayProgress > (index + 1) * 16
          const isCurrent = displayProgress >= index * 16 && displayProgress < (index + 1) * 16
          
          return (
            <div 
              key={component}
              className={`
                px-4 py-3 rounded-lg text-sm font-medium transition-all duration-500
                ${isCompleted 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : isCurrent 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span>{component}</span>
                {isCompleted && <span className="text-green-600 text-lg">✓</span>}
                {isCurrent && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ✅ Dynamic Messages */}
      <div className="text-center">
        <p className="text-sm text-gray-500 italic">
          {displayProgress < 15 && "🚀 Initializing AI systems..."}
          {displayProgress >= 15 && displayProgress < 35 && "⚡ Generating header and navigation..."}
          {displayProgress >= 35 && displayProgress < 55 && "🎨 Crafting hero section and layout..."}
          {displayProgress >= 55 && displayProgress < 75 && "📝 Adding content sections..."}
          {displayProgress >= 75 && displayProgress < 90 && "🔧 Building contact forms..."}
          {displayProgress >= 90 && "✨ Finalizing your masterpiece..."}
        </p>
        <p className="text-xs text-gray-400 mt-2">This usually takes 3-5 minutes</p>
      </div>
    </div>
  )
}

export default function LivePreview({ 
  currentFiles, 
  completedComponents, 
  isDarkMode = false,
  generationProgress = 0,
  isGenerating = false,
  generationState = 'idle',
  userInput,
  currentComponent = ''
}: LivePreviewProps) {
  const [previewContent, setPreviewContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const generatePreviewContent = () => {
    if (!completedComponents.length && !isGenerating) {
      setPreviewContent(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI Website Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            h1 { font-size: 2rem; margin-bottom: 1rem; }
            p { font-size: 1.1rem; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div>
            <h1>🤖 AI Website Builder</h1>
            <p>Generate your website components to see the live preview here!</p>
          </div>
        </body>
        </html>
      `)
      return
    }

    console.log('🔍 Generating preview content...')

    const renderOrder = ['header', 'hero', 'about-us', 'services', 'contact-form', 'footer']
    let combinedHTML = ''
    let combinedCSS = ''
    let combinedJS = ''

    renderOrder.forEach(componentName => {
      if (completedComponents.includes(componentName)) {
        const component = currentFiles[componentName]
        if (component && component[`${componentName}.html`]) {
          combinedHTML += component[`${componentName}.html`] + '\n'
          
          if (component[`${componentName}.css`]) {
            combinedCSS += component[`${componentName}.css`] + '\n'
          }
          
          if (component[`${componentName}.js`]) {
            combinedJS += component[`${componentName}.js`] + '\n'
          }
        }
      }
    })

      // ✅ ADD: Include any components not in renderOrder (safety net)
  completedComponents.forEach(componentName => {
    if (!renderOrder.includes(componentName)) {
      const component = currentFiles[componentName]
      if (component && component[`${componentName}.html`]) {
        console.log(`📝 Adding unlisted component: ${componentName}`)
        combinedHTML += component[`${componentName}.html`] + '\n'
        
        if (component[`${componentName}.css`]) {
          combinedCSS += component[`${componentName}.css`] + '\n'
        }
        
        if (component[`${componentName}.js`]) {
          combinedJS += component[`${componentName}.js`] + '\n'
        }
      }
    }
  })
    const completeHTML = `
<!DOCTYPE html>
<html lang="en" ${isDarkMode ? 'class="dark"' : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  
  <style>
    /* ✅ Enhanced base styles for proper iframe display */
    * {
      box-sizing: border-box;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      font-family: 'Lato', sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }
    
    body {
      overflow-y: auto;
      min-height: 100vh;
      padding-top: 0; /* ✅ Remove any default padding */
    }
    
    /* ✅ CRITICAL FIX: Add margin to push content below iframe header */
    body > *:first-child,
    header:first-child,
    .header-section:first-child {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    /* ✅ Header positioning fix */
    header, .header-section {
      position: relative !important;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1rem 0;
      width: 100%;
    }
    
    /* ✅ Ensure proper section spacing */
    section {
      width: 100%;
      clear: both;
    }
    
    /* Custom component styles */
    ${combinedCSS}
  </style>
  
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: { DEFAULT: '#C25E3E', 500: '#C25E3E' },
            secondary: { DEFAULT: '#708A63', 500: '#708A63' },
            accent: { DEFAULT: '#F5B749', 500: '#F5B749' }
          }
        }
      }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      // Ensure body is scrollable
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      
      // Smooth scrolling for navigation
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach(link => {
        link.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    });
  </script>
</head>
<body>
  ${combinedHTML}
  
  <script>
    ${combinedJS}
  </script>
</body>
</html>`

    setPreviewContent(completeHTML)
    console.log('✅ Preview content generated')
  }

  useEffect(() => {
    generatePreviewContent()
  }, [currentFiles, completedComponents, isDarkMode])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      generatePreviewContent()
      setIsLoading(false)
    }, 500)
  }

  const handlePreviewInNewTab = () => {
    if (previewContent) {
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(previewContent)
        newWindow.document.close()
      }
    }
  }

  const getViewportStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    }

    switch (viewMode) {
      case 'mobile':
        return { ...baseStyles, width: '375px', height: '667px' }
      case 'tablet':
        return { ...baseStyles, width: '768px', height: '800px' }
      default:
        return { ...baseStyles, width: '100%', height: '100%', minHeight: '600px' }
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="px-3 py-1"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tablet')}
                className="px-3 py-1"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="px-3 py-1"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewInNewTab}
              disabled={!previewContent || isGenerating}
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isGenerating}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 bg-gray-50">
        {/* ✅ Show Loading Animation During Generation */}
        {(isGenerating || generationState === 'generating') ? (
          <LoadingAnimation progress={generationProgress} />
        ) : (
          /* ✅ Enhanced iframe container with proper spacing */
          <div className="flex items-center justify-center h-full p-4">
            <div 
              className="bg-white transition-all duration-300 relative"
              style={getViewportStyles()}
            >
              {/* ✅ Iframe with enhanced scroll and display handling */}
              <iframe
                ref={iframeRef}
                srcDoc={previewContent}
                className="w-full h-full"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px'
                }}
                sandbox="allow-scripts allow-same-origin"
                title="Website Preview"
                scrolling="auto"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}