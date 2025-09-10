'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function FilterBar() {
  const { filters, setFilter, clearFilters, tasks } = useKanbanStore();
  const [isTagComboOpen, setIsTagComboOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get unique assignees and tags
  const assignees = [...new Set(tasks.map(t => t.assignee))];
  const allTags = [...new Set(tasks.flatMap(t => t.tags))];
  const availableTags = allTags.filter(tag => !filters.tags.includes(tag));
  
  // Filter available tags based on input
  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  useEffect(() => {
    if (isTagComboOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTagComboOpen]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [tagInput]);
  
  const handleTagAdd = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      setFilter({ tags: [...filters.tags, tag] });
    }
    setIsTagComboOpen(false);
    setTagInput('');
    setSelectedIndex(-1);
  };

  const handleTagRemove = (tag: string) => {
    setFilter({ tags: filters.tags.filter(t => t !== tag) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredTags[selectedIndex]) {
        handleTagAdd(filteredTags[selectedIndex]);
      }
      // Don't allow creating new tags - only selecting existing ones
    } else if (e.key === 'Escape') {
      setIsTagComboOpen(false);
      setTagInput('');
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredTags.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    }
  };

  const handleOptionClick = (tag: string) => {
    handleTagAdd(tag);
  };

  const handleInputBlur = () => {
    // Delay to allow option clicks
    setTimeout(() => {
      // Only close the combo box, don't add tags on blur
      setIsTagComboOpen(false);
      setTagInput('');
      setSelectedIndex(-1);
    }, 150);
  };
  
  const hasActiveFilters = filters.search || filters.assignee || filters.tags.length > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
            />
          </div>
        </div>
        
        {/* Assignee Filter */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.assignee || ''}
          onChange={(e) => setFilter({ assignee: e.target.value || null })}
        >
          <option value="">All Assignees</option>
          {assignees.map(assignee => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
        
        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear filters
          </button>
        )}
      </div>
      
      {/* Tag Filter Section */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">
            Filter by tags:
          </span>
          {isTagComboOpen ? (
            <div className="relative min-w-[200px]">
              <input
                ref={inputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                placeholder="Search existing tags..."
                className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {filteredTags.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredTags.map((tag, index) => (
                    <div
                      key={tag}
                      onClick={() => handleOptionClick(tag)}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedIndex ? 'bg-blue-100' : ''
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsTagComboOpen(true)}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded border border-dashed border-gray-300 hover:border-gray-400 transition-all"
            >
              + Add tag filter
            </button>
          )}
        </div>
        
        {/* Selected Tags Display */}
        {filters.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}