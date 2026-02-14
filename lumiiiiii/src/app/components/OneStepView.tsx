import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  VolumeX,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Task, TaskStep, UserProfile, Session } from '../types';
import { generateAIResponse } from '../utils/ai-responses';
import { extractSearchQuery } from '../utils/image-helper';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OneStepViewProps {
  task: Task;
  session: Session;
  profile: UserProfile;
  onStepComplete: () => void;
  onTaskComplete: () => void;
  onStepBack: () => void;
  onStuck: () => void;
  onPause: () => void;
}

export function OneStepView({
  task,
  session,
  profile,
  onStepComplete,
  onTaskComplete,
  onStepBack,
  onStuck,
  onPause,
}: OneStepViewProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [showSimplified, setShowSimplified] = useState(false);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [showStuckPrompt, setShowStuckPrompt] = useState(false);
  const [focusModeEnabled, setFocusModeEnabled] = useState(profile.preferences.focusBubbleDefault);
  const [stepImage, setStepImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const currentStep = task.steps[session.currentStepIndex];
  const isLastStep = session.currentStepIndex === task.steps.length - 1;
  const isFirstStep = session.currentStepIndex === 0;
  const completedSteps = task.steps.filter(s => s.isComplete).length;
  const progress = (completedSteps / task.steps.length) * 100;
  const showImageForADHD = profile.neuroProfile === 'adhd' || profile.neuroProfile === 'multiple';

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setIdleSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect stuck (2 minutes of idle)
  useEffect(() => {
    if (idleSeconds >= 120 && !showStuckPrompt) {
      setShowStuckPrompt(true);
    }
  }, [idleSeconds]);

  // Session time limit check
  useEffect(() => {
    const limitMinutes = profile.preferences.sessionLimitMinutes;
    if (elapsedSeconds >= limitMinutes * 60) {
      // Auto-pause when session limit reached
      if (window.confirm(`You've been working for ${limitMinutes} minutes. Time for a break?`)) {
        onPause();
      }
    }
  }, [elapsedSeconds, profile.preferences.sessionLimitMinutes, onPause]);

  // Reset idle on interaction
  const resetIdle = () => {
    setIdleSeconds(0);
    setShowStuckPrompt(false);
  };

  const speakText = (text: string) => {
    if (!profile.preferences.voiceEnabled) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsVoicePlaying(true);
      utterance.onend = () => setIsVoicePlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsVoicePlaying(false);
    }
  };

  const handleComplete = () => {
    resetIdle();
    if (isLastStep) {
      onTaskComplete();
    } else {
      onStepComplete();
    }
  };

  const handleStuck = () => {
    resetIdle();
    onStuck();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayText = showSimplified && currentStep.simplifiedDescription
    ? currentStep.simplifiedDescription
    : currentStep.description;

  const lowSensory = profile.preferences.lowSensoryMode;

  // Fetch image for ADHD users when step changes
  useEffect(() => {
    if (!showImageForADHD) {
      setStepImage(null);
      return;
    }

    const fetchStepImage = async () => {
      setLoadingImage(true);
      try {
        // Extract key concepts from the step description for better image search
        const searchQuery = extractSearchQuery(currentStep.description);
        
        // Using Unsplash's public API with Source endpoint (no auth required for basic use)
        // This provides a simple way to get relevant images
        const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(searchQuery)}`;
        setStepImage(imageUrl);
      } catch (error) {
        console.error('Failed to load image:', error);
        setStepImage(null);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchStepImage();
  }, [currentStep.id, showImageForADHD, currentStep.description]);

  return (
    <div className="relative">
      {/* Focus bubble overlay */}
      <AnimatePresence>
        {focusModeEnabled && (
          <motion.div
            initial={lowSensory ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={focusModeEnabled ? 'relative z-50' : ''}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={lowSensory ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full space-y-6"
          >
            {/* Progress header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Step {session.currentStepIndex + 1} of {task.steps.length}</span>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Energy badge */}
            <div className="flex justify-center">
              <Badge variant={task.energyLevel === 'low' ? 'secondary' : task.energyLevel === 'medium' ? 'default' : 'destructive'}>
                {task.energyLevel} energy
              </Badge>
            </div>

            {/* Main step card */}
            <Card className="p-12">
              <div className="space-y-8">
                <div className="text-center space-y-6">
                  <motion.div
                    key={currentStep.id}
                    initial={lowSensory ? {} : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl font-bold leading-tight">
                      {displayText}
                    </h2>

                    {currentStep.voiceGuidance && (
                      <p className="text-lg text-muted-foreground">
                        {currentStep.voiceGuidance}
                      </p>
                    )}
                  </motion.div>

                  {currentStep.simplifiedDescription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSimplified(!showSimplified)}
                    >
                      {showSimplified ? 'Show detailed' : 'Simplify'}
                    </Button>
                  )}
                </div>

                {/* Visual image for ADHD users */}
                {showImageForADHD && stepImage && (
                  <motion.div
                    initial={lowSensory ? {} : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg overflow-hidden"
                  >
                    <ImageWithFallback
                      src={stepImage}
                      alt={`Visual representation of: ${displayText}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      <Sparkles className="inline size-3 mr-1" />
                      Visual aid to help you focus
                    </p>
                  </motion.div>
                )}

                {showImageForADHD && loadingImage && (
                  <div className="flex justify-center items-center h-48 bg-muted/50 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground">Loading visual...</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full text-lg py-6"
                    onClick={handleComplete}
                  >
                    <CheckCircle2 className="size-5 mr-2" />
                    {isLastStep ? 'Complete task' : 'Done with this step'}
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    {!isFirstStep && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={onStepBack}
                      >
                        <ChevronLeft className="size-5 mr-2" />
                        Back
                      </Button>
                    )}

                    {profile.preferences.voiceEnabled && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          if (isVoicePlaying) {
                            stopSpeaking();
                          } else {
                            speakText(displayText);
                          }
                        }}
                        className={isFirstStep ? 'col-span-2' : ''}
                      >
                        {isVoicePlaying ? (
                          <>
                            <VolumeX className="size-5 mr-2" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="size-5 mr-2" />
                            Read aloud
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleStuck}
                      className={!profile.preferences.voiceEnabled && isFirstStep ? 'col-span-2' : profile.preferences.voiceEnabled || !isFirstStep ? '' : 'col-span-2'}
                    >
                      <HelpCircle className="size-5 mr-2" />
                      I'm stuck
                    </Button>

                    {!profile.preferences.voiceEnabled && !isFirstStep && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={onPause}
                      >
                        <Pause className="size-5 mr-2" />
                        Pause
                      </Button>
                    )}

                    {!profile.preferences.voiceEnabled && isFirstStep && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={onPause}
                      >
                        <Pause className="size-5 mr-2" />
                        Pause
                      </Button>
                    )}
                  </div>

                  {profile.preferences.voiceEnabled && (
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={onPause}
                    >
                      <Pause className="size-5 mr-2" />
                      Pause
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Stuck prompt */}
            <AnimatePresence>
              {showStuckPrompt && (
                <motion.div
                  initial={lowSensory ? {} : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-4">
                      <HelpCircle className="size-6 text-amber-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                            {generateAIResponse({
                              motivationStyle: profile.motivationStyle,
                              neuroProfile: profile.neuroProfile,
                              context: 'stuck',
                            }).message}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleStuck}
                            className="bg-white dark:bg-gray-800"
                          >
                            Get help
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowStuckPrompt(false)}
                          >
                            I'm okay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Focus mode toggle */}
      <Button
        onClick={() => setFocusModeEnabled(!focusModeEnabled)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        {focusModeEnabled ? (
          <>
            <Eye className="size-4 mr-2" />
            Exit focus
          </>
        ) : (
          <>
            <EyeOff className="size-4 mr-2" />
            Focus mode
          </>
        )}
      </Button>
    </div>
  );
}