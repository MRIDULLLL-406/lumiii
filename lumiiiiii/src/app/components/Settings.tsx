import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Settings as SettingsIcon, Trash2 } from 'lucide-react';
import type { UserProfile, MotivationStyle } from '../types';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClearData: () => void;
  onBack: () => void;
}

export function Settings({ profile, onUpdateProfile, onClearData, onBack }: SettingsProps) {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    onUpdateProfile(localProfile);
    onBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="size-8 text-primary" />
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>

        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {/* Voice */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="text-base">Voice guidance</Label>
                <p className="text-sm text-muted-foreground">Steps read aloud to you</p>
              </div>
              <Switch
                checked={localProfile.preferences.voiceEnabled}
                onCheckedChange={(checked) =>
                  setLocalProfile({
                    ...localProfile,
                    preferences: { ...localProfile.preferences, voiceEnabled: checked },
                  })
                }
              />
            </div>
          </div>

          {/* Dyslexia font */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="text-base">Dyslexia-friendly font</Label>
                <p className="text-sm text-muted-foreground">Easier-to-read text</p>
              </div>
              <Switch
                checked={localProfile.preferences.dyslexiaFont}
                onCheckedChange={(checked) =>
                  setLocalProfile({
                    ...localProfile,
                    preferences: { ...localProfile.preferences, dyslexiaFont: checked },
                  })
                }
              />
            </div>
          </div>

          {/* Low sensory */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="text-base">Low sensory mode</Label>
                <p className="text-sm text-muted-foreground">Reduced animations and effects</p>
              </div>
              <Switch
                checked={localProfile.preferences.lowSensoryMode}
                onCheckedChange={(checked) =>
                  setLocalProfile({
                    ...localProfile,
                    preferences: { ...localProfile.preferences, lowSensoryMode: checked },
                  })
                }
              />
            </div>
          </div>

          {/* Focus bubble */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="text-base">Focus bubble by default</Label>
                <p className="text-sm text-muted-foreground">Hide distractions while working</p>
              </div>
              <Switch
                checked={localProfile.preferences.focusBubbleDefault}
                onCheckedChange={(checked) =>
                  setLocalProfile({
                    ...localProfile,
                    preferences: { ...localProfile.preferences, focusBubbleDefault: checked },
                  })
                }
              />
            </div>
          </div>

          {/* Motivation style */}
          <div className="space-y-3">
            <Label className="text-base">Motivation style</Label>
            <RadioGroup
              value={localProfile.motivationStyle}
              onValueChange={(value) =>
                setLocalProfile({ ...localProfile, motivationStyle: value as MotivationStyle })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="calm" id="calm-setting" />
                <Label htmlFor="calm-setting" className="cursor-pointer">Calm & Gentle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly-setting" />
                <Label htmlFor="friendly-setting" className="cursor-pointer">Friendly & Warm</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct-setting" />
                <Label htmlFor="direct-setting" className="cursor-pointer">Direct & Clear</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Celebration style */}
          <div className="space-y-3">
            <Label className="text-base">Celebration style</Label>
            <RadioGroup
              value={localProfile.preferences.celebrationStyle}
              onValueChange={(value) =>
                setLocalProfile({
                  ...localProfile,
                  preferences: { ...localProfile.preferences, celebrationStyle: value as any },
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none-setting" />
                <Label htmlFor="none-setting" className="cursor-pointer">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtle" id="subtle-setting" />
                <Label htmlFor="subtle-setting" className="cursor-pointer">Subtle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate-setting" />
                <Label htmlFor="moderate-setting" className="cursor-pointer">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enthusiastic" id="enthusiastic-setting" />
                <Label htmlFor="enthusiastic-setting" className="cursor-pointer">Enthusiastic</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Session limit */}
          <div className="space-y-3">
            <div>
              <Label className="text-base">Session time limit (minutes)</Label>
              <p className="text-sm text-muted-foreground">
                Auto-pause after this time to prevent burnout
              </p>
            </div>
            <div className="space-y-2">
              <Slider
                value={[localProfile.preferences.sessionLimitMinutes]}
                onValueChange={([value]) =>
                  setLocalProfile({
                    ...localProfile,
                    preferences: { ...localProfile.preferences, sessionLimitMinutes: value },
                  })
                }
                min={10}
                max={60}
                step={5}
              />
              <p className="text-center font-semibold">
                {localProfile.preferences.sessionLimitMinutes} minutes
              </p>
            </div>
          </div>

          {/* Danger zone */}
          <div className="pt-6 border-t space-y-3">
            <Label className="text-base text-destructive">Danger Zone</Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="size-4 mr-2" />
                  Clear all data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your profile, all tasks, and progress. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
