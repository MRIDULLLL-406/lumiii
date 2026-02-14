import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { HelpCircle, Lightbulb, SkipForward, Clock } from 'lucide-react';
import type { Task, UserProfile } from '../types';
import { generateStuckHelp, generateAIResponse } from '../utils/ai-responses';

interface StuckHelpProps {
  task: Task;
  currentStepIndex: number;
  profile: UserProfile;
  onSimplify: () => void;
  onSkip: () => void;
  onBreak: () => void;
  onBack: () => void;
}

export function StuckHelp({
  task,
  currentStepIndex,
  profile,
  onSimplify,
  onSkip,
  onBreak,
  onBack,
}: StuckHelpProps) {
  const currentStep = task.steps[currentStepIndex];
  const suggestions = generateStuckHelp(currentStep.description, profile.neuroProfile);
  const aiResponse = generateAIResponse({
    motivationStyle: profile.motivationStyle,
    neuroProfile: profile.neuroProfile,
    context: 'stuck',
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <HelpCircle className="size-8 text-primary" />
            <h1 className="text-3xl font-semibold">Let's figure this out</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {aiResponse.message}
          </p>
        </div>

        {/* Current step context */}
        <Card className="p-4 bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">You're working on:</p>
          <p className="font-medium">{currentStep.description}</p>
        </Card>

        {/* Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="size-4" />
            <span>Try one of these:</span>
          </div>

          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-background"
              >
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={onSimplify}
            variant="default"
            size="lg"
            className="w-full justify-start"
          >
            <Lightbulb className="size-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Simplify this step</div>
              <div className="text-xs opacity-80">Make it even smaller</div>
            </div>
          </Button>

          <Button
            onClick={onSkip}
            variant="outline"
            size="lg"
            className="w-full justify-start"
          >
            <SkipForward className="size-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Skip and come back later</div>
              <div className="text-xs opacity-80">Move to the next step</div>
            </div>
          </Button>

          <Button
            onClick={onBreak}
            variant="outline"
            size="lg"
            className="w-full justify-start"
          >
            <Clock className="size-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Take a real break</div>
              <div className="text-xs opacity-80">Pause and return anytime</div>
            </div>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={onBack} variant="ghost" className="w-full">
            Back to current step
          </Button>
        </div>
      </Card>
    </div>
  );
}
