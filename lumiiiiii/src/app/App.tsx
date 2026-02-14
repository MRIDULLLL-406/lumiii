import { useState, useEffect } from "react";
import { Welcome } from "./components/Welcome";
import { ProfileSetup } from "./components/ProfileSetup";
import { Dashboard } from "./components/Dashboard";
import { TaskCreator } from "./components/TaskCreator";
import { OneStepView } from "./components/OneStepView";
import { Celebration } from "./components/Celebration";
import { StuckHelp } from "./components/StuckHelp";
import { Settings } from "./components/Settings";
import type {
  UserProfile,
  Task,
  Session,
  MicroWin,
} from "./types";
import {
  getUserProfile,
  saveUserProfile,
  getTasks,
  saveTasks,
  getSessions,
  saveSessions,
  getMicroWins,
  saveMicroWins,
  clearAllData,
} from "./utils/storage";

type AppState =
  | "welcome"
  | "profile-setup"
  | "dashboard"
  | "task-creator"
  | "working"
  | "celebration"
  | "stuck-help"
  | "settings";

export default function App() {
  const [state, setState] = useState<AppState>("welcome");
  const [profile, setProfile] = useState<UserProfile | null>(
    null,
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(
    null,
  );
  const [currentSession, setCurrentSession] =
    useState<Session | null>(null);
  const [microWins, setMicroWins] = useState<MicroWin[]>([]);
  const [showingCelebration, setShowingCelebration] =
    useState(false);
  const [isTaskComplete, setIsTaskComplete] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedProfile = getUserProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
      setState("dashboard");
      setTasks(getTasks());
      setMicroWins(getMicroWins());
    }
  }, []);

  // Apply dyslexia font
  useEffect(() => {
    if (profile?.preferences.dyslexiaFont) {
      document.body.style.fontFamily =
        'OpenDyslexic, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    } else {
      document.body.style.fontFamily = "";
    }
  }, [profile?.preferences.dyslexiaFont]);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
    setState("dashboard");
  };

  const handleCreateTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    // Create session
    const session: Session = {
      id: crypto.randomUUID(),
      taskId: task.id,
      startedAt: new Date(),
      currentStepIndex: 0,
      pauses: [],
      emotionCheckins: [],
      overwhelmDetections: 0,
      elapsedMinutes: 0,
    };
    setCurrentTask(task);
    setCurrentSession(session);
    setState("working");

    // Add micro-win for starting
    addMicroWin("just-started", task.id);
  };

  const handleResumeTask = (task: Task) => {
    const sessions = getSessions();
    const existingSession = sessions.find(
      (s) => s.taskId === task.id && !s.endedAt,
    );

    let session: Session;
    if (existingSession) {
      session = existingSession;
    } else {
      const lastCompletedStep = task.steps.findLastIndex(
        (s) => s.isComplete,
      );
      session = {
        id: crypto.randomUUID(),
        taskId: task.id,
        startedAt: new Date(),
        currentStepIndex: lastCompletedStep + 1,
        pauses: [],
        emotionCheckins: [],
        overwhelmDetections: 0,
        elapsedMinutes: 0,
      };
    }

    setCurrentTask(task);
    setCurrentSession(session);
    setState("working");

    // Add micro-win for returning
    addMicroWin("returned-after-break", task.id);
  };

  const addMicroWin = (
    type:
      | "step-complete"
      | "task-complete"
      | "just-started"
      | "returned-after-break"
      | "asked-for-help",
    taskId: string,
  ) => {
    const win: MicroWin = {
      id: crypto.randomUUID(),
      type,
      taskId,
      timestamp: new Date(),
      celebrated: false,
    };
    const updated = [...microWins, win];
    setMicroWins(updated);
    saveMicroWins(updated);
  };

  const handleStepComplete = () => {
    if (!currentTask || !currentSession) return;

    // Mark step complete
    const updatedTask = { ...currentTask };
    updatedTask.steps[
      currentSession.currentStepIndex
    ].isComplete = true;
    updatedTask.steps[
      currentSession.currentStepIndex
    ].completedAt = new Date();

    // Update session
    const updatedSession = {
      ...currentSession,
      currentStepIndex: currentSession.currentStepIndex + 1,
    };

    setCurrentTask(updatedTask);
    setCurrentSession(updatedSession);

    // Save
    const updatedTasks = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    // Add micro-win
    addMicroWin("step-complete", updatedTask.id);

    // Show celebration
    setIsTaskComplete(false);
    setShowingCelebration(true);
    setState("celebration");
  };

  const handleTaskComplete = () => {
    if (!currentTask || !currentSession) return;

    // Mark final step complete
    const updatedTask = { ...currentTask };
    updatedTask.steps[
      currentSession.currentStepIndex
    ].isComplete = true;
    updatedTask.steps[
      currentSession.currentStepIndex
    ].completedAt = new Date();
    updatedTask.completedAt = new Date();

    // End session
    const updatedSession = {
      ...currentSession,
      endedAt: new Date(),
    };

    // Save
    const updatedTasks = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    const sessions = getSessions();
    const updatedSessions = [...sessions, updatedSession];
    saveSessions(updatedSessions);

    setCurrentTask(updatedTask);
    setCurrentSession(null);

    // Add micro-win
    addMicroWin("task-complete", updatedTask.id);

    // Show celebration
    setIsTaskComplete(true);
    setShowingCelebration(true);
    setState("celebration");
  };

  const handleRateEase = (rating: number) => {
    if (!currentTask) return;
    const updatedTask = { ...currentTask, easeRating: rating };
    const updatedTasks = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setCurrentTask(updatedTask);
  };

  const handleStuck = () => {
    if (!currentTask) return;
    addMicroWin("asked-for-help", currentTask.id);

    // Increment stuck count
    const updatedTask = {
      ...currentTask,
      stuckCount: currentTask.stuckCount + 1,
    };
    const updatedTasks = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setCurrentTask(updatedTask);

    setState("stuck-help");
  };

  const handleSimplifyStep = () => {
    // In a real implementation, this would use AI to further break down the step
    // For now, just go back to working
    setState("working");
  };

  const handleSkipStep = () => {
    if (!currentTask || !currentSession) return;

    // Mark as skipped (not complete)
    const updatedSession = {
      ...currentSession,
      currentStepIndex: currentSession.currentStepIndex + 1,
    };

    setCurrentSession(updatedSession);
    setState("working");
  };

  const handleStepBack = () => {
    if (!currentTask || !currentSession) return;
    if (currentSession.currentStepIndex === 0) return; // Can't go back from first step

    // Go back to previous step
    const updatedSession = {
      ...currentSession,
      currentStepIndex: currentSession.currentStepIndex - 1,
    };

    setCurrentSession(updatedSession);
  };

  const handlePause = () => {
    if (!currentTask || !currentSession) return;

    // Add pause
    const updatedSession = {
      ...currentSession,
      pauses: [
        ...currentSession.pauses,
        {
          startedAt: new Date(),
          reason: "user" as const,
        },
      ],
    };

    // Save session
    const sessions = getSessions();
    const updatedSessions = sessions.map((s) =>
      s.id === updatedSession.id ? updatedSession : s,
    );
    saveSessions([
      ...updatedSessions.filter(
        (s) => s.id !== updatedSession.id,
      ),
      updatedSession,
    ]);

    setCurrentSession(null);
    setCurrentTask(null);
    setState("dashboard");
  };

  const handleContinueFromCelebration = () => {
    if (isTaskComplete) {
      setCurrentTask(null);
      setCurrentSession(null);
      setState("dashboard");
    } else {
      setState("working");
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  const handleClearData = () => {
    clearAllData();
    setProfile(null);
    setTasks([]);
    setMicroWins([]);
    setCurrentTask(null);
    setCurrentSession(null);
    setState("welcome");
  };

  const handleStartOver = () => {
    // Go back to welcome without clearing data
    setState("welcome");
  };

  if (state === "welcome") {
    return (
      <Welcome onGetStarted={() => setState("profile-setup")} />
    );
  }

  if (state === "profile-setup") {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  if (!profile) return null;

  if (state === "dashboard") {
    return (
      <Dashboard
        profile={profile}
        tasks={tasks}
        microWins={microWins}
        onNewTask={() => setState("task-creator")}
        onResumeTask={handleResumeTask}
        onSettings={() => setState("settings")}
        onStartOver={handleStartOver}
      />
    );
  }

  if (state === "task-creator") {
    return (
      <TaskCreator
        profile={profile}
        onCreateTask={handleCreateTask}
        onBack={() => setState("dashboard")}
      />
    );
  }

  if (state === "working" && currentTask && currentSession) {
    return (
      <OneStepView
        task={currentTask}
        session={currentSession}
        profile={profile}
        onStepComplete={handleStepComplete}
        onTaskComplete={handleTaskComplete}
        onStepBack={handleStepBack}
        onStuck={handleStuck}
        onPause={handlePause}
      />
    );
  }

  if (state === "celebration") {
    return (
      <Celebration
        profile={profile}
        isTaskComplete={isTaskComplete}
        onContinue={handleContinueFromCelebration}
        onRateEase={isTaskComplete ? handleRateEase : undefined}
      />
    );
  }

  if (state === "stuck-help" && currentTask && currentSession) {
    return (
      <StuckHelp
        task={currentTask}
        currentStepIndex={currentSession.currentStepIndex}
        profile={profile}
        onSimplify={handleSimplifyStep}
        onSkip={handleSkipStep}
        onBreak={handlePause}
        onBack={() => setState("working")}
      />
    );
  }

  if (state === "settings") {
    return (
      <Settings
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onClearData={handleClearData}
        onBack={() => setState("dashboard")}
      />
    );
  }

  return null;
}