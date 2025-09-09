'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Folder, Plus } from 'lucide-react'

interface FileExplorerProps {
  currentFiles: any
  onFileSelect: (fileName: string, fileType: string) => void
  selectedFile: string
}

export default function FileExplorer({ currentFiles, onFileSelect, selectedFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['components'])

  const globalFiles = [
    { name: 'index.html', type: 'html', icon: <FileText className="h-4 w-4" /> },
    { name: 'styles.css', type: 'css', icon: <FileText className="h-4 w-4" /> },
    { name: 'script.js', type: 'js', icon: <FileText className="h-4 w-4" /> }
  ]

  return (
    <Card className="w-64 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Folder className="h-4 w-4 mr-2" />
          File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        {/* Global Files */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Global Files</div>
          {globalFiles.map(file => (
            <Button
              key={file.name}
              variant={selectedFile === file.name ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFileSelect(file.name, file.type)}
              className="w-full justify-start text-xs mb-1"
            >
              {file.icon}
              <span className="ml-2">{file.name}</span>
            </Button>
          ))}
        </div>

        {/* Component Files */}
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">Components</div>
          {Object.keys(currentFiles).map(component => (
            <div key={component} className="mb-2">
              <div className="text-xs font-medium text-gray-700 mb-1">{component}</div>
              {['html', 'css', 'js'].map(ext => (
                <Button
                  key={`${component}.${ext}`}
                  variant={selectedFile === `${component}.${ext}` ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onFileSelect(`${component}.${ext}`, ext)}
                  className="w-full justify-start text-xs mb-1 ml-4"
                >
                  <FileText className="h-3 w-3 mr-2" />
                  {component}.{ext}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
