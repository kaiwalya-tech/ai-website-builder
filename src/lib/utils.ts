import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge Tailwind classes properly
// This prevents conflicts and ensures proper class precedence
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Template types for our website builder
export interface Template {
  id: string
  name: string
  description: string
  category: 'business' | 'portfolio' | 'blog' | 'ecommerce' | 'landing'
  thumbnail: string
  components: TemplateComponent[]
  theme: 'modern' | 'minimal' | 'corporate' | 'creative'
}

export interface TemplateComponent {
  id: string
  type: 'navbar' | 'hero' | 'features' | 'testimonials' | 'footer' | 'contact' | 'gallery' | 'pricing'
  content: any // Will hold the actual component data
  editable: boolean
}

// User project interface
export interface UserProject {
  id: string
  name: string
  template: Template
  customizations: any
  deploymentUrl?: string
  createdAt: Date
  updatedAt: Date
}

// AI prompt helpers
export const PROMPT_EXAMPLES = {
  business: "Create a professional business website for a consulting firm with services, team, and contact sections",
  portfolio: "Build a creative portfolio website for a graphic designer with project gallery and about section",
  blog: "Design a clean blog website with article listings, author bio, and newsletter signup",
  ecommerce: "Create an e-commerce website for a clothing brand with product showcase and shopping features",
  landing: "Build a landing page for a SaaS product with hero, features, pricing, and testimonials"
}