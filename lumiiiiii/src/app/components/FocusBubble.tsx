import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusBubbleProps {
  enabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  lowSensoryMode: boolean;
}

export function FocusBubble({ enabled, onToggle, children, lowSensoryMode }: FocusBubbleProps) {
  return (
    <div className="relative">
      {/* Focus bubble overlay */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={lowSensoryMode ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      {/* Content (always on top) */}
      <div className={enabled ? 'relative z-50' : ''}>
        {children}
      </div>

      {/* Toggle button (fixed position) */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        {enabled ? (
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
