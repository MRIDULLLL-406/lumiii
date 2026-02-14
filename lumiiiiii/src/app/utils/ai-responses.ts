import type { AIResponse, MotivationStyle, NeuroProfile } from '../types';

interface AIResponseOptions {
  motivationStyle: MotivationStyle;
  neuroProfile: NeuroProfile;
  context: 'stuck' | 'overwhelmed' | 'starting' | 'completing' | 're-entry' | 'pause';
}

export function generateAIResponse(options: AIResponseOptions): AIResponse {
  const { motivationStyle, context } = options;

  const responses: Record<string, Record<MotivationStyle, AIResponse>> = {
    stuck: {
      calm: {
        message: "It's okay to pause here. Sometimes our brains need a different approach.",
        tone: 'calming',
        suggestions: [
          'Break this into even smaller steps',
          'Take a 2-minute movement break',
          'Try the task at a different time',
        ],
        simplifiedVersion: "Let's try something different.",
      },
      friendly: {
        message: "Hey, I notice you've been here a bit. Want some help figuring out what's in the way?",
        tone: 'supportive',
        suggestions: [
          'Tell me what feels hard about this',
          'Skip this part and come back later',
          'Get a smaller version of this step',
        ],
        simplifiedVersion: "Stuck? Let's find a way through.",
      },
      direct: {
        message: "You're stuck. Let's solve it.",
        tone: 'practical',
        suggestions: [
          'Break down this step',
          'Skip and continue',
          'Change the approach',
        ],
        simplifiedVersion: "Stuck. What next?",
      },
    },
    overwhelmed: {
      calm: {
        message: "I'm noticing this might be feeling like a lot right now. You can stop, pause, or simplify.",
        tone: 'calming',
        suggestions: [
          'Save progress and take a real break',
          'Do just one tiny thing, then stop',
          'Switch to a lower-energy task',
        ],
        simplifiedVersion: "Feeling overwhelmed? Let's pause.",
      },
      friendly: {
        message: "Whoa, this seems like it's getting heavy. Let's dial it back a bit, yeah?",
        tone: 'supportive',
        suggestions: [
          'Take a breather - it\'s totally okay',
          'Do one small thing, celebrate, done',
          'Switch to something easier',
        ],
        simplifiedVersion: "Too much? Let's make it easier.",
      },
      direct: {
        message: "Overwhelm detected. Reduce load now.",
        tone: 'practical',
        suggestions: [
          'Pause and return later',
          'Complete one micro-step only',
          'Stop for today',
        ],
        simplifiedVersion: "Overwhelm. Pause or simplify.",
      },
    },
    starting: {
      calm: {
        message: "You're here. That's the hardest part. Let's take just one tiny step together.",
        tone: 'encouraging',
        suggestions: [],
        simplifiedVersion: "You're here. That counts.",
      },
      friendly: {
        message: "You showed up! That's already a win. Ready for the smallest possible first move?",
        tone: 'encouraging',
        suggestions: [],
        simplifiedVersion: "You're here! Let's start small.",
      },
      direct: {
        message: "Starting is the hard part. You're doing it. First step now.",
        tone: 'encouraging',
        suggestions: [],
        simplifiedVersion: "Starting now.",
      },
    },
    completing: {
      calm: {
        message: "You did it. Notice how that feels—you moved through something hard.",
        tone: 'supportive',
        suggestions: [],
        simplifiedVersion: "Done. You did it.",
      },
      friendly: {
        message: "Yes! You actually did the thing! That's worth celebrating, for real.",
        tone: 'encouraging',
        suggestions: [],
        simplifiedVersion: "Done! Nice work!",
      },
      direct: {
        message: "Task complete. Well done.",
        tone: 'practical',
        suggestions: [],
        simplifiedVersion: "Complete.",
      },
    },
    're-entry': {
      calm: {
        message: "Welcome back. There's no guilt here—breaks are part of the process. Ready to ease back in?",
        tone: 'supportive',
        suggestions: [
          'Quick recap of where you left off',
          'Start with something very small',
          'Choose a lower-energy task first',
        ],
        simplifiedVersion: "Welcome back. No guilt.",
      },
      friendly: {
        message: "Hey again! So glad you're back. Let's make re-entry super gentle, okay?",
        tone: 'supportive',
        suggestions: [
          'See what you were working on',
          'Pick the easiest next bit',
          'Warm up with something small',
        ],
        simplifiedVersion: "Welcome back! Let's ease in.",
      },
      direct: {
        message: "Back to work. No judgment. Continue where you left off.",
        tone: 'practical',
        suggestions: [
          'Resume previous task',
          'Start new task',
          'Review progress',
        ],
        simplifiedVersion: "Continuing.",
      },
    },
    pause: {
      calm: {
        message: "Taking a pause is wise. Your brain knows what it needs.",
        tone: 'supportive',
        suggestions: [],
        simplifiedVersion: "Pausing is good.",
      },
      friendly: {
        message: "Break time! You're listening to yourself, and that's awesome.",
        tone: 'supportive',
        suggestions: [],
        simplifiedVersion: "Break time!",
      },
      direct: {
        message: "Pause registered. Return when ready.",
        tone: 'practical',
        suggestions: [],
        simplifiedVersion: "Paused.",
      },
    },
  };

  return responses[context][motivationStyle];
}

