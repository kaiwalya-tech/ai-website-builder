'use client'

import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Code, Palette, Save } from 'lucide-react'

interface CodeEditorProps {
  currentFiles: any
  selectedComponent: string
  onComponentSelect: (component: string) => void
  completedComponents: string[]
  onCodeChange?: (componentName: string, fileType: string, newCode: string) => void
}

export default function CodeEditor({
  currentFiles,
  selectedComponent,
  onComponentSelect,
  completedComponents,
  onCodeChange
}: CodeEditorProps) {
  const [activeFileType, setActiveFileType] = useState<'html' | 'css' | 'js'>('html')
  const [editorContent, setEditorContent] = useState<string>('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (selectedComponent && currentFiles[selectedComponent]) {
      const component = currentFiles[selectedComponent]
      const fileName = `${selectedComponent}.${activeFileType}`
      const content = component[fileName] || ''
      setEditorContent(content)
      setHasUnsavedChanges(false)
    }
  }, [selectedComponent, activeFileType, currentFiles])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value)
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveChanges = () => {
    if (selectedComponent && onCodeChange) {
      onCodeChange(selectedComponent, activeFileType, editorContent)
      setHasUnsavedChanges(false)
    }
  }

  const getLanguageForFileType = (fileType: string) => {
    switch (fileType) {
      case 'html': return 'html'
      case 'css': return 'css'
      case 'js': return 'javascript'
      default: return 'plaintext'
    }
  }

  return (
    <Card className="h-full flex flex-col bg-white border border-gray-200 shadow-sm"> {/* ✅ Light styling */}
      <CardHeader className="pb-3 bg-gray-50 border-b border-gray-200"> {/* ✅ Light header */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-gray-800"> {/* ✅ Dark text */}
            <Code className="h-5 w-5 mr-2 text-gray-600" />
            Code Editor
            {hasUnsavedChanges && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                Unsaved
              </span>
            )}
          </CardTitle>
          {hasUnsavedChanges && (
            <Button size="sm" onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>

        {/* ✅ Component Selector with Proper Ordering */}
        <div className="flex flex-wrap gap-2 mt-2">
          {/* ✅ Define proper order */}
          {(() => {
            const componentOrder = ['header', 'hero', 'about-us', 'services', 'contact-form', 'photo-gallery', 'testimonials', 'location', 'social', 'footer']
            const orderedComponents = componentOrder.filter(comp => completedComponents.includes(comp))

            return orderedComponents.map(component => (
              <Button
                key={component}
                variant={selectedComponent === component ? 'default' : 'outline'}
                size="sm"
                onClick={() => onComponentSelect(component)}
                className="text-xs"
              >
                <span className="capitalize">{component.replace('-', ' ')}</span>
              </Button>
            ))
          })()}
        </div>

      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 bg-white"> {/* ✅ Light content area */}
        {selectedComponent ? (
          <>
            {/* File Type Tabs */}
            <div className="flex border-b px-4 py-2 bg-gray-50"> {/* ✅ Light tabs */}
              {(['html', 'css', 'js'] as const).map(fileType => (
                <Button
                  key={fileType}
                  variant={activeFileType === fileType ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveFileType(fileType)}
                  className="mr-2 flex items-center"
                >
                  {fileType === 'html' && <FileText className="h-4 w-4 mr-1" />}
                  {fileType === 'css' && <Palette className="h-4 w-4 mr-1" />}
                  {fileType === 'js' && <Code className="h-4 w-4 mr-1" />}
                  <span className="capitalize">{fileType}</span>
                </Button>
              ))}
            </div>

            {/* Monaco Editor with light theme */}
            <div className="flex-1 bg-white"> {/* ✅ Light background */}
              <Editor
                height="100%"
                language={getLanguageForFileType(activeFileType)}
                value={editorContent}
                onChange={handleEditorChange}
                theme="vs" // ✅ Light theme
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  readOnly: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  folding: true,
                  contextmenu: true,
                  quickSuggestions: true
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50"> {/* ✅ Light placeholder */}
            <div className="text-center">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a component to view its code</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

  )
}