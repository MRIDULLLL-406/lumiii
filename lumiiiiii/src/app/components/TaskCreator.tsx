import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Battery, BatteryMedium, Zap, Sparkles, ArrowRight } from 'lucide-react';
import type { EnergyLevel, Task, UserProfile } from '../types';
import { generateJustStartTasks, breakDownTask } from '../utils/ai-responses';

interface TaskCreatorProps {
  profile: UserProfile;
  onCreateTask: (task: Task) => void;
  onBack: () => void;
}

export function TaskCreator({ profile, onCreateTask, onBack }: TaskCreatorProps) {
  const [mode, setMode] = useState<'choice' | 'just-start' | 'custom'>('choice');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('medium');
  const [selectedJustStart, setSelectedJustStart] = useState<number | null>(null);

  const justStartTasks = generateJustStartTasks();

  const handleJustStartSelect = (index: number) => {
    const selected = justStartTasks[index];
    const task: Task = {
      id: crypto.randomUUID(),
      title: selected.title,
      energyLevel: 'low',
      estimatedMinutes: selected.minutes,
      steps: selected.steps.map((step, i) => ({
        id: crypto.randomUUID(),
        description: step,
        isComplete: false,
        simplifiedDescription: step.split(' ').slice(0, 4).join(' '),
      })),
      isJustStart: true,
      createdAt: new Date(),
      stuckCount: 0,
      pauseCount: 0,
    };
    onCreateTask(task);
  };

  const handleCustomTask = () => {
    if (!customTitle.trim()) return;

    const steps = breakDownTask(customTitle);
    const task: Task = {
      id: crypto.randomUUID(),
      title: customTitle,
      energyLevel: selectedEnergy,
      estimatedMinutes: selectedEnergy === 'low' ? 10 : selectedEnergy === 'medium' ? 20 : 30,
      steps: steps.map(step => ({
        id: crypto.randomUUID(),
        description: step,
        isComplete: false,
        simplifiedDescription: step.length > 40 ? step.slice(0, 40) + '...' : undefined,
        voiceGuidance: undefined,
      })),
      createdAt: new Date(),
      stuckCount: 0,
      pauseCount: 0,
    };
    onCreateTask(task);
  };

  if (mode === 'choice') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">What do you need to do?</h1>
            <p className="text-lg text-muted-foreground">
              Pick a path that matches your energy right now.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setMode('just-start')}
              className="w-full text-left p-6 border rounded-lg hover:bg-accent hover:border-primary transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-6 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold">Just Start Mode</h3>
                  <p className="text-muted-foreground">
                    Tiny 2-5 minute tasks. Perfect for when you're stuck or overwhelmed.
                  </p>
                  <Badge variant="secondary" className="mt-2">Easiest</Badge>
                </div>
                <ArrowRight className="size-5 text-muted-foreground" />
              </div>
            </button>

            <button
              onClick={() => setMode('custom')}
              className="w-full text-left p-6 border rounded-lg hover:bg-accent hover:border-primary transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="size-6 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold">My Own Task</h3>
                  <p className="text-muted-foreground">
                    Tell me what you need to do, and I'll break it down into steps.
                  </p>
                </div>
                <ArrowRight className="size-5 text-muted-foreground" />
              </div>
            </button>
          </div>

          <Button onClick={onBack} variant="outline" className="w-full">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  if (mode === 'just-start') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Pick a starter task</h1>
            <p className="text-lg text-muted-foreground">
              These are designed to take 2-5 minutes. Just enough to break through the wall.
            </p>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {justStartTasks.map((task, index) => (
              <button
                key={index}
                onClick={() => handleJustStartSelect(index)}
                className="w-full text-left p-4 border rounded-lg hover:bg-accent hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {task.steps.length} steps · ~{task.minutes} min
                    </p>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>

          <Button onClick={() => setMode('choice')} variant="outline" className="w-full">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">What's the task?</h1>
          <p className="text-lg text-muted-foreground">
            Just a simple description. I'll break it down for you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task description</Label>
            <Input
              id="task-title"
              placeholder="e.g., Send an email to my boss, Clean the kitchen, Write a paragraph"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="text-lg py-6"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>What's your energy level right now?</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedEnergy('low')}
                className={`p-4 border rounded-lg transition-all ${
                  selectedEnergy === 'low'
                    ? 'bg-accent border-primary'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Battery className="size-8 text-green-600" />
                  <span className="font-semibold">Low</span>
                  <span className="text-xs text-muted-foreground">Minimal steps</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedEnergy('medium')}
                className={`p-4 border rounded-lg transition-all ${
                  selectedEnergy === 'medium'
                    ? 'bg-accent border-primary'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <BatteryMedium className="size-8 text-blue-600" />
                  <span className="font-semibold">Medium</span>
                  <span className="text-xs text-muted-foreground">Balanced</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedEnergy('high')}
                className={`p-4 border rounded-lg transition-all ${
                  selectedEnergy === 'high'
                    ? 'bg-accent border-primary'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Zap className="size-8 text-orange-600" />
                  <span className="font-semibold">High</span>
                  <span className="text-xs text-muted-foreground">More focus</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setMode('choice')} variant="outline" className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleCustomTask}
            disabled={!customTitle.trim()}
            className="flex-1"
            size="lg"
          >
            Break it down
          </Button>
        </div>
      </Card>
    </div>
  );
}
