'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, Bot, User, Loader } from 'lucide-react'

// ✅ Add persistent storage key
const CHAT_STORAGE_KEY = 'ai-chat-messages'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  componentTarget?: string
  changeType?: string
}

interface AIChatProps {
  currentFiles: any
  completedComponents: string[]
  onCodeUpdate: (componentName: string, updatedCode: any) => void
  userInput: any
  isGenerationComplete?: boolean // ✅ Add this line (make it optional)
}


export default function AIChat({ 
  currentFiles, 
  completedComponents, 
  onCodeUpdate,
  userInput 
}: AIChatProps) {
  // ✅ Initialize messages from localStorage or default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CHAT_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
    
    return [{
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your AI assistant. I can help you update your ${userInput?.websiteType || 'website'} by modifying components like header, hero, about us, services, and more. Just tell me what you'd like to change!

Examples:
• "Change the hero title to 'Welcome to Our Restaurant'"
• "Make the about us section background blue"  
• "Update the contact form to include a phone field"
• "Change the header navigation color to red"`,
      timestamp: new Date()
    }]
  })
  
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // ✅ Save messages to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
      } catch (error) {
        console.error('Failed to save chat history:', error)
      }
    }
  }, [messages])

  // ✅ Enhanced scrolling
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior, 
        block: 'end',
        inline: 'nearest'
      })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom('auto') // Immediate scroll on first load
  }, [])

  useEffect(() => {
    scrollToBottom() // Smooth scroll for new messages
  }, [messages])

  // ✅ Clear chat history function
  const clearChatHistory = () => {
    const initialMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `Hi! I'm your AI assistant. I can help you update your ${userInput?.websiteType || 'website'} by modifying components. What would you like to change?`,
      timestamp: new Date()
    }
    setMessages([initialMessage])
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await processUserMessage(userMessage.content)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        componentTarget: response.componentTarget,
        changeType: response.changeType
      }

      setMessages(prev => [...prev, assistantMessage])

      if (response.updatedCode && response.componentTarget) {
        onCodeUpdate(response.componentTarget, response.updatedCode)
      }

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const processUserMessage = async (message: string) => {
    const response = await fetch('/api/process-chat-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        completedComponents,
        currentFiles,
        userInput
      })
    })

    return await response.json()
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            AI Website Assistant
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChatHistory}
            className="text-xs"
          >
            Clear Chat
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* ✅ Enhanced Messages Area with proper scrolling */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          style={{ maxHeight: '60vh' }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User className="h-4 w-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    {message.componentTarget && (
                      <div className="mt-2 text-xs opacity-75 font-medium">
                        Updated: {message.componentTarget} ({message.changeType})
                      </div>
                    )}
                    <div className="mt-1 text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing your request...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* ✅ Enhanced Input Area */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Tell me what you'd like to change..."
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Available components: {completedComponents.join(', ')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}