import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Trophy, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Habit {
  id: number;
  title: string;
  streak: number;
  completedToday: boolean;
  category: string;
  xp: number;
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, title: "Morning Exercise", streak: 12, completedToday: false, category: "Health", xp: 120 },
    { id: 2, title: "Read for 30 min", streak: 8, completedToday: false, category: "Learning", xp: 80 },
    { id: 3, title: "Practice Meditation", streak: 5, completedToday: false, category: "Wellness", xp: 50 },
    { id: 4, title: "Journal Entry", streak: 15, completedToday: false, category: "Personal", xp: 150 },
    { id: 5, title: "Study Session", streak: 20, completedToday: false, category: "Study", xp: 200 },
  ]);

  const totalXP = habits.reduce((sum, habit) => sum + habit.xp, 0);
  const completedToday = habits.filter(h => h.completedToday).length;
  const longestStreak = Math.max(...habits.map(h => h.streak));

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : habit.streak,
          xp: newCompleted ? habit.xp + 10 : habit.xp
        };
      }
      return habit;
    }));
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Habit Tracker</h1>
              <p className="text-xl text-muted-foreground">
                Build consistency, earn rewards, and track your progress
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Habits List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Daily Habits</CardTitle>
            <CardDescription>Check off each habit as you complete them today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.map(habit => (
              <HabitCard 
                key={habit.id}
                habit={habit}
                onToggle={() => toggleHabit(habit.id)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
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
    </div>
  );
};

const HabitCard = ({ habit, onToggle }: { habit: Habit; onToggle: () => void }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth">
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
