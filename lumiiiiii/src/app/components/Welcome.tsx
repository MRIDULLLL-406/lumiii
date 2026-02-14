import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, Zap, Battery } from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="size-10 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold">Lumiii</h1>
          <p className="text-2xl text-muted-foreground">
            A task assistant for neurodivergent brains
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 py-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="size-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Battery className="size-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-semibold">No Shame</h3>
            <p className="text-sm text-muted-foreground">Stuck? Overwhelmed? It's okay. We'll adapt.</p>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="size-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Zap className="size-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold">Just Start</h3>
            <p className="text-sm text-muted-foreground">2-5 minute tasks to break through paralysis.</p>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="size-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Sparkles className="size-6 text-purple-600" />
              </div>
            </div>
            <h3 className="font-semibold">Lumiii Steps</h3>
            <p className="text-sm text-muted-foreground">Only see what's next. Nothing else.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onGetStarted} className="w-full" size="lg">
            Set up your experience
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Everything stays on your device. Private and safe.
          </p>
        </div>
      </Card>
    </div>
  );
}