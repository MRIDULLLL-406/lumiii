import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  Plus,
  History,
  Settings as SettingsIcon,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import type { UserProfile, Task, MicroWin } from '../types';

interface DashboardProps {
  profile: UserProfile;
  tasks: Task[];
  microWins: MicroWin[];
  onNewTask: () => void;
  onResumeTask: (task: Task) => void;
  onSettings: () => void;
  onStartOver: () => void;
}

export function Dashboard({
  profile,
  tasks,
  microWins,
  onNewTask,
  onResumeTask,
  onSettings,
  onStartOver,
}: DashboardProps) {
  const activeTasks = tasks.filter(t => !t.completedAt);
  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    return t.completedAt.getTime() >= today;
  });
  const winsToday = microWins.filter(w => {
    const today = new Date().setHours(0, 0, 0, 0);
    return w.timestamp.getTime() >= today;
  });

  const lowSensory = profile.preferences.lowSensoryMode;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={lowSensory ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl w-full space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Welcome back</h1>
            <p className="text-lg text-muted-foreground mt-1">
              {winsToday.length > 0 
                ? `${winsToday.length} micro-wins today`
                : "Ready when you are"}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onSettings}
          >
            <SettingsIcon className="size-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="size-4" />
                <span className="text-sm">Micro-wins</span>
              </div>
              <span className="text-3xl font-bold">{winsToday.length}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="size-4" />
                <span className="text-sm">Today</span>
              </div>
              <span className="text-3xl font-bold">{completedToday.length}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="size-4" />
                <span className="text-sm">Active</span>
              </div>
              <span className="text-3xl font-bold">{activeTasks.length}</span>
            </div>
          </Card>
        </div>

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Continue where you left off</h2>
            <div className="space-y-2">
              {activeTasks.map(task => {
                const completedSteps = task.steps.filter(s => s.isComplete).length;
                const progress = (completedSteps / task.steps.length) * 100;
                
                return (
                  <button
                    key={task.id}
                    onClick={() => onResumeTask(task)}
                    className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge variant={
                        task.energyLevel === 'low' ? 'secondary' :
                        task.energyLevel === 'medium' ? 'default' : 'destructive'
                      }>
                        {task.energyLevel}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{completedSteps} of {task.steps.length} steps</span>
                        {task.isJustStart && (
                          <Badge variant="outline" className="text-xs">Just Start</Badge>
                        )}
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* New Task */}
        <Button
          onClick={onNewTask}
          size="lg"
          className="w-full py-8 text-lg"
        >
          <Plus className="size-6 mr-2" />
          Start something new
        </Button>

        {/* Recent completions */}
        {completedToday.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <History className="size-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Completed today</h2>
            </div>
            <div className="space-y-2">
              {completedToday.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                >
                  <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    {task.easeRating && (
                      <p className="text-sm text-muted-foreground">
                        Ease: {task.easeRating}/5
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Start Over */}
        <div className="pt-4 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <RotateCcw className="size-4 mr-2" />
                Start over from welcome
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Return to welcome page?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will take you back to the welcome screen. Your profile and all data will remain saved and you can return to this dashboard anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onStartOver}>
                  Go to welcome
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </div>
  );
}