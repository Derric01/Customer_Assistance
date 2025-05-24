import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#0078d4',
  text = 'Loading...'
}) => {
  // Determine size in pixels
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 36
  };
  
  const pixelSize = sizeMap[size];
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className="animate-spin rounded-full border-t-transparent"
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          borderWidth: `${Math.max(2, pixelSize / 8)}px`,
          borderStyle: 'solid',
          borderColor: `${color}`,
          borderTopColor: 'transparent'
        }}
        role="status"
        aria-label={text}
      />
      {text && (
        <span className="mt-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;