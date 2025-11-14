import { Task } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

interface TimelineViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const sortedTasks = [...tasks]
    .filter(t => t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const groupedByDate = sortedTasks.reduce((acc, task) => {
    const date = task.deadline!.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const isOverdue = (deadline: string, status: Task['status']) => {
    return new Date(deadline) < new Date() && status !== 'done';
  };

  return (
    <div className="space-y-6 relative pl-8">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      {Object.entries(groupedByDate).map(([date, dateTasks]) => {
        const dateObj = new Date(date);
        const isToday = date === new Date().toISOString().split('T')[0];
        const isPast = dateObj < new Date() && !isToday;

        return (
          <div key={date} className="relative">
            <div className="absolute -left-7 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>

            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isToday ? 'text-primary' : isPast ? 'text-muted-foreground' : ''}`}>
                  {isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <Badge variant={isToday ? 'default' : 'secondary'}>
                  {dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="space-y-2">
                {dateTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-smooth cursor-pointer group"
                  >
                    <div className="mt-0.5">
                      {task.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Circle className={`w-5 h-5 ${isOverdue(task.deadline!, task.status) ? 'text-destructive' : 'text-muted-foreground'}`} />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h4>
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.status}
                        </Badge>
                        {isOverdue(task.deadline!, task.status) && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      })}

      {sortedTasks.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No tasks with deadlines yet. Add a deadline to see them in the timeline!
        </Card>
      )}
    </div>
  );
}
