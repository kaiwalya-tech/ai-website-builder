'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle2, Loader2, Sparkles, Zap, Code, Palette, Brain, Clock, FileText } from 'lucide-react'

interface AnimatedPreviewProps {
  isActive: boolean
  onGenerationComplete?: () => void
}

interface GenerationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'analyzing' | 'generating' | 'completed'
  progress: number
  estimatedTime: number
  isComponent: boolean
}

export default function AnimatedPreview({ isActive, onGenerationComplete }: AnimatedPreviewProps) {
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 'analysis', title: 'AI Analysis', description: 'Analyzing requirements and business needs', status: 'pending', progress: 0, estimatedTime: 8, isComponent: false },
    { id: 'planning', title: 'Design Planning', description: 'Understanding target audience and brand identity', status: 'pending', progress: 0, estimatedTime: 6, isComponent: false },
    { id: 'header', title: 'Header Section', description: 'Navigation, branding, and menu structure', status: 'pending', progress: 0, estimatedTime: 50, isComponent: true },
    { id: 'hero', title: 'Hero Section', description: 'Main banner, headlines, and call-to-action', status: 'pending', progress: 0, estimatedTime: 50, isComponent: true },
    { id: 'content', title: 'Other Content', description: 'About section, services, and key information', status: 'pending', progress: 0, estimatedTime: 60, isComponent: true },
    { id: 'footer', title: 'Footer Section', description: 'Footer links, info, and legal content', status: 'pending', progress: 0, estimatedTime: 35, isComponent: true },
    { id: 'integration', title: 'Final Integration', description: 'Integrating files, optimizing styles, and folder structure', status: 'pending', progress: 0, estimatedTime: 30, isComponent: false }
  ])

  const [overallProgress, setOverallProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [currentMessage, setCurrentMessage] = useState<string>('Initializing AI systems...')

  // ✅ Enhanced generation sequence with 20% longer timing
  useEffect(() => {
    if (!isActive) return

    let stepIndex = 0
    let timeoutId: NodeJS.Timeout

    const processNextStep = () => {
      if (stepIndex >= steps.length) {
        setCurrentMessage('✅ Website generation completed!')
        setCurrentStep(null)
        onGenerationComplete?.()
        return
      }

      const step = steps[stepIndex]
      setCurrentStep(step.id)

      // Different messages for different step types
      if (!step.isComponent) {
        setCurrentMessage(`🧠 ${step.title}: ${step.description}`)
      } else {
        setCurrentMessage(`⚡ Generating ${step.title}...`)
      }

      // Start step
      setSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: step.isComponent ? 'generating' as const : 'analyzing' as const }
          : s
      ))

      // ✅ Realistic progress simulation with 20% longer timing
      let progress = 0
      const baseDuration = step.estimatedTime * 1000 * 1.1 // 10% longer
      
      // Special handling for final integration step
      const duration = step.id === 'integration' ? baseDuration * 3 : baseDuration // Integration takes longer
      const interval = 150
      const maxProgress = step.id === 'integration' ? 90 : 100 // Integration stops at 90%
      const increment = (maxProgress / (duration / interval))

      const progressInterval = setInterval(() => {
        progress += increment + (Math.random() * 0.3)
        if (progress > maxProgress) progress = maxProgress

        setSteps(prev => prev.map(s => 
          s.id === step.id 
            ? { ...s, progress: Math.round(progress) }
            : s
        ))

        // Complete step when progress reaches target
        if (progress >= maxProgress && step.id !== 'integration') {
          clearInterval(progressInterval)
          
          setSteps(prev => prev.map(s => 
            s.id === step.id 
              ? { ...s, status: 'completed' as const, progress: 100 }
              : s
          ))

          setOverallProgress(((stepIndex + 1) / steps.length) * 100)
          
          stepIndex++
          setTimeout(processNextStep, 2000)
        }
      }, interval)

      return () => clearInterval(progressInterval)
    }

    // Start sequence
    timeoutId = setTimeout(processNextStep, 2000)

    return () => clearTimeout(timeoutId)
  }, [isActive, onGenerationComplete])

  // ✅ Function to complete integration step quickly when called externally
  const completeIntegration = () => {
    setSteps(prev => prev.map(s => 
      s.id === 'integration' 
        ? { ...s, status: 'completed' as const, progress: 100 }
        : s
    ))
    setOverallProgress(100)
    setCurrentMessage('🎉 Website ready!')
  }

  const completedSteps = steps.filter(s => s.status === 'completed').length
  const currentGeneratingStep = steps.find(s => s.status === 'generating' || s.status === 'analyzing')

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Code className="w-10 h-10 text-purple-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Website Generation</h2>
              <p className="text-sm text-gray-600">Building your professional website...</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-gray-600">{completedSteps} of {steps.length} steps</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 shadow-inner">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${overallProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="font-bold text-green-700">{completedSteps}</div>
            <div className="text-green-600">Completed</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="font-bold text-blue-700">{currentGeneratingStep ? '1' : '0'}</div>
            <div className="text-blue-600">In Progress</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="font-bold text-gray-700">{steps.length - completedSteps - (currentGeneratingStep ? 1 : 0)}</div>
            <div className="text-gray-600">Remaining</div>
          </div>
        </div>
      </div>

      {/* Generation Steps */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-5 rounded-xl border-2 transition-all duration-500 ${
                step.status === 'completed' 
                  ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg transform scale-[1.02]' :
                (step.status === 'generating' || step.status === 'analyzing')
                  ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl animate-pulse' :
                'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (step.status === 'generating' || step.status === 'analyzing') ? (
                      step.status === 'analyzing' ? (
                        <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
                      ) : (
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      )
                    ) : (
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-lg text-gray-900">{step.title}</h3>
                      {(step.status === 'generating' || step.status === 'analyzing') && (
                        <div className="flex space-x-1">
                          <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                          {step.isComponent && <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />}
                        </div>
                      )}
                      {!step.isComponent && (
                        <FileText className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    {(step.status === 'generating' || step.status === 'analyzing') && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">
                          ~{Math.round(step.estimatedTime * 1.2)} seconds
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {step.status === 'completed' && (
                    <div className="text-green-600 font-bold">✅ Done</div>
                  )}
                  {(step.status === 'generating' || step.status === 'analyzing') && (
                    <div className="text-blue-600 font-bold text-lg">{step.progress}%</div>
                  )}
                  {step.status === 'pending' && (
                    <div className="text-gray-400 text-sm">Waiting...</div>
                  )}
                </div>
              </div>

              {/* Progress Bar for Active Steps */}
              {(step.status === 'generating' || step.status === 'analyzing') && (
                <div className="mt-4">
                  <div className="w-full bg-blue-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 relative"
                      style={{ width: `${step.progress}%` }}
                    >
                      <div className="absolute right-0 top-0 w-3 h-3 bg-white/70 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Generation Message */}
        {currentStep && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-4 z-50 animate-bounce">
            <Palette className="w-6 h-6" />
            <span className="font-semibold text-lg">{currentMessage}</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}