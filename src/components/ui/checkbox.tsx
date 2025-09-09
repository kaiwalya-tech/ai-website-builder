import React from 'react'

interface CheckboxProps {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  id, 
  checked, 
  onCheckedChange, 
  disabled = false,
  className = "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    onCheckedChange(event.target.checked)
  }

  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      className={className}
    />
  )
}