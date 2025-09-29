'use client';

import { useState } from 'react';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchBar({ placeholder, value, onChange, className = '' }: SearchBarProps) {
  return (
    <div className={`search-bar-container ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      <i className="fas fa-search search-icon"></i>
    </div>
  );
}
