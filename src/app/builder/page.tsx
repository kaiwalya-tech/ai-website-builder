'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import JSZip from 'jszip'
import SimpleLoadingChat from '@/components/builder/SimpleLoadingChat'
import AnimatedPreview from '@/components/builder/AnimatedPreview'
import AIChat from '@/components/builder/ai-chat'
import CodeEditor from '@/components/builder/code-editor'
import EditMode from '@/components/builder/edit-mode'
import LivePreview from '@/components/builder/live-preview'
import {
  Eye,
  Edit3,
  MessageSquare,
  Code,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle,
  X,
  Zap
} from 'lucide-react'

interface UserInput {
  businessDescription: string
  websiteType: string
  userEmail: string
  selectedFeatures: string[]
  colorScheme: 'light' | 'dark'
}

export default function BuilderPage() {
  const [userInput, setUserInput] = useState<UserInput | null>(null)
  const [leftMode, setLeftMode] = useState<'preview' | 'edit'>('preview')
  const [rightMode, setRightMode] = useState<'chat' | 'editor'>('chat')
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [generationState, setGenerationState] = useState<'idle' | 'processing' | 'generating' | 'complete' | 'error'>('idle')
  const [generationProgress, setGenerationProgress] = useState<number>(0)
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const [generationLogs, setGenerationLogs] = useState<string[]>([])
  const [userId, setUserId] = useState<string>('')
  const [completedComponents, setCompletedComponents] = useState<string[]>([])
  const [currentFiles, setCurrentFiles] = useState<Record<string, Record<string, string>>>({})
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [selectedComponent, setSelectedComponent] = useState<string>('')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  // const [fakeProgress, setFakeProgress] = useState(0)
  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [currentComponent, setCurrentComponent] = useState<string>('')
  // ✅ Add these new state variables (add to your existing state)
  const [editableContent, setEditableContent] = useState<Record<string, any>>({})
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, string>>>({})
  const abortControllerRef = useRef<AbortController | null>(null)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const savingRef = useRef(false)
  const [chatProgress, setChatProgress] = useState(0)

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  // ✅ KEEP THIS - Simple initialization without cleanup conflicts
  useEffect(() => {
    const stored = localStorage.getItem('userInput')
    if (stored && window.location.pathname === '/builder') {
      const input = JSON.parse(stored)
      setUserInput(input)
      startWebsiteGeneration(input)
    }
  }, []) // No cleanup needed here since startWebsiteGeneration handles it

  // ✅ ADD this useEffect after your existing useEffects
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('Failed to fetch')) {
        console.log('🔄 Server connection lost, stopping polling')
        stopFilePolling()
        setGenerationState('error')
        addGenerationLog('❌ Connection lost - please restart the server')
      }
    }

    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])


  const addGenerationLog = (message: string) => {
    setGenerationLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const getDeviceWidth = () => {
    switch (deviceView) {
      case 'tablet': return 'max-w-2xl'
      case 'mobile': return 'max-w-sm'
      default: return 'w-full'
    }
  }

  // ✅ Add this function with proper typing
  const handleChatCodeUpdate = (componentName: string, updatedCode: any) => {
    setCurrentFiles((prev: Record<string, any>) => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        ...updatedCode
      }
    }))

    addGenerationLog(`🤖 AI updated ${componentName} component`)
  }


  // ✅ Add enhanced logging in startWebsiteGeneration
  const startWebsiteGeneration = async (input: UserInput) => {
    setGenerationState('processing')
    setGenerationProgress(10)
    addGenerationLog('🔄 Processing your requirements...')

    try {
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input })
      })

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        const userId = result.data?.userId || result.userId || `user_${Date.now()}`
        setUserId(userId)
        addGenerationLog(`✅ Project created: ${userId}`)

        const expectedCount = result.data?.expectedCount || result.expectedCount || 3

        // ✅ Enhanced debugging
        console.log('🔍 DEBUG - Generation result:', {
          expectedCount,
          resultData: result.data,
          aiComponents: result.data?.aiComponents || 'not found'
        })

        addGenerationLog(`📊 Expecting ${expectedCount} components`)
        startFilePolling(userId, expectedCount)
      } else {
        console.error('Generation failed:', result.error)
        addGenerationLog(`❌ Generation failed: ${result.error}`)
        setGenerationState('error')
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      addGenerationLog(`❌ Error: ${error.message}`)
      setGenerationState('error')
    }
  }






  const startFilePolling = useCallback((userId: string, expectedComponents: number) => {
    console.log(`🔄 Starting enhanced polling: userId=${userId}, expected=${expectedComponents}`)

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    setIsPolling(true)
    let pollCount = 0
    let failureCount = 0
    const maxPolls = 20 // Reduce max attempts
    const maxFailures = 3 // Stop after 3 consecutive failures

    const pollFiles = async () => {
      try {
        // Create new abort controller for this request
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        pollCount++
        console.log(`📊 Enhanced poll ${pollCount}/${maxPolls}`)

        const response = await fetch('/api/manage-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getFiles',
            userId: userId
          }),
          signal: signal // ✅ Add abort signal
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const result = await response.json()

        if (result.success && result.components) {
          const componentCount = result.components.length
          console.log(`📄 Found ${componentCount}/${expectedComponents} components: [${result.components.join(', ')}]`)

          // ✅ Reset failure count on success
          failureCount = 0

          if (result.files) {
            setCurrentFiles(result.files)
            setCompletedComponents(result.components)
            setGenerationProgress(100)
          }

          // ✅ Enhanced stopping conditions with detailed logging
          const hasAllComponents = componentCount >= expectedComponents
          const hasMinimumComponents = pollCount >= 10 && componentCount >= Math.ceil(expectedComponents * 0.6)
          const reachedMaxPolls = pollCount >= maxPolls

          console.log(`🔍 Stop conditions: hasAll=${hasAllComponents}, hasMin=${hasMinimumComponents}, maxReached=${reachedMaxPolls}`)

          if (hasAllComponents || hasMinimumComponents || reachedMaxPolls) {
            const efficiency = Math.round((componentCount / expectedComponents) * 100)
            console.log(`✅ STOPPING POLLING: ${componentCount}/${expectedComponents} components (${efficiency}%)`)
            stopFilePolling()
            setGenerationState('complete')
            addGenerationLog(`✅ Loaded ${componentCount} components: ${result.components.join(', ')}`)
            return // ✅ Critical: Return immediately after stopping
          }
        } else {
          console.warn('⚠️ Invalid response or no components found')
        }

      } catch (error) {
        failureCount++
        console.error(`❌ Polling error ${failureCount}/${maxFailures}:`, error)
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('🚫 Polling request aborted')
          return
        }
        // ✅ Stop on connection errors (server down)
        if (error instanceof Error && error.message.includes('Failed to fetch')) {
          console.log('🔌 Server disconnected - stopping polling immediately')
          stopFilePolling()
          setGenerationState('complete') // Mark as complete with available components
          return
        }

        // ✅ Stop after max failures
        if (failureCount >= maxFailures) {
          console.log('💀 Max failures reached - stopping polling')
          stopFilePolling()
          setGenerationState('error')
          addGenerationLog('❌ Multiple polling failures - using available components')
          return
        }
      }

      // ✅ Stop if max polls reached
      if (pollCount >= maxPolls) {
        console.log('⏰ Max polling attempts reached - completing')
        stopFilePolling()
        setGenerationState('complete')
        addGenerationLog('⚠️ Polling timeout - using available components')
      }
    }

    // Start polling immediately
    pollFiles()

    // ✅ Set interval with exponential backoff on failures
    const getNextInterval = () => {
      const baseInterval = 3000
      const backoffInterval = baseInterval + (failureCount * 2000) // Add 2s per failure
      return Math.min(backoffInterval, 15000) // Cap at 15 seconds
    }

    const scheduleNextPoll = () => {
      if (!pollingIntervalRef.current) return // Don't schedule if already stopped

      const interval = getNextInterval()
      pollingIntervalRef.current = setTimeout(() => {
        pollFiles()
        scheduleNextPoll() // Recursively schedule next poll
      }, interval)
    }

    scheduleNextPoll()

  }, [])



  // ✅ Enhanced stopFilePolling with abort controller
  const stopFilePolling = useCallback(() => {
    console.log('🛑 Stopping file polling with cleanup')

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      clearTimeout(pollingIntervalRef.current) // Also clear timeout
      pollingIntervalRef.current = null
    }

    // ✅ Abort any ongoing fetch requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    setIsPolling(false)
  }, [])

  // ✅ REPLACE the cleanup useEffect
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])



  // ✅ FIXED: Enhanced handleContentUpdate with debouncing
  const handleContentUpdate = (componentId: string, updatedComponent: Record<string, string>) => {
    console.log('📝 Content updated:', componentId)

    // Clear any pending update
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    // Debounce rapid updates
    updateTimeoutRef.current = setTimeout(() => {
      // Update current files
      setCurrentFiles(prev => ({
        ...prev,
        [componentId]: updatedComponent
      }))

      // Add to pending changes
      setPendingChanges(prev => ({
        ...prev,
        [componentId]: updatedComponent
      }))

      console.log('✅ Component update tracked for:', componentId)
      addGenerationLog(`📝 Updated ${componentId} component - ready to save`)
    }, 200) // 200ms debounce
  }

  // ✅ CORRECTED: Enhanced save function with proper TypeScript
  const savePendingChanges = async () => {
    if (savingRef.current) {
      console.log('🔄 Save already in progress, skipping...')
      return
    }

    savingRef.current = true
    console.log('💾 Saving all pending changes...')

    try {
      const changeKeys = Object.keys(pendingChanges)
      if (changeKeys.length === 0) {
        console.log('No pending changes to save')
        return
      }

      addGenerationLog(`💾 Saving ${changeKeys.length} component(s)...`)

      for (const componentId of changeKeys) {
        const componentData = pendingChanges[componentId]
        console.log(`💾 Saving ${componentId}...`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        try {
          const response = await fetch('/api/manage-files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'saveComponent',
              userId: userId,
              componentName: componentId,
              files: componentData
            }),
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }

          const result = await response.json()
          if (!result.success) {
            throw new Error(`API Error: ${result.error || 'Unknown error'}`)
          }

          console.log(`✅ Successfully saved ${componentId}`)

        } catch (fetchError: any) {
          clearTimeout(timeoutId)
          if (fetchError.name === 'AbortError') {
            throw new Error(`Save timeout for ${componentId}`)
          }
          throw new Error(`Failed to save ${componentId}: ${fetchError.message}`)
        }
      }

      setPendingChanges({})
      addGenerationLog(`✅ Successfully saved all changes: ${changeKeys.join(', ')}`)
      console.log('🎉 All changes saved successfully!')

    } catch (error: any) {
      console.error('❌ Save failed:', error)
      addGenerationLog(`❌ Save failed: ${error.message || 'Unknown error'}`)
      alert(`Failed to save changes: ${error.message}\n\nPlease check your connection and try again.`)
    } finally {
      savingRef.current = false
    }
  }





  // ✅ ADD - Discard changes
  const discardChanges = () => {
    setPendingChanges({})
    addGenerationLog('🔄 Changes discarded')
  }

  // ✅ ADD this debug useEffect to see when state updates
  useEffect(() => {
    console.log('📊 State Update - Current Files:', Object.keys(currentFiles))
    console.log('📊 State Update - Completed Components:', completedComponents)
  }, [currentFiles, completedComponents])


  // ✅ Enhanced mode toggle with better error handling
  const handleModeToggle = (mode: 'preview' | 'edit') => {
    console.log('🔄 Switching to mode:', mode)

    // Stop polling when switching to edit mode
    if (mode === 'edit') {
      stopFilePolling()
    }

    // Check if we have files before switching to preview
    if (mode === 'preview' && Object.keys(currentFiles).length === 0) {
      addGenerationLog('⚠️ No files available for preview')
    }

    setLeftMode(mode)
  }




  // ✅ Fix: Add proper type annotation
  const handleCodeChange = (componentName: string, fileType: string, newCode: string) => {
    setCurrentFiles((prev: Record<string, any>) => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        [`${componentName}.${fileType}`]: newCode
      }
    }))

    addGenerationLog(`📝 Updated ${componentName}.${fileType}`)
  }

  // ✅ Add download function
  const downloadWebsite = async () => {
    if (!userId) return
  
    try {
      console.log('🔄 Starting enhanced website download...')
      addGenerationLog('📦 Preparing complete website package...')
  
      // ✅ STEP 1: Create combined HTML file
      const combinedWebsite = createCombinedWebsite()
  
      // ✅ STEP 2: Create zip with both formats
      const zip = new JSZip()
      
      // Add the single working HTML file
      zip.file('index.html', combinedWebsite.html)
      zip.file('styles.css', combinedWebsite.css)
      zip.file('scripts.js', combinedWebsite.js)
      
      // Also add the all-in-one file
      zip.file('complete-website.html', combinedWebsite.combined)
      
      // Add individual components in a separate folder
      const componentsFolder = zip.folder('components')
      Object.entries(currentFiles).forEach(([componentName, files]) => {
        Object.entries(files).forEach(([fileName, content]) => {
          componentsFolder?.file(fileName, content)
        })
      })
      
      // Add README with instructions
      const readme = `
  # Your Website Files
  
  ## Quick Start (Recommended)
  1. Open 'complete-website.html' in any web browser - this is your complete working website!
  2. This file contains everything and works immediately without any setup.
  
  ## Alternative Files
  - index.html: Main HTML structure
  - styles.css: All CSS styles
  - scripts.js: All JavaScript functionality
  
  ## Components Folder
  Contains individual component files for development/customization.
  
  ## How to Use
  - For immediate viewing: Open 'complete-website.html'
  - For hosting: Upload 'complete-website.html' to any web server
  - For development: Use the individual files in components/ folder
  
  Generated by AI Website Builder
      `
      
      zip.file('README.txt', readme.trim())
  
      // Generate and download
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `website-${userId}-complete.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
  
      addGenerationLog('✅ Website package downloaded successfully!')
      console.log('✅ Enhanced download completed')
  
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('❌ Download failed:', errorMessage)
      addGenerationLog(`❌ Download failed: ${errorMessage}`)
    }
  }
  
  // ✅ STEP 3: Add this new function to combine all components
  const createCombinedWebsite = () => {
    console.log('🔧 Creating combined website...')
    
    // Define component order for proper structure
    const componentOrder = ['header', 'hero', 'about-us', 'services', 'gallery', 'contact-form', 'footer']
    
    let combinedHTML = ''
    let combinedCSS = ''
    let combinedJS = ''
    
    // Combine components in proper order
    componentOrder.forEach(componentName => {
      if (completedComponents.includes(componentName) && currentFiles[componentName]) {
        const component = currentFiles[componentName]
        
        // Add HTML content
        if (component[`${componentName}.html`]) {
          combinedHTML += component[`${componentName}.html`] + '\n'
        }
        
        // Add CSS content
        if (component[`${componentName}.css`]) {
          combinedCSS += component[`${componentName}.css`] + '\n'
        }
        
        // Add JS content
        if (component[`${componentName}.js`]) {
          combinedJS += component[`${componentName}.js`] + '\n'
        }
      }
    })
    
    // Add any remaining components not in the standard order
    completedComponents.forEach(componentName => {
      if (!componentOrder.includes(componentName) && currentFiles[componentName]) {
        const component = currentFiles[componentName]
        
        if (component[`${componentName}.html`]) {
          combinedHTML += component[`${componentName}.html`] + '\n'
        }
        if (component[`${componentName}.css`]) {
          combinedCSS += component[`${componentName}.css`] + '\n'
        }
        if (component[`${componentName}.js`]) {
          combinedJS += component[`${componentName}.js`] + '\n'
        }
      }
    })
  
    // ✅ Create complete HTML with all dependencies
    const completeHTML = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Website - Generated by AI</title>
      
      <!-- Tailwind CSS CDN -->
      <script src="https://cdn.tailwindcss.com"></script>
      
      <!-- Google Fonts -->
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
      
      <!-- Font Awesome Icons -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      
      <!-- Tailwind Config -->
      <script>
          tailwind.config = {
              darkMode: 'class',
              theme: {
                  extend: {
                      colors: {
                          primary: { DEFAULT: '#C25E3E', 500: '#C25E3E' },
                          secondary: { DEFAULT: '#708A63', 500: '#708A63' },
                          accent: { DEFAULT: '#F5B749', 500: '#F5B749' }
                      },
                      fontFamily: {
                          'serif': ['Playfair Display', 'serif'],
                          'sans': ['Lato', 'sans-serif']
                      }
                  }
              }
          }
      </script>
      
      <!-- Custom Styles -->
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Lato', sans-serif;
              line-height: 1.6;
              color: #333;
          }
          
          .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 1rem;
          }
          
          /* Ensure proper stacking and layout */
          header { position: relative; z-index: 50; }
          section { position: relative; width: 100%; }
          footer { position: relative; width: 100%; margin-top: auto; }
          
          /* Component-specific styles */
          ${combinedCSS}
          
          /* Smooth scrolling */
          html { scroll-behavior: smooth; }
          
          /* Responsive improvements */
          @media (max-width: 768px) {
              .container { padding: 0 0.5rem; }
          }
      </style>
  </head>
  <body>
      ${combinedHTML}
      
      <!-- Combined JavaScript -->
      <script>
          // Ensure DOM is ready
          document.addEventListener('DOMContentLoaded', function() {
              console.log('Website loaded successfully!');
              
              // Combined component scripts
              ${combinedJS}
              
              // Additional smooth scrolling for anchor links
              document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                  anchor.addEventListener('click', function (e) {
                      e.preventDefault();
                      const target = document.querySelector(this.getAttribute('href'));
                      if (target) {
                          target.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start'
                          });
                      }
                  });
              });
          });
      </script>
  </body>
  </html>`
  
    return {
      html: combinedHTML,
      css: combinedCSS,
      js: combinedJS,
      combined: completeHTML
    }
  }
  


  // Add file content display function
  const getFileContent = (componentName: string, fileType: string) => {
    const component = currentFiles[componentName]
    if (!component) return ''

    switch (fileType) {
      case 'html':
        return component[`${componentName}.html`] || ''
      case 'css':
        return component[`${componentName}.css`] || ''
      case 'js':
        return component[`${componentName}.js`] || ''
      default:
        return ''
    }
  }


  if (!userInput) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your website builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">AI Website Builder</h1>
          <div className="text-sm text-gray-500">
            {userInput.colorScheme === 'light' ? '🌞' : '🌙'} {userInput.colorScheme} theme
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* ✅ Add Download Button */}
          {generationState === 'complete' && userId && (
            <Button
              onClick={downloadWebsite}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* ✅ Enhanced Main Split Screen with Proper Scrolling */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Panel - 35% - Chat/Editor Toggle */}
        <div className="bg-white border-r border-gray-200 flex flex-col overflow-hidden" style={{ width: '35%' }}>

          {/* Left Panel Header - Fixed */}
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={rightMode === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRightMode('chat')}
                className="px-4"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button
                variant={rightMode === 'editor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRightMode('editor')}
                className="px-4"
              >
                <Code className="h-4 w-4 mr-2" />
                Code
              </Button>
            </div>
          </div>

          {/* Left Panel Content - Scrollable */}
          <div className="flex-1 overflow-hidden">
            {rightMode === 'chat' ? (
              /* ✅ Enhanced Chat Mode with AnimatedChat */
              generationState === 'complete' && Object.keys(currentFiles).length > 0 ? (
                <AIChat
                  currentFiles={currentFiles}
                  completedComponents={completedComponents}
                  onCodeUpdate={handleChatCodeUpdate}
                  userInput={userInput}
                />
              ) : (
                /* ✅ NEW: Show AnimatedChat while generation in progress */
                <SimpleLoadingChat />

              )
            ) : (
              /* ✅ Code Editor Mode */
              <CodeEditor
                currentFiles={currentFiles}
                selectedComponent={selectedComponent}
                onComponentSelect={setSelectedComponent}
                completedComponents={completedComponents}
                onCodeChange={handleCodeChange}
              />
            )}
          </div>
        </div>

        {/* Right Panel - 65% - Preview/Edit Toggle */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ width: '65%' }}>

          {/* Right Panel Header - Fixed */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={leftMode === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeToggle('preview')}
                className="px-4"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={leftMode === 'edit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeToggle('edit')}
                className="px-4"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              {leftMode === 'preview' ? 'Website Preview' : 'Edit Mode'}
            </div>
          </div>

          {/* Right Panel Content - Scrollable */}
          <div className="flex-1 overflow-hidden">
            {leftMode === 'preview' ? (
              /* ✅ Enhanced Preview Mode with AnimatedPreview */
              generationState === 'complete' && Object.keys(currentFiles).length > 0 ? (
                <LivePreview
                  currentFiles={currentFiles}
                  completedComponents={completedComponents}
                  isDarkMode={isDarkMode}
                  generationState={generationState}
                  userInput={userInput}
                  generationProgress={generationProgress}
                  isGenerating={isGenerating}
                  currentComponent={currentComponent}
                />
              ) : (
                /* ✅ NEW: Show AnimatedPreview while generation in progress */
                <AnimatedPreview 
                isActive={generationState === 'processing' || generationState === 'generating'} 
                onGenerationComplete={() => {
                  // This will be called when animation completes
                  console.log('Animation completed!')
                }}
              />
              )
            ) : (
              <EditMode
                currentFiles={currentFiles}
                completedComponents={completedComponents}
                onContentUpdate={handleContentUpdate}
                pendingChanges={pendingChanges}
                onSavePending={savePendingChanges}
                onDiscardChanges={discardChanges}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )

}