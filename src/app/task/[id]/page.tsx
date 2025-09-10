import { TaskDetail } from '@/components/task/TaskDetail';

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <TaskDetail taskId={id} />
      </div>
    </main>
  );
}