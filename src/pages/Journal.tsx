import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types';
import { storage, STORES } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Calendar, Smile, Frown, Meh } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const moodEmojis = {
  excellent: { icon: '🤩', color: 'text-success' },
  good: { icon: '😊', color: 'text-primary' },
  okay: { icon: '😐', color: 'text-muted-foreground' },
  bad: { icon: '😔', color: 'text-accent' },
  terrible: { icon: '😢', color: 'text-destructive' },
};

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    mood: 'good' as JournalEntry['mood'],
    content: '',
    reflection: '',
    gratitude: ['', '', ''],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await storage.getAll<JournalEntry>(STORES.journal);
    setEntries(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood: formData.mood,
      content: formData.content,
      reflection: formData.reflection,
      gratitude: formData.gratitude.filter(Boolean),
    };

    await storage.add(STORES.journal, entry);
    toast({ title: 'Journal entry saved!' });
    resetForm();
    loadEntries();
  };

  const resetForm = () => {
    setFormData({
      mood: 'good',
      content: '',
      reflection: '',
      gratitude: ['', '', ''],
    });
    setIsDialogOpen(false);
  };

  const getMoodStats = () => {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return moodCounts;
  };

  const moodStats = getMoodStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Daily Journal</h1>
            <p className="text-muted-foreground">Track your mood and reflections</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Entry
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(moodEmojis).map(([mood, { icon, color }]) => (
            <Card key={mood} className="p-4 text-center">
              <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
              <div className="text-sm capitalize text-muted-foreground">{mood}</div>
              <div className="text-2xl font-bold mt-1">{moodStats[mood] || 0}</div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {entries.map(entry => {
            const mood = moodEmojis[entry.mood];
            return (
              <Card key={entry.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className={`text-4xl ${mood.color}`}>{mood.icon}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Journal Entry</h4>
                      <p className="text-muted-foreground">{entry.content}</p>
                    </div>

                    {entry.reflection && (
                      <div>
                        <h4 className="font-semibold mb-1">Reflection</h4>
                        <p className="text-muted-foreground">{entry.reflection}</p>
                      </div>
                    )}

                    {entry.gratitude && entry.gratitude.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-1">Grateful For</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {entry.gratitude.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {entries.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No journal entries yet</h3>
              <p className="text-muted-foreground mb-4">Start journaling to track your daily mood and thoughts!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Create First Entry
              </Button>
            </Card>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>How are you feeling today?</Label>
                <Select value={formData.mood} onValueChange={(v: any) => setFormData({ ...formData, mood: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(moodEmojis).map(([mood, { icon }]) => (
                      <SelectItem key={mood} value={mood}>
                        <span className="flex items-center gap-2">
                          <span>{icon}</span>
                          <span className="capitalize">{mood}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>What's on your mind?</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write about your day, thoughts, feelings..."
                  rows={6}
                />
              </div>

              <div>
                <Label>Daily Reflection</Label>
                <Textarea
                  value={formData.reflection}
                  onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                  placeholder="What did you learn today? What could you improve?"
                  rows={4}
                />
              </div>

              <div>
                <Label>Three things I'm grateful for</Label>
                <div className="space-y-2">
                  {formData.gratitude.map((item, i) => (
                    <Textarea
                      key={i}
                      value={item}
                      onChange={(e) => {
                        const updated = [...formData.gratitude];
                        updated[i] = e.target.value;
                        setFormData({ ...formData, gratitude: updated });
                      }}
                      placeholder={`Gratitude #${i + 1}`}
                      rows={1}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">Save Entry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
