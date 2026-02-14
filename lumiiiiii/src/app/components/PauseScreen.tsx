import { Button } from './ui/button';
import { Card } from './ui/card';
import { Coffee, Heart } from 'lucide-react';
import type { UserProfile } from '../types';
import { generateAIResponse } from '../utils/ai-responses';

interface PauseScreenProps {
  profile: UserProfile;
  onResume: () => void;
}

export function PauseScreen({ profile, onResume }: PauseScreenProps) {
  const response = generateAIResponse({
    motivationStyle: profile.motivationStyle,
    neuroProfile: profile.neuroProfile,
    context: 'pause',
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-xl w-full p-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="size-20 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Coffee className="size-10 text-blue-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Taking a break</h2>
          <p className="text-lg text-muted-foreground">{response.message}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Heart className="size-4" />
          <span>Your progress is saved</span>
        </div>

        <Button onClick={onResume} size="lg" className="w-full">
          Ready to continue
        </Button>
      </Card>
    </div>
  );
}
