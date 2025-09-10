'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit3, Trash2 } from 'lucide-react';

interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
}

export function DropdownMenu({ items, className = '' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-sm hover:bg-gray-100"
        title="More actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                  item.variant === 'danger' 
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                    : 'text-gray-700'
                }`}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Specific task dropdown for cards
interface TaskCardDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function TaskCardDropdown({ onEdit, onDelete, className }: TaskCardDropdownProps) {
  const items: DropdownMenuItem[] = [
    {
      label: 'Edit task',
      icon: <Edit3 className="w-4 h-4" />,
      onClick: onEdit,
    },
    {
      label: 'Delete task',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      variant: 'danger',
    },
  ];

  return <DropdownMenu items={items} className={className} />;
}