import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Brain, Heart, BookOpen, Sparkles } from 'lucide-react';
import type { NeuroProfile, MotivationStyle, UserProfile } from '../types';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [neuroProfile, setNeuroProfile] = useState<NeuroProfile>('adhd');
  const [motivationStyle, setMotivationStyle] = useState<MotivationStyle>('friendly');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lowSensoryMode, setLowSensoryMode] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [celebrationStyle, setCelebrationStyle] = useState<'subtle' | 'moderate' | 'enthusiastic' | 'none'>('moderate');

  const handleComplete = () => {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      neuroProfile,
      motivationStyle,
      preferences: {
        voiceEnabled,
        readingMode: true,
        lowSensoryMode,
        focusBubbleDefault: true,
        celebrationStyle,
        sessionLimitMinutes: 25,
        dyslexiaFont,
      },
      createdAt: new Date(),
      lastActive: new Date(),
    };
    onComplete(profile);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Welcome</h1>
            <p className="text-lg text-muted-foreground">
              This is a different kind of task assistant. No shame. No pressure. Just support.
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-base">How does your brain work?</Label>
            <RadioGroup value={neuroProfile} onValueChange={(value) => setNeuroProfile(value as NeuroProfile)}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="adhd" id="adhd" />
                <Label htmlFor="adhd" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <Sparkles className="size-5" />
                  <div>
                    <div className="font-medium">ADHD</div>
                    <div className="text-sm text-muted-foreground">Executive function, focus, time blindness</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="autism" id="autism" />
                <Label htmlFor="autism" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <Brain className="size-5" />
                  <div>
                    <div className="font-medium">Autism / Autistic</div>
                    <div className="text-sm text-muted-foreground">Processing, routine, sensory needs</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="dyslexia" id="dyslexia" />
                <Label htmlFor="dyslexia" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <BookOpen className="size-5" />
                  <div>
                    <div className="font-medium">Dyslexia / Reading differences</div>
                    <div className="text-sm text-muted-foreground">Text processing, visual needs</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <Heart className="size-5" />
                  <div>
                    <div className="font-medium">Multiple / Combination</div>
                    <div className="text-sm text-muted-foreground">More than one of these</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Just here for support</div>
                    <div className="text-sm text-muted-foreground">General task help</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={() => setStep(2)} className="w-full" size="lg">
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">How should I talk to you?</h1>
            <p className="text-lg text-muted-foreground">
              Pick the style that feels most supportive to you.
            </p>
          </div>

          <RadioGroup value={motivationStyle} onValueChange={(value) => setMotivationStyle(value as MotivationStyle)}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="calm" id="calm" />
              <Label htmlFor="calm" className="flex-1 cursor-pointer">
                <div className="font-medium">Calm & Gentle</div>
                <div className="text-sm text-muted-foreground">"It's okay to pause here. Take your time."</div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="friendly" id="friendly" />
              <Label htmlFor="friendly" className="flex-1 cursor-pointer">
                <div className="font-medium">Friendly & Warm</div>
                <div className="text-sm text-muted-foreground">"Hey! Let's figure this out together."</div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct" className="flex-1 cursor-pointer">
                <div className="font-medium">Direct & Clear</div>
                <div className="text-sm text-muted-foreground">"You're stuck. Let's solve it."</div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex gap-2">
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1" size="lg">
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1" size="lg">
              Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">A few preferences</h1>
          <p className="text-lg text-muted-foreground">
            You can always change these later.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base">Voice guidance</Label>
              <p className="text-sm text-muted-foreground">Steps read aloud to you</p>
            </div>
            <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base">Dyslexia-friendly font</Label>
              <p className="text-sm text-muted-foreground">Easier-to-read text style</p>
            </div>
            <Switch checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base">Low sensory mode</Label>
              <p className="text-sm text-muted-foreground">Reduced animations and sounds</p>
            </div>
            <Switch checked={lowSensoryMode} onCheckedChange={setLowSensoryMode} />
          </div>

          <div className="space-y-3">
            <Label className="text-base">Celebration style</Label>
            <RadioGroup value={celebrationStyle} onValueChange={(value) => setCelebrationStyle(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="cursor-pointer">None (just mark as done)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtle" id="subtle" />
                <Label htmlFor="subtle" className="cursor-pointer">Subtle (small checkmark)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate" className="cursor-pointer">Moderate (gentle animation)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enthusiastic" id="enthusiastic" />
                <Label htmlFor="enthusiastic" className="cursor-pointer">Enthusiastic (full celebration)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setStep(2)} variant="outline" className="flex-1" size="lg">
            Back
          </Button>
          <Button onClick={handleComplete} className="flex-1" size="lg">
            Start
          </Button>
        </div>
      </Card>
    </div>
  );
}
