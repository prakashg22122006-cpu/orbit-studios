import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Plus, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  category: string;
  completed: boolean;
  deadline?: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete Math Assignment", priority: "high", category: "Study", completed: false, deadline: "2025-11-14" },
    { id: 2, title: "Study for Chemistry Exam", priority: "high", category: "Study", completed: false, deadline: "2025-11-15" },
    { id: 3, title: "Read Chapter 5 - History", priority: "medium", category: "Study", completed: false },
    { id: 4, title: "Group Project Meeting", priority: "low", category: "Work", completed: false },
    { id: 5, title: "Morning Workout", priority: "medium", category: "Health", completed: true },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        priority: "medium",
        category: "Personal",
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  const priorityColors = {
    high: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    medium: "bg-accent/10 text-accent hover:bg-accent/20",
    low: "bg-muted text-muted-foreground hover:bg-muted/80"
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Task Manager</h1>
              <p className="text-xl text-muted-foreground">
                {activeTasks.length} active tasks • {completedTasks.length} completed
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Add Task */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input 
                placeholder="Add a new task..." 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Active Tasks */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active tasks. Great job! 🎉</p>
              ) : (
                activeTasks.map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    priorityColors={priorityColors}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed tasks yet</p>
              ) : (
                completedTasks.map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    priorityColors={priorityColors}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ 
  task, 
  onToggle, 
  onDelete, 
  priorityColors 
}: { 
  task: Task; 
  onToggle: () => void; 
  onDelete: () => void;
  priorityColors: Record<string, string>;
}) => {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth group">
      <button 
        onClick={onToggle}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          task.completed ? 'bg-primary border-primary' : 'border-muted-foreground hover:border-primary'
        }`}
      >
        {task.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">{task.category}</Badge>
          {task.deadline && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {task.deadline}
            </span>
          )}
        </div>
      </div>

      <Badge className={priorityColors[task.priority]}>
        {task.priority}
      </Badge>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-smooth"
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
};

export default Tasks;
