import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Award, Clock, CheckCircle2, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Analytics = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedHabits = localStorage.getItem('habits');
    const savedSessions = localStorage.getItem('studySessions');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  const taskCompletion = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
    : 0;
  
  const habitSuccess = habits.length > 0 
    ? Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100) 
    : 0;
  
  const totalStudyHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  
  const studyByCategory = tasks.reduce((acc: any, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const hasData = tasks.length > 0 || habits.length > 0 || sessions.length > 0;
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Analytics Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Track your progress and productivity insights
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {!hasData ? (
          <Card className="shadow-lg mb-8">
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-bold mb-2">No Data Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start adding tasks, habits, and study sessions to see your analytics
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/tasks">Add Tasks</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/habits">Add Habits</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/study">Start Studying</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="gradient-card border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-primary" />
                    <span className="text-3xl font-bold">{taskCompletion}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Task Completion</p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 text-accent" />
                    <span className="text-3xl font-bold">{habitSuccess}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Habit Success</p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-success" />
                    <span className="text-3xl font-bold">{totalStudyHours.toFixed(1)}h</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Study Hours</p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <span className="text-3xl font-bold">{sessions.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {hasData && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Progress Overview</CardTitle>
                <CardDescription>Your productivity metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Tasks Completed</span>
                    <span className="text-sm text-muted-foreground">
                      {tasks.filter(t => t.completed).length}/{tasks.length}
                    </span>
                  </div>
                  <Progress value={taskCompletion} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Habits Completed Today</span>
                    <span className="text-sm text-muted-foreground">
                      {habits.filter(h => h.completedToday).length}/{habits.length}
                    </span>
                  </div>
                  <Progress value={habitSuccess} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Study Sessions</span>
                    <span className="text-sm text-muted-foreground">{sessions.length} total</span>
                  </div>
                  <Progress value={Math.min((sessions.length / 20) * 100, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Task Categories</CardTitle>
                <CardDescription>Distribution of your tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(studyByCategory).length > 0 ? (
                  Object.entries(studyByCategory).map(([category, count]: [string, any]) => (
                    <CategoryBar 
                      key={category}
                      label={category} 
                      hours={count} 
                      color="bg-primary" 
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No category data yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Summary</CardTitle>
                <CardDescription>Your productivity at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InsightCard 
                  icon={<Target className="w-5 h-5 text-primary" />}
                  title="Total Tasks"
                  description={`${tasks.length} tasks created, ${tasks.filter(t => t.completed).length} completed`}
                />
                <InsightCard 
                  icon={<Award className="w-5 h-5 text-accent" />}
                  title="Total Habits"
                  description={`${habits.length} habits tracked with ${habits.reduce((sum, h) => sum + h.xp, 0)} XP earned`}
                />
                <InsightCard 
                  icon={<Clock className="w-5 h-5 text-success" />}
                  title="Study Time"
                  description={`${sessions.length} sessions completed for ${totalStudyHours.toFixed(1)} hours total`}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryBar = ({ label, hours, color }: { label: string; hours: number; color: string }) => {
  const maxHours = 12;
  const percentage = (hours / maxHours) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{hours}h</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-smooth`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const AchievementItem = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const InsightCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="font-medium mb-1">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Analytics;
