import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Award, Clock, CheckCircle2, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Analytics = () => {
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

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold">87%</span>
              </div>
              <p className="text-sm text-muted-foreground">Task Completion</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-accent" />
                <span className="text-3xl font-bold">92%</span>
              </div>
              <p className="text-sm text-muted-foreground">Habit Success</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-success" />
                <span className="text-3xl font-bold">24.5h</span>
              </div>
              <p className="text-sm text-muted-foreground">Study Hours</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold">+12%</span>
              </div>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Progress */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Weekly Progress</CardTitle>
              <CardDescription>Your productivity breakdown for this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Tasks Completed</span>
                  <span className="text-sm text-muted-foreground">42/48</span>
                </div>
                <Progress value={87.5} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Habits Maintained</span>
                  <span className="text-sm text-muted-foreground">32/35</span>
                </div>
                <Progress value={91.4} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Study Hours Goal</span>
                  <span className="text-sm text-muted-foreground">24.5/28h</span>
                </div>
                <Progress value={87.5} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Focus Sessions</span>
                  <span className="text-sm text-muted-foreground">18/20</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Task Categories</CardTitle>
              <CardDescription>Time spent by category this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CategoryBar label="Study" hours={12} color="bg-primary" />
              <CategoryBar label="Projects" hours={6} color="bg-accent" />
              <CategoryBar label="Personal" hours={4} color="bg-success" />
              <CategoryBar label="Health" hours={2.5} color="bg-destructive" />
            </CardContent>
          </Card>

          {/* Top Achievements */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Achievements</CardTitle>
              <CardDescription>Your latest milestones and badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AchievementItem 
                icon={<Award className="w-6 h-6 text-accent" />}
                title="7 Day Streak"
                description="Maintained habits for a full week"
              />
              <AchievementItem 
                icon={<CheckCircle2 className="w-6 h-6 text-success" />}
                title="100 Tasks Completed"
                description="Reached task completion milestone"
              />
              <AchievementItem 
                icon={<Clock className="w-6 h-6 text-primary" />}
                title="50 Hours Studied"
                description="Total focus time achievement"
              />
              <AchievementItem 
                icon={<TrendingUp className="w-6 h-6 text-accent" />}
                title="Productivity Master"
                description="90%+ completion rate this month"
              />
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Performance Insights</CardTitle>
              <CardDescription>AI-powered productivity analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InsightCard 
                icon={<TrendingUp className="w-5 h-5 text-success" />}
                title="Peak Productivity"
                description="You're most productive between 8-10 PM"
              />
              <InsightCard 
                icon={<BarChart3 className="w-5 h-5 text-primary" />}
                title="Study Pattern"
                description="Best focus during 90-minute deep sessions"
              />
              <InsightCard 
                icon={<Award className="w-5 h-5 text-accent" />}
                title="Habit Consistency"
                description="Morning habits have the highest success rate"
              />
              <InsightCard 
                icon={<Target className="w-5 h-5 text-success" />}
                title="Goal Progress"
                description="On track to exceed this month's targets by 15%"
              />
            </CardContent>
          </Card>
        </div>
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