export function generateStuckHelp(stepDescription: string, neuroProfile: NeuroProfile): string[] {
  const helpers = [
    `Break "${stepDescription}" into even smaller actions`,
    `Change location or time for this step`,
    `Do the easiest 10% of this step, then stop`,
    `Get body movement first, then try again`,
    `Use a timer: just 2 minutes on this`,
    `Ask: what's the actual hard part here?`,
  ];

  if (neuroProfile === 'adhd') {
    helpers.push(
      `Set a 5-minute sprint timer`,
      `Add background music or sound`,
      `Make it a game or race against yourself`
    );
  }

  if (neuroProfile === 'autism') {
    helpers.push(
      `Write down each micro-step visually`,
      `Create a clear checklist format`,
      `Remove sensory distractions first`
    );
  }

  return helpers.slice(0, 4); // Return top 4 suggestions
}

export function generateJustStartTasks(): { title: string; steps: string[]; minutes: number }[] {
  return [
    {
      title: 'Open the file',
      steps: ['Find the file location', 'Double-click to open'],
      minutes: 2,
    },
    {
      title: 'Write one sentence',
      steps: ['Open document', 'Write any sentence at all', 'Done'],
      minutes: 3,
    },
    {
      title: 'Set up workspace',
      steps: ['Clear desk surface', 'Place one needed item in front of you', 'Done'],
      minutes: 2,
    },
    {
      title: 'Read first paragraph',
      steps: ['Open document', 'Read only the first paragraph', 'Close document'],
      minutes: 3,
    },
    {
      title: 'List three small steps',
      steps: ['Open notes', 'Write three tiny steps for your task', 'Pick the easiest one'],
      minutes: 4,
    },
    {
      title: 'Gather materials',
      steps: ['List what you need', 'Put items in one place', 'Done'],
      minutes: 3,
    },
    {
      title: 'Set a timer',
      steps: ['Decide on 5 or 10 minutes', 'Start timer', 'Begin anything'],
      minutes: 1,
    },
    {
      title: 'Delete one thing',
      steps: ['Open document', 'Delete one sentence or item', 'Save and close'],
      minutes: 2,
    },
  ];
}

export function breakDownTask(taskTitle: string): string[] {
  // Simple task breakdown logic
  const steps: string[] = [];
  
  if (taskTitle.toLowerCase().includes('email') || taskTitle.toLowerCase().includes('message')) {
    steps.push(
      'Open email/messaging app',
      'Click compose or new message',
      'Type the recipient name',
      'Write one sentence of what you want to say',
      'Review and send'
    );
  } else if (taskTitle.toLowerCase().includes('clean') || taskTitle.toLowerCase().includes('tidy')) {
    steps.push(
      'Set a 10-minute timer',
      'Pick up 5 items and put them away',
      'Wipe one surface',
      'Take out any trash',
      'Stop when timer ends'
    );
  } else if (taskTitle.toLowerCase().includes('call') || taskTitle.toLowerCase().includes('phone')) {
    steps.push(
      'Write down 3 points you want to cover',
      'Find the phone number',
      'Take a breath',
      'Press call',
      'Say hello and first point'
    );
  } else if (taskTitle.toLowerCase().includes('write') || taskTitle.toLowerCase().includes('draft')) {
    steps.push(
      'Open document',
      'Write a terrible first sentence (seriously, make it bad)',
      'Write 2-3 more sentences without editing',
      'Read what you wrote',
      'Fix one thing if you want to'
    );
  } else {
    // Generic breakdown
    steps.push(
      'Decide on the very first physical action',
      'Do that one action only',
      'Decide on the next tiny action',
      'Do that action',
      'Continue one action at a time'
    );
  }

  return steps;
}