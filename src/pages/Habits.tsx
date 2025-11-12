import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Award, Trophy, Star, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: number;
  title: string;
  streak: number;
  completedToday: boolean;
  category: string;
  xp: number;
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("Health");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const totalXP = habits.reduce((sum, habit) => sum + habit.xp, 0);
  const completedToday = habits.filter(h => h.completedToday).length;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          xp: newCompleted ? habit.xp + 10 : Math.max(0, habit.xp - 10)
        };
      }
      return habit;
    }));
    toast({
      title: "Habit updated",
      description: "Keep up the great work!",
    });
  };

  const addHabit = () => {
    if (newHabitTitle.trim()) {
      const newHabit: Habit = {
        id: Date.now(),
        title: newHabitTitle,
        streak: 0,
        completedToday: false,
        category: newHabitCategory,
        xp: 0
      };
      setHabits([...habits, newHabit]);
      setNewHabitTitle("");
      setNewHabitCategory("Health");
      setIsAddDialogOpen(false);
      toast({
        title: "Habit created",
        description: "Start building your new habit today!",
      });
    }
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
    toast({
      title: "Habit deleted",
      description: "Habit has been removed",
    });
  };

  const openEditDialog = (habit: Habit) => {
    setEditingHabit(habit);
    setIsEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (editingHabit) {
      setHabits(habits.map(habit => 
        habit.id === editingHabit.id ? editingHabit : habit
      ));
      setIsEditDialogOpen(false);
      setEditingHabit(null);
      toast({
        title: "Habit updated",
        description: "Changes saved successfully",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Habit Tracker</h1>
              <p className="text-xl text-muted-foreground">
                Build consistency, earn rewards, and track your progress
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">Back</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-10 h-10 text-accent" />
                <span className="text-4xl font-bold">{totalXP}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total XP Earned</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-10 h-10 text-success" />
                <span className="text-4xl font-bold">{completedToday}/{habits.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-10 h-10 text-primary" />
                <span className="text-4xl font-bold">{longestStreak}</span>
              </div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Daily Habits</CardTitle>
            <CardDescription>Check off each habit as you complete them today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No habits yet</p>
                <p className="text-sm mb-4">Start building positive habits today!</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Habit
                </Button>
              </div>
            ) : (
              habits.map(habit => (
                <HabitCard 
                  key={habit.id}
                  habit={habit}
                  onToggle={() => toggleHabit(habit.id)}
                  onEdit={() => openEditDialog(habit)}
                  onDelete={() => deleteHabit(habit.id)}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Achievements</CardTitle>
            <CardDescription>Unlock badges as you build consistency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AchievementBadge 
                icon={<Star className="w-8 h-8" />}
                title="7 Day Streak"
                unlocked={longestStreak >= 7}
              />
              <AchievementBadge 
                icon={<Trophy className="w-8 h-8" />}
                title="14 Day Streak"
                unlocked={longestStreak >= 14}
              />
              <AchievementBadge 
                icon={<Award className="w-8 h-8" />}
                title="30 Day Streak"
                unlocked={longestStreak >= 30}
              />
              <AchievementBadge 
                icon={<CheckCircle2 className="w-8 h-8" />}
                title="100% Week"
                unlocked={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Habit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>Create a new habit to track daily</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Habit Title</Label>
              <Input 
                placeholder="e.g., Morning Exercise"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={newHabitCategory} onValueChange={setNewHabitCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={addHabit}>Add Habit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Habit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>Update your habit details</DialogDescription>
          </DialogHeader>
          {editingHabit && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Habit Title</Label>
                <Input 
                  value={editingHabit.title}
                  onChange={(e) => setEditingHabit({...editingHabit, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select 
                  value={editingHabit.category} 
                  onValueChange={(value) => setEditingHabit({...editingHabit, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Wellness">Wellness</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Study">Study</SelectItem>
                  </SelectContent>
                </Select>
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

const HabitCard = ({ 
  habit, 
  onToggle, 
  onEdit, 
  onDelete 
}: { 
  habit: Habit; 
  onToggle: () => void; 
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth group">
      <button 
        onClick={onToggle}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          habit.completedToday 
            ? 'bg-success border-success' 
            : 'border-muted-foreground hover:border-success'
        }`}
      >
        {habit.completedToday && <CheckCircle2 className="w-6 h-6 text-white" />}
      </button>

      <div className="flex-1">
        <p className={`font-medium text-lg ${habit.completedToday ? 'line-through text-muted-foreground' : ''}`}>
          {habit.title}
        </p>
        <Badge variant="outline" className="mt-1">{habit.category}</Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1 text-accent">
            <Award className="w-5 h-5" />
            <span className="text-xl font-bold">{habit.streak}</span>
          </div>
          <p className="text-xs text-muted-foreground">day streak</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-primary">
            <Star className="w-5 h-5" />
            <span className="text-xl font-bold">{habit.xp}</span>
          </div>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>

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
    </div>
  );
};

const AchievementBadge = ({ 
  icon, 
  title, 
  unlocked 
}: { 
  icon: React.ReactNode; 
  title: string; 
  unlocked: boolean;
}) => {
  return (
    <div 
      className={`p-6 rounded-xl text-center transition-smooth ${
        unlocked 
          ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent' 
          : 'bg-muted/50 opacity-50'
      }`}
    >
      <div className={`mb-2 inline-flex ${unlocked ? 'text-accent' : 'text-muted-foreground'}`}>
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
};

export default Habits;
