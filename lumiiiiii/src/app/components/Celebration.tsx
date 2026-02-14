import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { Sparkles, Star, Heart, CheckCircle2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { useState } from 'react';
import type { UserProfile } from '../types';
import { generateAIResponse } from '../utils/ai-responses';

interface CelebrationProps {
  profile: UserProfile;
  isTaskComplete: boolean;
  onContinue: () => void;
  onRateEase?: (rating: number) => void;
}

export function Celebration({ profile, isTaskComplete, onContinue, onRateEase }: CelebrationProps) {
  const [easeRating, setEaseRating] = useState<number>(3);
  const [hasRated, setHasRated] = useState(false);

  const response = generateAIResponse({
    motivationStyle: profile.motivationStyle,
    neuroProfile: profile.neuroProfile,
    context: 'completing',
  });

  const handleContinue = () => {
    if (isTaskComplete && onRateEase && !hasRated) {
      onRateEase(easeRating);
      setHasRated(true);
    }
    onContinue();
  };

  const lowSensory = profile.preferences.lowSensoryMode;
  const celebrationStyle = profile.preferences.celebrationStyle;

  if (celebrationStyle === 'none') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-8 text-green-600" />
            <h2 className="text-2xl font-semibold">Done</h2>
          </div>
          <Button onClick={handleContinue} size="lg" className="w-full">
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  const icons = celebrationStyle === 'enthusiastic' 
    ? [Sparkles, Star, Heart, CheckCircle2]
    : [CheckCircle2];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={lowSensory ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-12 space-y-8 text-center relative overflow-hidden">
          {/* Background animations */}
          {celebrationStyle === 'enthusiastic' && !lowSensory && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 0.6,
                    scale: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    opacity: 0,
                    scale: 1.5,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  {icons[Math.floor(Math.random() * icons.length)]({
                    className: 'size-6 text-primary',
                  })}
                </motion.div>
              ))}
            </div>
          )}

          {/* Content */}
          <motion.div
            initial={lowSensory ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 space-y-6"
          >
            {celebrationStyle !== 'subtle' && (
              <div className="flex justify-center">
                <motion.div
                  initial={lowSensory ? {} : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3,
                  }}
                  className="size-20 bg-green-500/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="size-10 text-green-600" />
                </motion.div>
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-4xl font-bold">
                {isTaskComplete ? 'Task Complete!' : 'Step Complete!'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {response.message}
              </p>
            </div>

            {isTaskComplete && onRateEase && (
              <div className="space-y-4 pt-4">
                <Label className="text-base">How did this feel?</Label>
                <div className="space-y-2">
                  <Slider
                    value={[easeRating]}
                    onValueChange={([value]) => setEaseRating(value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground px-1">
                    <span>Very hard</span>
                    <span>Neutral</span>
                    <span>Very easy</span>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleContinue} size="lg" className="w-full">
              {isTaskComplete ? 'Back to dashboard' : 'Next step'}
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
