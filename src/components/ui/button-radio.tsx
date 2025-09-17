'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonRadioProps {
  value: string
  label: string
  checked: boolean
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const ButtonRadio = React.forwardRef<HTMLInputElement, ButtonRadioProps>(
  ({ value, label, checked, onChange, disabled = false, className, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-[#003672] focus:ring-offset-2',
          checked
            ? 'bg-[#003672] text-white border-[#003672] shadow-md hover:bg-[#5c6f8b] hover:text-white'
            : 'bg-white text-[#003672] border-gray-300 hover:bg-gray-50 hover:border-[#003672]',
          disabled && 'opacity-50 cursor-not-allowed hover:bg-white hover:text-[#003672]',
          className,
        )}
      >
        <input
          type="radio"
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="sr-only"
          ref={ref}
          {...props}
        />
        {label}
      </label>
    )
  },
)
ButtonRadio.displayName = 'ButtonRadio'

export interface ButtonRadioGroupProps {
  options: readonly { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  name?: string
  error?: string
}

const ButtonRadioGroup = React.forwardRef<HTMLDivElement, ButtonRadioGroupProps>(
  ({ options, value, onChange, disabled = false, className, name, error, ...props }, ref) => {
    return (
      <div>
        <div ref={ref} className={cn('flex flex-wrap gap-2', className)} role="radiogroup" {...props}>
          {options.map((option) => (
            <ButtonRadio
              key={option.value}
              value={option.value}
              label={option.label}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              name={name}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  },
)
ButtonRadioGroup.displayName = 'ButtonRadioGroup'

export { ButtonRadio, ButtonRadioGroup }
