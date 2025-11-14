import { Task } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash2 } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function KanbanView({ tasks, onEdit, onDelete, onStatusChange }: KanbanViewProps) {
  const columns: Task['status'][] = ['todo', 'in-progress', 'done'];
  
  const columnTitles = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };

  const priorityColors = {
    low: 'bg-muted',
    medium: 'bg-accent',
    high: 'bg-destructive',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(status => (
        <div key={status} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{columnTitles[status]}</h3>
            <Badge variant="secondary">
              {tasks.filter(t => t.status === status).length}
            </Badge>
          </div>
          
          <div className="space-y-3 min-h-[200px]">
            {tasks
              .filter(t => t.status === status)
              .map(task => (
                <Card key={task.id} className="p-4 space-y-2 hover:shadow-md transition-smooth">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`} />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    {task.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length} subtasks
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(task)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    {status !== 'done' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusChange(task.id, status === 'todo' ? 'in-progress' : 'done')}
                      >
                        {status === 'todo' ? 'Start' : 'Complete'}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
