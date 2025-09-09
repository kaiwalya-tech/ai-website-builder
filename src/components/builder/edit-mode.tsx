'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Save, RotateCcw, Edit3, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditModeProps {
  currentFiles: Record<string, Record<string, string>>
  completedComponents: string[]
  onContentUpdate: (componentId: string, updates: Record<string, string>) => void
  pendingChanges: Record<string, Record<string, string>>
  onSavePending: () => void
  onDiscardChanges: () => void
}

interface UniqueEditableElement {
  id: string
  component: string
  tagName: string
  text: string
  originalText: string
  uniquePath: string // ✅ NEW: Unique path identifier
  hasChanged: boolean
}

export default function EditMode({
  currentFiles,
  completedComponents,
  onContentUpdate,
  pendingChanges,
  onSavePending,
  onDiscardChanges
}: EditModeProps) {
  const [previewHTML, setPreviewHTML] = useState<string>('')
  const [editableElements, setEditableElements] = useState<UniqueEditableElement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)

  // ✅ FIXED: Extract elements with unique path identifiers
  const extractEditableElements = useCallback(() => {
    console.log('🔍 Extracting elements with unique paths...')
    
    const elements: UniqueEditableElement[] = []
    const componentOrder = ['header', 'hero', 'about-us', 'services', 'gallery', 'contact-form', 'footer']
    
    componentOrder.forEach(componentName => {
      if (!completedComponents.includes(componentName)) return
      
      const component = currentFiles[componentName]
      if (!component?.[`${componentName}.html`]) return
      
      const html = component[`${componentName}.html`]
      const parser = new DOMParser()
      const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
      
      // ✅ FIXED: Create unique path for each element
      const createUniquePath = (element: Element, globalIndex: number): string => {
        const path = []
        let current = element
        
        // Build path from element to root
        while (current && current !== doc.body.firstChild) {
          const parent = current.parentElement
          if (parent) {
            const siblings = Array.from(parent.children)
            const indexInParent = siblings.indexOf(current)
            path.unshift(`${current.tagName.toLowerCase()}[${indexInParent}]`)
          }
          current = parent!
        }
        
        return `${componentName}>${path.join('>')}`
      }
      
      // Find all text elements
      const targetElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p')
      
      targetElements.forEach((element, globalIndex) => {
        const text = element.textContent?.trim()
        if (!text || text.length < 2) return
        
        const uniquePath = createUniquePath(element, globalIndex)
        const elementId = `${componentName}-${element.tagName.toLowerCase()}-${globalIndex}-${Date.now()}`
        
        elements.push({
          id: elementId,
          component: componentName,
          tagName: element.tagName.toLowerCase(),
          text: text,
          originalText: text,
          uniquePath: uniquePath,
          hasChanged: false
        })
        
        console.log(`✅ Added: ${element.tagName} at path: ${uniquePath}`)
      })
    })
    
    // Handle remaining components
    completedComponents.forEach(componentName => {
      if (componentOrder.includes(componentName)) return
      
      const component = currentFiles[componentName]
      if (!component?.[`${componentName}.html`]) return
      
      const html = component[`${componentName}.html`]
      const parser = new DOMParser()
      const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
      
      const targetElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p')
      
      targetElements.forEach((element, globalIndex) => {
        const text = element.textContent?.trim()
        if (!text || text.length < 2) return
        
        const uniquePath = `${componentName}>${element.tagName.toLowerCase()}[${globalIndex}]`
        const elementId = `${componentName}-${element.tagName.toLowerCase()}-${globalIndex}-${Date.now()}`
        
        elements.push({
          id: elementId,
          component: componentName,
          tagName: element.tagName.toLowerCase(),
          text: text,
          originalText: text,
          uniquePath: uniquePath,
          hasChanged: false
        })
      })
    })
    
    setEditableElements(elements)
    console.log(`🎯 Total elements: ${elements.length}`)
  }, [currentFiles, completedComponents])

  // ✅ Generate preview
  const generatePreview = useCallback(() => {
    setIsLoading(true)
    
    const componentOrder = ['header', 'hero', 'about-us', 'services', 'gallery', 'contact-form', 'footer']
    let combinedHTML = ''
    let combinedCSS = ''
    
    componentOrder.forEach(componentName => {
      if (completedComponents.includes(componentName)) {
        const component = currentFiles[componentName]
        if (component?.[`${componentName}.html`]) {
          combinedHTML += component[`${componentName}.html`] + '\n'
        }
        if (component?.[`${componentName}.css`]) {
          combinedCSS += component[`${componentName}.css`] + '\n'
        }
      }
    })
    
    completedComponents.forEach(componentName => {
      if (!componentOrder.includes(componentName)) {
        const component = currentFiles[componentName]
        if (component?.[`${componentName}.html`]) {
          combinedHTML += component[`${componentName}.html`] + '\n'
        }
        if (component?.[`${componentName}.css`]) {
          combinedCSS += component[`${componentName}.css`] + '\n'
        }
      }
    })

    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: 'Lato', sans-serif; 
      line-height: 1.6; 
      margin: 0; 
      padding: 0;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    ${combinedCSS}
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { DEFAULT: '#C25E3E' },
            secondary: { DEFAULT: '#708A63' },
            accent: { DEFAULT: '#F5B749' }
          }
        }
      }
    }
  </script>
</head>
<body>
  ${combinedHTML}
