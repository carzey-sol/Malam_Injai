'use client';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  color?: string;
}

export default function Loader({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  color = 'var(--primary-color)'
}: LoaderProps) {
  const sizeClasses = {
    small: 'loader-small',
    medium: 'loader-medium',
    large: 'loader-large'
  };

  const LoaderContent = () => (
    <div className={`loader-container ${sizeClasses[size]}`}>
      <div className="loader-spinner" style={{ borderTopColor: color }}></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
}

// Inline loader for small spaces
export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="inline-loader">
      <div className="inline-loader-spinner"></div>
      <span>{text}</span>
    </div>
  );
}

// Skeleton loader for content placeholders
export function SkeletonLoader({ 
  lines = 3, 
  width = '100%',
  height = '1rem' 
}: { 
  lines?: number; 
  width?: string | string[];
  height?: string;
}) {
  const widths = Array.isArray(width) ? width : Array(lines).fill(width);
  
  return (
    <div className="skeleton-loader">
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className="skeleton-line"
          style={{ 
            width: widths[index] || '100%',
            height: height
          }}
        />
      ))}
    </div>
  );
}
