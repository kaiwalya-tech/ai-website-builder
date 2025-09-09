import React from 'react'

interface InputProps {
  id?: string
  type?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void // ✅ Add this
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export const Input: React.FC<InputProps> = ({ 
  id,
  type = "text",
  value,
  onChange,
  onKeyDown, // ✅ Add this
  placeholder,
  className,
  required = false,
  disabled = false
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown} // ✅ Add this
      placeholder={placeholder}
      className={className || "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}
      required={required}
      disabled={disabled}
    />
  )
}
