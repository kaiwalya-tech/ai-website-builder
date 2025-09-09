'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code, Palette, Zap, Globe, Download, Eye, Star, CheckCircle, Play, Sparkles, MessageSquare, FileCode, Smartphone, Edit3 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Website Builder
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-blue-600 hover:scale-105 transition-all duration-200 font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-blue-600 hover:scale-105 transition-all duration-200 font-medium"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('technologies')}
                className="text-gray-600 hover:text-blue-600 hover:scale-105 transition-all duration-200 font-medium"
              >
                Technologies
              </button>
              <Link href="/onboarding">
                <Button className="get-started-btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl border-0">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Website Generation
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Transform Ideas
                </span>
                <br />
                <span className="text-gray-900">Into Stunning Websites</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Create professional, responsive websites in minutes using AI. Just describe your business and watch our intelligent system build a complete website with modern design and functionality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/onboarding">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-xl">
                    Start Building Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="text-gray-900">For Professional Websites</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides all the modern tools and features you need to create professional websites that convert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Powered Generation",
                description: "Automatically generates complete websites with header, hero, about, services, and contact sections based on your business description.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Edit3 className="w-8 h-8" />,
                title: "Live Edit Mode",
                description: "Edit website content in real-time with an intuitive interface. Modify headings, paragraphs, and see changes instantly.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <FileCode className="w-8 h-8" />,
                title: "Built-in Code Editor",
                description: "View and modify generated HTML, CSS, and JavaScript code directly with syntax highlighting and component structure.",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Responsive Design",
                description: "Mobile-first responsive designs with Tailwind CSS ensuring your website looks perfect on all devices.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "AI Chat Assistant",
                description: "Get help and make customizations through our intelligent AI chat that understands your website needs.",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "Download Ready",
                description: "Export complete websites as organized ZIP files or single HTML files ready for deployment to any hosting platform.",
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                {/* Hover Arrow */}
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 absolute top-8 right-8 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes website creation effortless and intelligent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe Your Idea",
                description: "Fill out our simple onboarding form with your business details, select features, and choose your preferred color scheme.",
                icon: <Palette className="w-8 h-8" />
              },
              {
                step: "02",
                title: "AI Generates Website",
                description: "Our AI analyzes your requirements and creates custom components with professional styling and modern UI/UX in 3-5 minutes.",
                icon: <Zap className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Edit & Download",
                description: "Review, customize with live editing, use the code editor, and download your complete website ready for deployment.",
                icon: <Globe className="w-8 h-8" />
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all duration-300">
                  <div className="text-6xl font-bold text-gray-100 mb-4">{step.step}</div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-300 w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Built With Modern Tech
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by the latest technologies for performance, reliability, and developer experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Next.js 15", icon: "⚡" },
              { name: "React 18", icon: "⚛️" },
              { name: "TypeScript", icon: "📘" },
              { name: "Tailwind CSS", icon: "🎨" },
              { name: "AI Integration", icon: "🤖" },
              { name: "Lucide Icons", icon: "✨" },
              { name: "JSZip", icon: "📦" },
              { name: "Hot Reload", icon: "🔥" }
            ].map((tech, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 hover:bg-blue-50 p-6 rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                  <div className="text-4xl mb-3">{tech.icon}</div>
                  <div className="font-semibold text-gray-900">{tech.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Dream Website?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who have already built amazing websites with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-xl">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center mt-8 space-x-6 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No coding required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>3-5 minute generation</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Export ready files</span>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
<footer className="bg-white text-gray-900 py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      
      {/* Brand Section */}
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">AI Website Builder</span>
        </div>
        <p className="text-gray-600 text-center md:text-left text-sm max-w-xs leading-relaxed">
          Transform ideas into stunning websites using AI
        </p>
      </div>

      {/* Quick Links */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Links</h3>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            How it Works
          </button>
          <button 
            onClick={() => scrollToSection('technologies')} 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            Technologies
          </button>
          <Link href="/onboarding" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
            Get Started
          </Link>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex flex-col items-center md:items-end">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Connect</h3>
        <div className="flex space-x-4">
          <a 
            href="https://www.linkedin.com/in/kaiwalya-joshi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-gray-100"
          >
            <span className="sr-only">LinkedIn</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a 
            href="https://github.com/kaiwalya-tech" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-gray-100"
          >
            <span className="sr-only">GitHub</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-gray-200 mt-6 pt-4">
      <div className="text-center">
        <p className="text-gray-500 text-sm">
          © 2025 AI Website Builder. Built with Next.js and AI. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>



    </div>
  )
}
