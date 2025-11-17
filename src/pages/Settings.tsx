import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { storage, STORES } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profiles = await storage.getAll<UserProfile>(STORES.profile);
    if (profiles.length > 0) {
      setProfile(profiles[0]);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updated = { ...profile, ...updates };
    await storage.update(STORES.profile, updated);
    setProfile(updated);
    toast({ title: 'Settings updated!' });
  };

  const handleExport = async () => {
    const data = await storage.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productivity-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast({ title: 'Data exported successfully!' });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result as string;
        await storage.importData(data);
        toast({ title: 'Data imported successfully!' });
        window.location.reload();
      } catch (error) {
        toast({ title: 'Import failed', description: 'Invalid backup file', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="focus">Focus & Study</TabsTrigger>
            <TabsTrigger value="data">Data & Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="p-6 space-y-6">
              <div>
                <Label>Display Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get reminders and updates</p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications}
                    onCheckedChange={(checked) =>
                      updateProfile({ preferences: { ...profile.preferences, notifications: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for actions</p>
                  </div>
                  <Switch
                    checked={profile.preferences.sounds}
                    onCheckedChange={(checked) =>
                      updateProfile({ preferences: { ...profile.preferences, sounds: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Daily automatic backups</p>
                  </div>
                  <Switch
                    checked={profile.preferences.autoBackup}
                    onCheckedChange={(checked) =>
                      updateProfile({ preferences: { ...profile.preferences, autoBackup: checked } })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="p-6 space-y-6">
              <div>
                <Label>Theme Mode</Label>
                <Select
                  value={profile.theme.mode}
                  onValueChange={(mode: any) =>
                    updateProfile({ theme: { ...profile.theme, mode } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <span className="flex items-center gap-2">
                        <Sun className="w-4 h-4" /> Light
                      </span>
                    </SelectItem>
                    <SelectItem value="dark">
                      <span className="flex items-center gap-2">
                        <Moon className="w-4 h-4" /> Dark
                      </span>
                    </SelectItem>
                    <SelectItem value="focus">Focus Mode</SelectItem>
                    <SelectItem value="night">Night Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Font Size</Label>
                <Select
                  value={profile.theme.fontSize}
                  onValueChange={(fontSize: any) =>
                    updateProfile({ theme: { ...profile.theme, fontSize } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="focus">
            <Card className="p-6 space-y-6">
              <div>
                <Label>Pomodoro Duration (minutes)</Label>
                <Input
                  type="number"
                  value={profile.preferences.pomodoroDuration}
                  onChange={(e) =>
                    updateProfile({
                      preferences: { ...profile.preferences, pomodoroDuration: parseInt(e.target.value) },
                    })
                  }
                />
              </div>

              <div>
                <Label>Short Break (minutes)</Label>
                <Input
                  type="number"
                  value={profile.preferences.shortBreak}
                  onChange={(e) =>
                    updateProfile({
                      preferences: { ...profile.preferences, shortBreak: parseInt(e.target.value) },
                    })
                  }
                />
              </div>

              <div>
                <Label>Long Break (minutes)</Label>
                <Input
                  type="number"
                  value={profile.preferences.longBreak}
                  onChange={(e) =>
                    updateProfile({
                      preferences: { ...profile.preferences, longBreak: parseInt(e.target.value) },
                    })
                  }
                />
              </div>

              <div>
                <Label>Daily Focus Goal (hours)</Label>
                <Input
                  type="number"
                  value={profile.preferences.dailyGoal}
                  onChange={(e) =>
                    updateProfile({
                      preferences: { ...profile.preferences, dailyGoal: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all your data as a JSON backup file
                </p>
                <Button onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Restore data from a backup file
                </p>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                />
              </div>

              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Clear all data from the application. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={() => {
                  if (confirm('Are you sure? This will delete ALL your data!')) {
                    localStorage.clear();
                    indexedDB.deleteDatabase('StudentProductivityOS');
                    window.location.reload();
                  }
                }}>
                  Clear All Data
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
}
