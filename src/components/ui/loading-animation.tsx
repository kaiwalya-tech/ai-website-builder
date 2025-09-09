'use client'

import React, { useState, useEffect } from 'react'

interface LoadingAnimationProps {
  generationProgress?: number
  currentComponent?: string
  completedComponents?: string[]
}

export default function LoadingAnimation({ 
  generationProgress = 0, 
  currentComponent = '',
  completedComponents = []
}: LoadingAnimationProps) {
  const [dots, setDots] = useState('')

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const components = ['header', 'hero', 'about-us', 'services', 'contact-form', 'footer']

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      
      {/* Main Spinner */}
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-indigo-400 rounded-full border-r-transparent animate-spin animation-direction-reverse" style={{ animationDuration: '0.8s' }}></div>
      </div>

      {/* Progress Text */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 AI Website Builder
        </h3>
        <p className="text-lg text-gray-600">
          {currentComponent ? `Generating ${currentComponent}${dots}` : `Creating your website${dots}`}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(generationProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${generationProgress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Component Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-md">
        {components.map((component, index) => {
          const isCompleted = completedComponents.includes(component)
          const isCurrent = currentComponent === component
          
          return (
            <div 
              key={component}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isCompleted 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : isCurrent 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="capitalize">{component.replace('-', ' ')}</span>
                {isCompleted && <span className="text-green-600">✓</span>}
                {isCurrent && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Fun Messages */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 italic">
          {generationProgress < 20 && "🚀 Initializing AI systems..."}
          {generationProgress >= 20 && generationProgress < 50 && "⚡ Crafting beautiful layouts..."}
          {generationProgress >= 50 && generationProgress < 80 && "🎨 Adding stunning visuals..."}
          {generationProgress >= 80 && "✨ Finalizing your masterpiece..."}
        </p>
      </div>
    </div>
  )
}