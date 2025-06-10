import React from 'react';

// Input de texto
export const TextInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text',
  required = false,
  error = '',
  icon = null,
  disabled = false
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`input ${icon ? 'pl-10' : ''} ${error ? 'border-danger ring-1 ring-danger' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

// Textarea
export const TextArea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  rows = 3,
  required = false,
  error = ''
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`input ${error ? 'border-danger ring-1 ring-danger' : ''}`}
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

// Select
export const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [],
  required = false,
  error = ''
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`select ${error ? 'border-danger ring-1 ring-danger' : ''}`}
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

// Checkbox
export const Checkbox = ({ 
  label, 
  name, 
  checked, 
  onChange,
  error = ''
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor={name} className="ml-2 block text-gray-700">
          {label}
        </label>
      </div>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

// Input de archivo
export const FileInput = ({ 
  label, 
  name, 
  onChange, 
  accept = 'image/*',
  required = false,
  error = '',
  preview = null
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {preview && (
        <div className="mb-2">
          <img src={preview} alt="Preview" className="h-24 w-auto object-cover rounded-md" />
        </div>
      )}
      
      <input
        type="file"
        id={name}
        name={name}
        onChange={onChange}
        accept={accept}
        required={required}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-white
          hover:file:bg-blue-600
          cursor-pointer"
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

// Botón
export const Button = ({ 
  type = 'button', 
  onClick, 
  className = '', 
  disabled = false,
  children 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}; 