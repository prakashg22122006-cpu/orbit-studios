import { useState, useEffect } from 'react';
import { UserProfile, Challenge, Badge } from '@/types';
import { storage, STORES } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap, Award } from 'lucide-react';
import { calculateLevel, calculateRank, getNextRank, getMotivationalMessage } from '@/lib/gamification';

export default function Gamification() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    loadProfile();
    loadChallenges();
  }, []);

  const loadProfile = async () => {
    const profiles = await storage.getAll<UserProfile>(STORES.profile);
    if (profiles.length > 0) {
      setProfile(profiles[0]);
    } else {
      const newProfile: UserProfile = {
        id: crypto.randomUUID(),
        name: 'Student',
        level: 1,
        xp: 0,
        rank: 'Novice',
        badges: [],
        totalFocusHours: 0,
        totalTasksCompleted: 0,
        streakDays: 0,
        theme: {
          mode: 'light',
          accentColor: 'hsl(199 89% 48%)',
          fontSize: 'medium',
          fontFamily: 'system-ui',
        },
        preferences: {
          pomodoroDuration: 25,
          shortBreak: 5,
          longBreak: 15,
          dailyGoal: 8,
          notifications: true,
          sounds: true,
          autoBackup: true,
        },
      };
      await storage.add(STORES.profile, newProfile);
      setProfile(newProfile);
    }
  };

  const loadChallenges = async () => {
    const data = await storage.getAll<Challenge>(STORES.challenges);
    setChallenges(data);
  };

  if (!profile) return null;

  const level = calculateLevel(profile.xp);
  const rank = calculateRank(profile.xp);
  const nextRank = getNextRank(rank);
  const motivationalMsg = getMotivationalMessage(profile.xp, rank);

  const rankColors = {
    Novice: 'text-muted-foreground',
    Learner: 'text-primary',
    Scholar: 'text-accent',
    Expert: 'text-success',
    Master: 'text-purple-500',
    Legend: 'text-yellow-500',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Achievements & Progress</h1>
          <p className="text-muted-foreground">{motivationalMsg}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className={`text-lg font-semibold ${rankColors[rank]}`}>{rank}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">Level {level}</div>
                <div className="text-sm text-muted-foreground">{profile.xp} XP</div>
              </div>
            </div>

            {nextRank && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to {nextRank.rank}</span>
                  <span>{profile.xp} / {nextRank.xpNeeded} XP</span>
                </div>
                <Progress value={(profile.xp / nextRank.xpNeeded) * 100} />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.totalTasksCompleted}</div>
                <div className="text-xs text-muted-foreground">Tasks Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.totalFocusHours}h</div>
                <div className="text-xs text-muted-foreground">Focus Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.streakDays}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Badges Earned
            </h3>
            {profile.badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {profile.badges.map(badge => (
                  <div key={badge.id} className="text-center space-y-1">
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="text-xs font-medium">{badge.name}</div>
                    <div className="text-xs text-muted-foreground">{badge.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No badges earned yet. Keep working to unlock achievements!</p>
              </div>
            )}
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Active Challenges
          </h3>
          
          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map(challenge => (
                <Card key={challenge.id} className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold">{challenge.name}</h4>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <BadgeUI variant="secondary">{challenge.type}</BadgeUI>
                    <div className="flex items-center gap-1 text-accent">
                      <Zap className="w-4 h-4" />
                      <span>+{challenge.reward.xp} XP</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No active challenges yet!</p>
            </Card>
          )}
        </div>

        <Card className="p-6 bg-gradient-hero text-primary-foreground">
          <div className="flex items-center gap-4">
            <Star className="w-12 h-12" />
            <div className="flex-1">
              <h3 className="text-xl font-bold">Keep Up the Great Work!</h3>
              <p className="opacity-90">You're making amazing progress. Every action counts!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{profile.xp}</div>
              <div className="text-sm opacity-90">Total XP</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
