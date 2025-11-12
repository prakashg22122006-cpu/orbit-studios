import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Plus, Trash2, Calendar, Edit, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  category: string;
  completed: boolean;
  deadline?: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [newTaskCategory, setNewTaskCategory] = useState("Personal");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    toast({
      title: "Task updated",
      description: "Task status has been changed",
    });
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Task has been removed successfully",
    });
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        priority: newTaskPriority,
        category: newTaskCategory,
        completed: false,
        deadline: newTaskDeadline || undefined
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setNewTaskPriority("medium");
      setNewTaskCategory("Personal");
      setNewTaskDeadline("");
      toast({
        title: "Task added",
        description: "New task has been created successfully",
      });
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? editingTask : task
      ));
      setIsEditDialogOpen(false);
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      });
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Task Manager</h1>
              <p className="text-xl text-muted-foreground">
                {activeTasks.length} active • {completedTasks.length} completed
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Task Title</Label>
                <Input 
                  placeholder="Enter task title..." 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Deadline (Optional)</Label>
                <Input 
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addTask} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No active tasks</p>
                  <p className="text-sm">Add your first task above to get started!</p>
                </div>
              ) : (
                activeTasks.map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => openEditDialog(task)}
                    priorityColors={priorityColors}
                  />
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No completed tasks yet</p>
                  <p className="text-sm">Complete tasks to see them here</p>
                </div>
              ) : (
                completedTasks.map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => openEditDialog(task)}
                    priorityColors={priorityColors}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to your task details</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Task Title</Label>
                <Input 
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select 
                  value={editingTask.priority} 
                  onValueChange={(value: any) => setEditingTask({...editingTask, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select 
                  value={editingTask.category} 
                  onValueChange={(value) => setEditingTask({...editingTask, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Deadline (Optional)</Label>
                <Input 
                  type="date"
                  value={editingTask.deadline || ""}
                  onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TaskCard = ({ 
  task, 
  onToggle, 
  onDelete,
  onEdit,
  priorityColors 
}: { 
  task: Task; 
  onToggle: () => void; 
  onDelete: () => void;
  onEdit: () => void;
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

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 text-primary" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default Tasks;