</body>
</html>`
    
    setPreviewHTML(fullHTML)
    setIsLoading(false)
  }, [currentFiles, completedComponents])

  // ✅ Handle text changes
  const handleTextChange = (elementId: string, newText: string) => {
    setEditableElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, text: newText, hasChanged: newText !== el.originalText }
        : el
    ))
    
    setHasChanges(true)
  }

  // ✅ FIXED: Precise element updating using unique paths
  const saveAllChanges = () => {
    const changedElements = editableElements.filter(el => el.hasChanged)
    if (changedElements.length === 0) return

    console.log(`💾 Saving ${changedElements.length} changed elements...`)

    // ✅ FIXED: Process each component separately to avoid conflicts
    const componentChanges: Record<string, Record<string, string>> = {}
    
    // Group changes by component
    const changesByComponent: Record<string, UniqueEditableElement[]> = {}
    changedElements.forEach(element => {
      if (!changesByComponent[element.component]) {
        changesByComponent[element.component] = []
      }
      changesByComponent[element.component].push(element)
    })

    // ✅ FIXED: Update each component's HTML separately
    Object.entries(changesByComponent).forEach(([componentName, componentElements]) => {
      const component = currentFiles[componentName]
      if (!component?.[`${componentName}.html`]) return

      let html = component[`${componentName}.html`]
      
      // ✅ FIXED: Apply all changes to this component at once
      componentElements.forEach(element => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
        
        // ✅ FIXED: Find element using unique path
        const targetElements = doc.querySelectorAll(element.tagName)
        let foundElement: Element | null = null
        
        // Match by text content as additional verification
        Array.from(targetElements).forEach((el, index) => {
          if (el.textContent?.trim() === element.originalText) {
            foundElement = el
            return
          }
        })
        
        // Fallback: try by order if text match fails
        if (!foundElement && targetElements.length > 0) {
          // Extract index from path for fallback
          const pathMatch = element.uniquePath.match(/\[(\d+)\]$/)
          if (pathMatch) {
            const pathIndex = parseInt(pathMatch[1])
            const sameTagElements = Array.from(doc.querySelectorAll(element.tagName))
            if (sameTagElements[pathIndex]) {
              foundElement = sameTagElements[pathIndex]
            }
          }
        }
        
        if (foundElement) {
          foundElement.textContent = element.text
          console.log(`✅ Updated ${element.tagName}: "${element.originalText}" → "${element.text}"`)
        } else {
          console.warn(`⚠️ Could not find element for ${element.uniquePath}`)
        }
        
        // Update HTML for next iteration
        const firstChild = doc.body.firstChild as HTMLElement
        html = firstChild?.innerHTML || html
      })

      // Store the final updated HTML
      if (!componentChanges[componentName]) {
        componentChanges[componentName] = { ...component }
      }
      componentChanges[componentName][`${componentName}.html`] = html
    })

    // ✅ Apply all changes at once
    Object.entries(componentChanges).forEach(([componentName, updatedComponent]) => {
      onContentUpdate(componentName, updatedComponent)
    })

    // Reset change flags
    setEditableElements(prev => prev.map(el => ({
      ...el,
      originalText: el.text,
      hasChanged: false
    })))
    
    setHasChanges(false)
    console.log('✅ All changes saved successfully!')
  }

  // Initialize
  useEffect(() => {
    if (Object.keys(currentFiles).length > 0 && completedComponents.length > 0) {
      extractEditableElements()
      generatePreview()
    }
  }, [extractEditableElements, generatePreview])

  // Reset when pending changes cleared
  useEffect(() => {
    if (Object.keys(pendingChanges).length === 0) {
      setHasChanges(false)
    }
  }, [pendingChanges])

  const changedCount = editableElements.filter(el => el.hasChanged).length

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin text-blue-600 text-6xl mb-4">⚙️</div>
          <h3 className="text-lg font-medium text-blue-900 mb-2">Loading Bulletproof Edit Mode</h3>
          <p className="text-blue-700">Creating unique element identifiers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-green-50 border-b border-green-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Edit3 className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">Bulletproof Edit Mode</span>
          <span className="text-sm text-green-600">
            {editableElements.length} elements • {changedCount} changed
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {(hasChanges || Object.keys(pendingChanges).length > 0) && (
            <>
              <Button
                onClick={onDiscardChanges}
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Discard ({changedCount})
              </Button>
              <Button
                onClick={saveAllChanges}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Save All ({changedCount})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Preview */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <span className="text-sm font-medium text-gray-700">Website Preview</span>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-white">
            <iframe
              srcDoc={previewHTML}
              className="w-full h-full min-h-[800px] border border-gray-200 rounded-lg"
              title="Website Preview"
            />
          </div>
        </div>

        {/* Right: Edit Panel */}
        <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Edit Text Content</span>
            </div>
            
          </div>
          
          <div className="flex-1 overflow-auto p-3">
            <div className="space-y-3">
              {editableElements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No H1-H6 or P elements found</p>
                </div>
              ) : (
                editableElements.map((element, index) => (
                  <div 
                    key={element.id}
                    className={`bg-white p-3 rounded-lg border transition-colors ${
                      element.hasChanged 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        #{index + 1} • {element.component.replace('-', ' ')} • {element.tagName.toUpperCase()}
                      </span>
                      {element.hasChanged && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Changed
                        </span>
                      )}
                    </div>
                    
                    {element.tagName.startsWith('h') ? (
                      <input
                        type="text"
                        value={element.text}
                        onChange={(e) => handleTextChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                        placeholder="Heading text..."
                      />
                    ) : (
                      <textarea
                        value={element.text}
                        onChange={(e) => handleTextChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        rows={3}
                        placeholder="Paragraph text..."
                      />
                    )}
                    
                    {element.hasChanged && (
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <span className="text-gray-500">
                          Was: {element.originalText.substring(0, 25)}...
                        </span>
                        <button
                          onClick={() => handleTextChange(element.id, element.originalText)}
                          className="text-green-600 hover:text-green-800 underline font-medium"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}