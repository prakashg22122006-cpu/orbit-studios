import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { storage, STORES } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { KanbanView } from '@/components/TaskViews/KanbanView';
import { CalendarView } from '@/components/TaskViews/CalendarView';
import { TimelineView } from '@/components/TaskViews/TimelineView';
import { Plus, List, Columns, Calendar as CalendarIcon, Clock, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportToCSV, generateTaskReport, exportToText } from '@/lib/export';

export default function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: '',
    status: 'todo' as Task['status'],
    deadline: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterPriority, filterStatus]);

  const loadTasks = async () => {
    const data = await storage.getAll<Task>(STORES.tasks);
    setTasks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Task title is required', variant: 'destructive' });
      return;
    }

    const taskData: Task = {
      id: editingTask?.id || crypto.randomUUID(),
      ...formData,
      subtasks: editingTask?.subtasks || [],
      dependencies: editingTask?.dependencies || [],
      tags: editingTask?.tags || [],
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTask) {
      await storage.update(STORES.tasks, taskData);
      toast({ title: 'Task updated!' });
    } else {
      await storage.add(STORES.tasks, taskData);
      toast({ title: 'Task created!' });
    }

    resetForm();
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    await storage.delete(STORES.tasks, id);
    toast({ title: 'Task deleted!' });
    loadTasks();
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = {
      ...task,
      status,
      updatedAt: new Date().toISOString(),
      completedAt: status === 'done' ? new Date().toISOString() : undefined,
    };

    await storage.update(STORES.tasks, updated);
    toast({ title: `Task ${status === 'done' ? 'completed' : 'updated'}!` });
    loadTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      status: task.status,
      deadline: task.deadline || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      status: 'todo',
      deadline: '',
    });
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const handleExport = () => {
    const report = generateTaskReport(tasks);
    exportToText(report, 'task-report');
    exportToCSV(tasks.map(t => ({
      Title: t.title,
      Priority: t.priority,
      Status: t.status,
      Category: t.category,
      Deadline: t.deadline || 'None',
      Created: new Date(t.createdAt).toLocaleDateString(),
    })), 'tasks');
    toast({ title: 'Tasks exported!' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task & Project Manager</h1>
            <p className="text-muted-foreground">Organize and track your tasks</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </Button>
          </div>
        </div>

        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterPriority('all'); setFilterStatus('all'); }}>
              Clear Filters
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">
              <List className="w-4 h-4 mr-2" /> List
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <Columns className="w-4 h-4 mr-2" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="w-4 h-4 mr-2" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="w-4 h-4 mr-2" /> Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-2">
            {filteredTasks.map(task => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-muted">{task.category}</span>
                      <span className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">{task.priority}</span>
                      <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">{task.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(task)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(task.id)}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="kanban">
            <KanbanView 
              tasks={filteredTasks} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView tasks={filteredTasks} onTaskClick={handleEdit} />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineView tasks={filteredTasks} onTaskClick={handleEdit} />
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Task title..."
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v: any) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Work, School, Personal"
                  />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingTask ? 'Update' : 'Create'} Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
