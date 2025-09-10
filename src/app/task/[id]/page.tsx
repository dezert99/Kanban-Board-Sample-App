import { TaskDetail } from '@/components/task/TaskDetail';

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <TaskDetail taskId={params.id} />
      </div>
    </main>
  );
}