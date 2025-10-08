'use client';

import { KeyboardEvent } from 'react';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onSubmit?: (value: string) => void;
}

export default function SearchBar({ placeholder, value, onChange, className = '', onSubmit }: SearchBarProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className={`search-bar-container ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      <i className="fas fa-search search-icon"></i>
      {onSubmit && (
        <button
          type="button"
          className="search-btn"
          aria-label="Search"
          onClick={() => onSubmit(value)}
        >
          <i className="fas fa-search"></i>
        </button>
      )}
    </div>
  );
}
