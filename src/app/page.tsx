'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code, Palette, Zap, Globe, Download, Eye, Star, CheckCircle, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AI Website Builder
              </span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Features', 'How it Works', 'Testimonials'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
            </div>
            
            <Button variant="gradient" className="shadow-lg hover:shadow-xl">
              <Link href="/onboarding" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-32 sm:pb-24 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 mb-8 animate-bounce-in">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">New: AI-Powered Website Generation</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Build Professional Websites
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-glow">
                with AI Magic
              </span>
            </h1>
            
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              Transform your ideas into stunning, fully-functional websites in minutes. 
              No coding required - just describe what you want and watch our AI build it with modern animations and perfect responsive design.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="xl" variant="gradient" className="group shadow-2xl hover:shadow-blue-500/25">
                <Link href="/onboarding" className="flex items-center">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button size="xl" variant="outline" className="group border-2 hover:bg-gray-50">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Free Forever Plan
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                1-Click Deploy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-r from-gray-50 to-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Everything you need for amazing websites
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our AI-powered platform provides all the modern tools and features you need to create professional websites that convert
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              From idea to website in 3 simple steps
            </h2>
            <p className="text-xl text-gray-600">
              Our streamlined process makes website creation effortless
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 -translate-y-1/2"></div>
            
            {steps.map((step, index) => (
              <StepCard key={step.title} {...step} step={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              What our users are saying
            </h2>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 font-medium">4.9/5 from 2,000+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} {...testimonial} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-white/10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to build your dream website?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of creators who have already built amazing websites with our AI-powered platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="xl" variant="outline" className="bg-white text-blue-600 border-white hover:bg-blue-50 shadow-xl">
              <Link href="/onboarding" className="flex items-center">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <div className="flex items-center text-white/80">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">
                  AI Website Builder
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Build professional websites with AI. No coding required, unlimited possibilities.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Deployment</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AI Website Builder. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Enhanced feature data with modern descriptions
const features = [
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "AI-Powered Generation",
    description: "Advanced AI understands your vision and creates pixel-perfect websites with modern animations and responsive design in seconds.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Palette className="h-8 w-8 text-purple-600" />,
    title: "Visual Editor Pro",
    description: "Intuitive drag-and-drop editor with real-time preview. Customize colors, fonts, and layouts with professional design systems.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Globe className="h-8 w-8 text-green-600" />,
    title: "One-Click Deploy",
    description: "Deploy instantly to Vercel with custom domains, SSL certificates, and global CDN. Your website live in under 30 seconds.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <Download className="h-8 w-8 text-orange-600" />,
    title: "Export & Download",
    description: "Download complete Next.js projects with clean, production-ready code. Full ownership and unlimited customization.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: <Code className="h-8 w-8 text-indigo-600" />,
    title: "Pro Templates",
    description: "50+ conversion-optimized templates designed by experts. Each template is mobile-first and SEO-ready.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Eye className="h-8 w-8 text-pink-600" />,
    title: "Live Preview",
    description: "See changes instantly across all devices. Real-time collaboration with team members and client feedback tools.",
    gradient: "from-pink-500 to-rose-500"
  }
]

const steps = [
  {
    title: "Describe Your Vision",
    description: "Tell our AI what kind of website you want. Be specific about your industry, style preferences, and key features needed.",
    icon: <Sparkles className="h-8 w-8" />
  },
  {
    title: "AI Builds Your Site",
    description: "Watch as our AI analyzes your requirements and generates a complete, professional website with modern design and animations.",
    icon: <Zap className="h-8 w-8" />
  },
  {
    title: "Customize & Deploy",
    description: "Fine-tune with our visual editor, then deploy with one click or download the complete codebase for unlimited control.",
    icon: <Globe className="h-8 w-8" />
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    company: "Artisan Bakery",
    content: "I built a professional website for my bakery in under 30 minutes. The AI understood exactly what I needed - from the warm color scheme to the online ordering system. Sales increased 40% in the first month!",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff&size=48&rounded=true",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Freelance Designer",
    company: "Chen Creative Studio",
    content: "This tool is incredible for rapid prototyping. I can create client websites 10x faster and focus on the creative aspects. The code quality is production-ready, and clients love the modern animations.",
    avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=8b5cf6&color=fff&size=48&rounded=true",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Startup Founder",
    company: "TechFlow Solutions",
    content: "We launched our MVP website in one day thanks to this platform. The AI generated a perfect SaaS landing page with pricing tiers, feature comparisons, and lead capture forms. Absolutely game-changing!",
    avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff&size=48&rounded=true",
    rating: 5
  }
]

// Enhanced Feature Card Component
function FeatureCard({ icon, title, description, gradient, delay = 0 }: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  delay?: number
}) {
  return (
    <div 
      className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 animate-fade-in overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Icon Container */}
      <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">{title}</h3>
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{description}</p>
      
      {/* Hover Arrow */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <ArrowRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}

// Enhanced Step Card Component
function StepCard({ title, description, step, icon }: {
  title: string
  description: string
  step: number
  icon: React.ReactNode
}) {
  return (
    <div className="relative text-center group">
      {/* Step Number */}
      <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold rounded-full mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
        {step}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse -z-10"></div>
      </div>
      
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg mx-auto mb-6 text-blue-600 group-hover:shadow-xl transition-shadow duration-300">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{description}</p>
    </div>
  )
}

// Instead of complex Image handling, use simple approach:
const TestimonialCard = ({ name, role, content, rating }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 mb-3">{content}</p>
    <div className="flex text-yellow-400">
      {'★'.repeat(rating)}
    </div>
  </div>
)
