import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { storage, STORES } from '@/lib/storage';

export function QuickAddWidget() {
  const [taskTitle, setTaskTitle] = useState('');
  const [habitName, setHabitName] = useState('');
  const [noteTitle, setNoteTitle] = useState('');

  const addTask = async () => {
    if (!taskTitle.trim()) return;

    const task = {
      id: crypto.randomUUID(),
      title: taskTitle,
      priority: 'medium' as const,
      category: 'General',
      status: 'todo' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.add(STORES.tasks, task);
    setTaskTitle('');
    toast({ title: 'Task added!' });
  };

  const addHabit = async () => {
    if (!habitName.trim()) return;

    const habit = {
      id: crypto.randomUUID(),
      name: habitName,
      category: 'Health',
      frequency: 'daily' as const,
      target: 1,
      current: 0,
      streak: 0,
      xp: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    await storage.add(STORES.habits, habit);
    setHabitName('');
    toast({ title: 'Habit added!' });
  };

  const addNote = async () => {
    if (!noteTitle.trim()) return;

    const note = {
      id: crypto.randomUUID(),
      title: noteTitle,
      content: '',
      tags: [],
      category: 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.add(STORES.notes, note);
    setNoteTitle('');
    toast({ title: 'Note added!' });
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Quick Add</h3>
      
      <Tabs defaultValue="task">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="task">Task</TabsTrigger>
          <TabsTrigger value="habit">Habit</TabsTrigger>
          <TabsTrigger value="note">Note</TabsTrigger>
        </TabsList>

        <TabsContent value="task" className="space-y-2">
          <Input
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Button>
        </TabsContent>

        <TabsContent value="habit" className="space-y-2">
          <Input
            placeholder="Habit name..."
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <Button onClick={addHabit} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Habit
          </Button>
        </TabsContent>

        <TabsContent value="note" className="space-y-2">
          <Input
            placeholder="Note title..."
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
          />
          <Button onClick={addNote} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Note
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
