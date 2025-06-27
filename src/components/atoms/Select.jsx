import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Sélectionner...",
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            block w-full px-3 py-3 pr-10 border rounded-lg shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            transition-colors duration-200 appearance-none bg-white
            ${error 
              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <ApperIcon name="AlertCircle" className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Select