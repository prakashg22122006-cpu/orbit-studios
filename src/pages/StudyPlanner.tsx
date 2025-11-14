import { useState, useEffect } from 'react';
import { StudyPlan, Subject, StudySession } from '@/types';
import { storage, STORES } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, BookOpen, Calendar, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportToCSV, generateStudyReport, exportToText } from '@/lib/export';

export default function StudyPlanner() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    subjects: [] as Subject[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const plansData = await storage.getAll<StudyPlan>(STORES.studyPlans);
    const sessionsData = await storage.getAll<StudySession>(STORES.studySessions);
    setPlans(plansData);
    setSessions(sessionsData);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const plan: StudyPlan = {
      id: crypto.randomUUID(),
      title: formData.title,
      subjects: formData.subjects,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalHours: formData.subjects.reduce((sum, s) => sum + s.allocatedHours, 0),
      createdAt: new Date().toISOString(),
    };

    await storage.add(STORES.studyPlans, plan);
    toast({ title: 'Study plan created!' });
    setIsDialogOpen(false);
    loadData();
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        {
          id: crypto.randomUUID(),
          name: '',
          topics: [],
          allocatedHours: 0,
          completedHours: 0,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        },
      ],
    });
  };

  const updateSubject = (index: number, field: keyof Subject, value: any) => {
    const updated = [...formData.subjects];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, subjects: updated });
  };

  const handleExport = () => {
    const report = generateStudyReport(sessions);
    exportToText(report, 'study-report');
    exportToCSV(sessions.map(s => ({
      Subject: s.subject,
      Duration: `${s.duration} min`,
      Type: s.type,
      Date: new Date(s.startTime).toLocaleDateString(),
    })), 'study-sessions');
    toast({ title: 'Study data exported!' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Planner</h1>
            <p className="text-muted-foreground">Organize your learning schedule</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create Plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{plans.length}</div>
                <div className="text-sm text-muted-foreground">Study Plans</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{sessions.length}</div>
                <div className="text-sm text-muted-foreground">Study Sessions</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h
                </div>
                <div className="text-sm text-muted-foreground">Total Study Time</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <Card key={plan.id} className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{plan.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span className="font-semibold">
                    {plan.subjects.length > 0 
                      ? Math.round((plan.subjects.reduce((sum, s) => sum + s.completedHours, 0) / plan.totalHours) * 100)
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={plan.subjects.length > 0 
                    ? (plan.subjects.reduce((sum, s) => sum + s.completedHours, 0) / plan.totalHours) * 100 
                    : 0
                  } 
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Subjects</h4>
                {plan.subjects.map(subject => (
                  <div key={subject.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                      <span>{subject.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {subject.completedHours}h / {subject.allocatedHours}h
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {plans.length === 0 && (
            <Card className="p-12 col-span-2 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Study Plans Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first study plan to get started!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Create Plan
              </Button>
            </Card>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Study Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <Label>Plan Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Final Exam Preparation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Subjects</Label>
                  <Button type="button" size="sm" onClick={addSubject}>
                    <Plus className="w-3 h-3 mr-1" /> Add Subject
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.subjects.map((subject, index) => (
                    <Card key={subject.id} className="p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Subject name"
                          value={subject.name}
                          onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Hours"
                          value={subject.allocatedHours}
                          onChange={(e) => updateSubject(index, 'allocatedHours', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Plan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
