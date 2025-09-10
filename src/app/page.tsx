'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { FilterBar } from '@/components/shared/FilterBar';
import { ClientOnly } from '@/components/shared/ClientOnly';
import { TaskModal } from '@/components/task/TaskModal';
import Link from 'next/link';
import { List, Plus } from 'lucide-react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sprint Board</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
            <Link
              href="/backlog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <List className="w-4 h-4" />
              List View
            </Link>
          </div>
        </div>
        <ClientOnly fallback={<div>Loading...</div>}>
          <FilterBar />
          <KanbanBoard />
        </ClientOnly>
        
        <TaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </main>
  );
}