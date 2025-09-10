import { KanbanBoard } from '@/components/board/KanbanBoard';
import { FilterBar } from '@/components/shared/FilterBar';
import { ClientOnly } from '@/components/shared/ClientOnly';
import Link from 'next/link';
import { List } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sprint Board</h1>
          <Link
            href="/backlog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <List className="w-4 h-4" />
            List View
          </Link>
        </div>
        <ClientOnly fallback={<div>Loading...</div>}>
          <FilterBar />
          <KanbanBoard />
        </ClientOnly>
      </div>
    </main>
  );
}