import React from 'react'

interface TextareaProps {
  id?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  rows?: number
  required?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({ 
  id,
  value,
  onChange,
  placeholder,
  className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
  rows = 4,
  required = false
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      rows={rows}
      required={required}
    />
  )
}