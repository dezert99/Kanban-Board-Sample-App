import { BacklogView } from '@/components/backlog/BacklogView';
import { FilterBar } from '@/components/shared/FilterBar';
import { ClientOnly } from '@/components/shared/ClientOnly';
import { BacklogTableSkeleton } from '@/components/shared/LoadingSkeleton';
import Link from 'next/link';
import { Columns } from 'lucide-react';

export default function BacklogPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Backlog</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Columns className="w-4 h-4" />
            Board View
          </Link>
        </div>
        <FilterBar />
        <ClientOnly fallback={<BacklogTableSkeleton />}>
          <BacklogView />
        </ClientOnly>
      </div>
    </main>
  );
}