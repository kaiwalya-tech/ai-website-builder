'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, ArrowLeft, Palette, Sun, Moon } from 'lucide-react'

interface UserInput {
  businessDescription: string
  websiteType: string
  userEmail: string
  selectedFeatures: string[]
  colorScheme: 'light' | 'dark'
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [userInput, setUserInput] = useState<UserInput>({
    businessDescription: '',
    websiteType: '',
    userEmail: '',
    selectedFeatures: [],
    colorScheme: 'light'
  })

  // ✅ Progress calculation based on completed fields
  const getProgress = () => {
    if (currentStep === 1) {
      let completed = 0
      if (userInput.businessDescription.trim()) completed += 20
      if (userInput.websiteType) completed += 15
      if (userInput.userEmail.trim()) completed += 15
      return completed
    }
    return 50 // Step 1 complete
  }

  const websiteTypes = [
    'Restaurant', 'E-commerce', 'Portfolio', 'Blog', 'Business', 'Non-profit', 'Other'
  ]

  const availableFeatures = [
    { id: 'about', label: 'About Us', description: 'Company story and values' },
    { id: 'services', label: 'Services', description: 'What you offer' },
    { id: 'contact', label: 'Contact Form', description: 'Let customers reach you' },
    { id: 'gallery', label: 'Photo Gallery', description: 'Showcase your work' },
    { id: 'testimonials', label: 'Testimonials', description: 'Customer reviews' },
    { id: 'location', label: 'Location/Map', description: 'Where to find you' },
    { id: 'social', label: 'Social Media', description: 'Connect on social platforms' }
  ]

  const handleNext = () => {
    if (currentStep === 1) {
      // ✅ Validate only required fields for step 1
      if (!userInput.businessDescription.trim() || !userInput.websiteType || !userInput.userEmail.trim()) {
        alert('Please fill in all required fields')
        return
      }
      setCurrentStep(2)
    } else {
      // ✅ Step 2 complete, save and redirect
      localStorage.setItem('userInput', JSON.stringify(userInput))
      router.push('/builder')
    }
  }

  const handleFeatureToggle = (featureId: string) => {
    setUserInput(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(f => f !== featureId)
        : [...prev.selectedFeatures, featureId]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* ✅ Dynamic Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of 2</span>
            <span className="text-sm text-gray-600">{getProgress()}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Tell us about your business
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Help us understand what you're building
              </p>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* ✅ Enhanced Email Input */}
              <div>
                <Label htmlFor="email" className="text-base font-medium text-gray-700">
                  Your Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={userInput.userEmail}
                  onChange={(e) => setUserInput(prev => ({ ...prev, userEmail: e.target.value }))}
                  className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                  required
                />
              </div>

              {/* ✅ Website Type Second */}
              <div>
                <Label className="text-base font-medium">
                  Website Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {websiteTypes.map(type => (
                    <Button
                      key={type}
                      variant={userInput.websiteType === type ? 'default' : 'outline'}
                      onClick={() => setUserInput(prev => ({ ...prev, websiteType: type }))}
                      className="text-sm"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* ✅ Business Description Last - Better Styling */}
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Describe your business <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                  Tell us about your business, what you offer, and what kind of website you need
                </p>
                <Textarea
                  id="description"
                  placeholder="e.g., I run an authentic Italian restaurant in downtown that serves traditional family recipes. I want a website that showcases our menu and allows online reservations..."
                  value={userInput.businessDescription}
                  onChange={(e) => setUserInput(prev => ({ ...prev, businessDescription: e.target.value }))}
                  className="mt-2 min-h-32 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  rows={6}
                  required
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Minimum 20 characters recommended</span>
                  <span>{userInput.businessDescription.length} characters</span>
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full py-3 text-lg font-medium"
                size="lg"
              >
                Continue to Customization
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}


        {currentStep === 2 && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Customize your website
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Choose features and theme (optional)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* ✅ Fully Clickable Feature Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFeatures.map(feature => (
                  <label
                    key={feature.id}
                    htmlFor={feature.id}
                    className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <Checkbox
                      id={feature.id}
                      checked={userInput.selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 block">
                        {feature.label}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                    </div>
                  </label>
                ))}
              </div>


              {/* ✅ Theme Selection */}
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    variant={userInput.colorScheme === 'light' ? 'default' : 'outline'}
                    onClick={() => setUserInput(prev => ({ ...prev, colorScheme: 'light' }))}
                    className="flex-1 py-4"
                  >
                    <Sun className="mr-2 h-5 w-5" />
                    Light Theme
                  </Button>
                  <Button
                    variant={userInput.colorScheme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setUserInput(prev => ({ ...prev, colorScheme: 'dark' }))}
                    className="flex-1 py-4"
                  >
                    <Moon className="mr-2 h-5 w-5" />
                    Dark Theme
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1 py-3"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 py-3 text-lg font-medium"
                  size="lg"
                >
                  Create My Website
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}