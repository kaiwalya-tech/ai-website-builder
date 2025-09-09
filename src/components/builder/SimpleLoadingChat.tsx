'use client'

import React from 'react'
import { Bot, MessageSquare } from 'lucide-react'

export default function SimpleLoadingChat() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bot className="w-10 h-10 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Chat Assistant</h3>
            <p className="text-sm text-gray-600">Preparing your chat experience...</p>
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <MessageSquare className="h-16 w-16 mx-auto mb-6 text-gray-400" />
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Chat Assistant Loading
          </h3>
          
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Your AI chat assistant will be available once all website components are generated. 
            Please wait while we build your website.
          </p>

          {/* Bouncing Dots Loading Animation */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div 
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div 
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div 
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm font-medium">
              🤖 AI Assistant is standing by...
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Ready to help with customizations and questions
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Chat will activate automatically</span>
        </div>
      </div>
    </div>
  )
}
