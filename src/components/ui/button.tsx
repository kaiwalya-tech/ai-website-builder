import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// Advanced button with animations and theming support
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl'
  loading?: boolean
  children: React.ReactNode
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, asChild = false, children, disabled, ...props }, ref) => {
    
    // If asChild is true, we'll render as a different component (like Link)
    const Comp = asChild ? 'span' : 'button'
    
    return (
      <Comp
        className={cn(
          // Base styles with smooth transitions and modern design
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]",
          
          // Variant styles with modern gradients and shadows
          {
            // Primary button with gradient and glow effect
            "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-purple-700": variant === 'default',
            
            // Gradient button with rainbow effect
            "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600": variant === 'gradient',
            
            // Destructive with red gradient
            "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700": variant === 'destructive',
            
            // Outline with hover fill animation
            "border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md": variant === 'outline',
            
            // Secondary with subtle gradient
            "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm hover:from-gray-200 hover:to-gray-300 hover:shadow-md": variant === 'secondary',
            
            // Ghost with hover background animation
            "text-gray-700 hover:bg-gray-100 hover:text-gray-900": variant === 'ghost',
            
            // Link style
            "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700": variant === 'link',
          },
          
          // Size variants with proper spacing
          {
            "h-10 px-6 py-2 text-sm": size === 'default',
            "h-8 rounded-lg px-4 text-xs": size === 'sm',
            "h-12 rounded-xl px-8 text-base font-bold": size === 'lg',
            "h-16 rounded-2xl px-12 text-lg font-bold": size === 'xl',
            "h-10 w-10 rounded-xl": size === 'icon',
          },
          
          // Loading state
          loading && "cursor-not-allowed opacity-70",
          
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </Comp>
    )
  }
)

Button.displayName = "Button"