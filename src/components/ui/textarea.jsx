import { forwardRef } from 'react';

const Textarea = forwardRef(
  (
    {
      label,
      value,
      onChange,
      placeholder,
      disabled = false,
      rows = 3,
      maxLength = 200,
      showCharCount = true,
      className = '',
      error,
      ...props
    },
    ref
  ) => {
    const currentLength = value?.length || 0;
    const isNearLimit = maxLength && currentLength >= maxLength * 0.9;
    const isAtLimit = maxLength && currentLength >= maxLength;

    return (
      <div className="w-full">
        {label && (
          <label
            className={`block text-sm font-medium mb-1 ${
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
            }`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full p-3 border rounded-lg outline-none transition-all resize-none
            ${
              disabled
                ? 'bg-gray-100 cursor-not-allowed text-gray-500 border-gray-300'
                : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          {error && <p className="text-xs text-red-500">{error}</p>}
          {showCharCount && maxLength && (
            <p
              className={`text-xs ml-auto ${
                isAtLimit
                  ? 'text-red-500 font-semibold'
                  : isNearLimit
                  ? 'text-amber-500'
                  : 'text-gray-500'
              }`}
            >
              {currentLength} / {maxLength} caracteres
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
