'use client';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterButtonsProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export default function FilterButtons({ options, activeFilter, onFilterChange, className = '' }: FilterButtonsProps) {
  return (
    <div className={`filter-buttons-container ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`filter-btn ${activeFilter === option.value ? 'active' : ''}`}
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
