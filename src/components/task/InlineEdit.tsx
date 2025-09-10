'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
// import { TaskStatus, Priority } from '@/types';

interface InlineTextEditProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

export function InlineTextEdit({ value, onChange, placeholder, multiline = false, className = '' }: InlineTextEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    onChange(editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.metaKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    const Component = multiline ? 'textarea' : 'input';
    return (
      <div className="relative">
        <Component
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={inputRef as any}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className={`w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
          rows={multiline ? 3 : undefined}
        />
        {multiline && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Check className="w-3 h-3" />
              Save
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCancel}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
            <span className="text-xs text-gray-500">⌘+Enter to save</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-50 px-2 py-1 rounded border border-transparent hover:border-gray-200 transition-all ${className}`}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  );
}

interface InlineSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  renderValue?: (value: string) => React.ReactNode;
}

export function InlineSelect({ value, onChange, options, className = '', renderValue }: InlineSelectProps) {
  const [isEditing, setIsEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <select
        ref={selectRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className={`px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-50 px-2 py-1 rounded border border-transparent hover:border-gray-200 transition-all inline-flex items-center gap-2 ${className}`}
    >
      {renderValue ? renderValue(value) : options.find(opt => opt.value === value)?.label}
      <ChevronDown className="w-3 h-3 text-gray-400" />
    </div>
  );
}

interface InlineComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  renderValue?: (value: string) => React.ReactNode;
}

export function InlineComboBox({ value, onChange, options, placeholder, className = '', renderValue }: InlineComboBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
    setSelectedIndex(-1);
  }, [inputValue, options]);

  const handleSave = (newValue: string = inputValue) => {
    onChange(newValue.trim());
    setIsEditing(false);
    setSelectedIndex(-1);
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
        handleSave(filteredOptions[selectedIndex]);
      } else {
        handleSave();
      }
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    }
  };

  const handleOptionClick = (option: string) => {
    handleSave(option);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => handleSave(), 150)} // Delay to allow option clicks
          placeholder={placeholder}
          className={`w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
        />
        {filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  index === selectedIndex ? 'bg-blue-100' : ''
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-50 px-2 py-1 rounded border border-transparent hover:border-gray-200 transition-all ${className}`}
    >
      {renderValue ? renderValue(value) : (value || <span className="text-gray-400">{placeholder}</span>)}
    </div>
  );
}

interface InlineTagEditProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  allTags: string[];
  className?: string;
}

export function InlineTagEdit({ tags, onChange, allTags, className = '' }: InlineTagEditProps) {
  const [isEditing, setIsEditing] = useState(false);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const availableTags = allTags.filter(tag => !tags.includes(tag));

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      {isEditing ? (
        <InlineComboBox
          value=""
          onChange={(value) => {
            if (value) {
              addTag(value);
            }
            setIsEditing(false);
          }}
          options={availableTags}
          placeholder="Type to add tag..."
          className="min-w-[150px]"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 rounded border border-dashed border-gray-300 hover:border-gray-400 transition-all"
        >
          + Add tag
        </button>
      )}
    </div>
  );
}

interface InlineDateEditProps {
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function InlineDateEdit({ value, onChange, placeholder = "Set date", className = '' }: InlineDateEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    value ? value.toISOString().split('T')[0] : ''
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue) {
      onChange(new Date(editValue));
    } else {
      onChange(undefined);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value ? value.toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="date"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
        />
        {value && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setEditValue('');
              onChange(undefined);
              setIsEditing(false);
            }}
            className="text-gray-400 hover:text-gray-600"
            title="Clear date"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-50 px-2 py-1 rounded border border-transparent hover:border-gray-200 transition-all ${className}`}
    >
      {value ? (
        <span className="text-gray-900">
          {value.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      ) : (
        <span className="text-gray-400">{placeholder}</span>
      )}
    </div>
  );
}