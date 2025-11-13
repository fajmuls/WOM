
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Workout, DailyLog, View, TimerTemplate, ActiveTimerState, AppSettings, SoundConfig, MusicState, WorkoutSchedule, WorkoutPlan, BodyMeasurement, LogEntry } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import ManageWorkouts from './components/ManageWorkouts';
import WorkoutJournal from './components/WorkoutJournal';
import ManageTimers from './components/ManageTimers';
import Settings from './components/Settings';
import GlobalTimerBar from './components/GlobalTimerBar';
import MusicPlayer from './components/MusicPlayer';
import BodyTracker from './components/BodyTracker';
import PostWorkoutSummary from './components/PostWorkoutSummary';
import i18n, { decompressPlan, decompressTemplate } from './i18n';
import BottomNavBar from './components/BottomNavBar';
import Dashboard from './components/Dashboard';
import ImportLinkModal from './components/ImportLinkModal';
import ImportDataModal from './components/ImportDataModal';
import SplashScreen from './components/SplashScreen';

type ImportState = {
  status: 'idle' | 'confirm' | 'loading' | 'success' | 'error';
  title?: string;
  message?: string;
  onConfirmAction?: () => void;
};


const initialWorkouts: Workout[] = [
    // Gym
    { id: 'gym-1', name: 'Bench Press', category: 'Gym' },
    { id: 'gym-2', name: 'Squat', category: 'Gym' },
    { id: 'gym-3', name: 'Deadlift', category: 'Gym' },
    { id: 'gym-4', name: 'Overhead Press', category: 'Gym' },
    { id: 'gym-5', name: 'Barbell Row', category: 'Gym' },
    { id: 'gym-6', name: 'Dumbbell Curl', category: 'Gym' },
    { id: 'gym-7', name: 'Tricep Pushdown', category: 'Gym' },
    { id: 'gym-8', name: 'Leg Press', category: 'Gym' },
    { id: 'gym-9', name: 'Lat Pulldown', category: 'Gym' },
    { id: 'gym-10', name: 'Calf Raises', category: 'Gym' },
    // Calisthenics
    { id: 'cal-1', name: 'Pull Ups', category: 'Calisthenics' },
    { id: 'cal-2', name: 'Push Ups', category: 'Calisthenics' },
    { id: 'cal-3', name: 'Dips', category: 'Calisthenics' },
    { id: 'cal-4', name: 'Chin Ups', category: 'Calisthenics' },
    { id: 'cal-5', name: 'Bodyweight Squats', category: 'Calisthenics' },
    { id: 'cal-6', name: 'Lunges', category: 'Calisthenics' },
    { id: 'cal-7', name: 'Plank', category: 'Calisthenics' },
    { id: 'cal-8', name: 'Crunches', category: 'Calisthenics' },
    { id: 'cal-9', name: 'Leg Raises', category: 'Calisthenics' },
    { id: 'cal-10', name: 'Burpees', category: 'Calisthenics' },
];

const initialTimerTemplates: TimerTemplate[] = [
    {
        id: 'preset-t1',
        name: 'HIIT Tabata (20/10 x8)',
        segments: Array.from({ length: 8 }).flatMap((_, i) => [
            { id: `s${i}-work`, name: `Work ${i + 1}`, type: 'work', duration: 0, workDuration: 20, sets: 1, restDuration: 10 },
        ]),
    },
    {
        id: 'preset-t2',
        name: 'Strength Training Rest',
        segments: [{ id: 's1', name: 'Rest', type: 'rest', duration: 180 }],
    },
    {
        id: 'preset-t3',
        name: '5-Min Cardio Warmup',
        segments: [{ id: 's1', name: 'Warmup', type: 'warmup', duration: 300, interval: 30 }],
    }
];

const defaultSettings: AppSettings = {
  volume: 0.5,
  theme: 'dark',
  language: 'en',
  sounds: {
    timerEnd: { frequency: 1200, duration: 1, type: 'sine' },
    segmentEnd: { frequency: 660, duration: 0.2, type: 'sine' },
    interval: { frequency: 440, duration: 0.1, type: 'triangle' },
    menuClick: { frequency: 800, endFrequency: 200, duration: 0.1, type: 'triangle', volumeMultiplier: 0.4 },
  }
};

const App: React.FC = () => {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', initialWorkouts);
  const [dailyLogs, setDailyLogs] = useLocalStorage<DailyLog>('dailyLogs', {});
  const [timerTemplates, setTimerTemplates] = useLocalStorage<TimerTemplate[]>('timerTemplates', initialTimerTemplates);
  const [musicState, setMusicState] = useLocalStorage<MusicState>('musicState', { playlist: [], activeItemId: null });
  const [schedules, setSchedules] = useLocalStorage<WorkoutSchedule[]>('workoutSchedules', []);
  const [workoutPlans, setWorkoutPlans] = useLocalStorage<WorkoutPlan[]>('workoutPlans', []);
  const [bodyMeasurements, setBodyMeasurements] = useLocalStorage<BodyMeasurement[]>('bodyMeasurements', []);
  const [workoutCategories, setWorkoutCategories] = useLocalStorage<string[]>('workoutCategories', ['Gym', 'Calisthenics']);
  const [settings, setSettings] = useLocalStorage<AppSettings>('workoutSettings', defaultSettings);
  
  const [view, setView] = useState<View>('dashboard');
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState | null>(null);
  const [completedWorkout, setCompletedWorkout] = useState<TimerTemplate | null>(null);
  const [isImportLinkModalOpen, setImportLinkModalOpen] = useState(false);
  const [importState, setImportState] = useState<ImportState>({status: 'idle'});
  const [showSplash, setShowSplash] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioUnlockedRef = useRef(false);
  const notificationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.remove('light-theme', 'faz-theme', 'aritheme');
    if (settings.theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (settings.theme === 'faztheme') {
        document.body.classList.add('faz-theme');
    } else if (settings.theme === 'aritheme') {
        document.body.classList.add('aritheme');
    }
  }, [settings.theme]);

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);

  const clearUrlHash = () => {
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  const processImportData = useCallback((data: string) => {
    try {
        const jsonString = decodeURIComponent(escape(atob(data)));
        const parsedData = JSON.parse(jsonString);

        if (!parsedData || !parsedData.type || !parsedData.data) {
             throw new Error(i18n.t('importModal.errorInvalidFormat'));
        }
        
        let decompressedItemData;
        if (parsedData.type === 'plan') {
            decompressedItemData = decompressPlan(parsedData.data);
        } else if (parsedData.type === 'template') {
            decompressedItemData = decompressTemplate(parsedData.data);
        } else {
            throw new Error(i18n.t('importModal.errorUnsupportedType'));
        }

        if (!decompressedItemData.name) {
            throw new Error(i18n.t('importModal.errorMissingName'));
        }

        const itemToConfirm = { type: parsedData.type, data: decompressedItemData };
        
        setImportState({
            status: 'confirm',
            title: i18n.t('importModal.title'),
            message: i18n.t('importModal.confirmation', { type: itemToConfirm.type, name: itemToConfirm.data.name }),
            onConfirmAction: () => handleConfirmLinkImport(itemToConfirm)
        });
        
    } catch (error) {
        console.error("Failed to parse import data:", error);
        setImportState({ 
            status: 'error', 
            title: i18n.t('importLinkModal.title'), 
            message: error instanceof Error ? error.message : i18n.t('importModal.error') 
        });
        clearUrlHash();
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#import=')) {
        const base64String = hash.substring(8); // Length of '#import='
        processImportData(base64String);
    }
  }, [processImportData]);

  const handleImportFromLink = (url: string) => {
      setImportLinkModalOpen(false);
      try {
          const hash = new URL(url).hash;
          if (hash.startsWith('#import=')) {
              const base64String = hash.substring(8);
              processImportData(base64String);
          } else {
              throw new Error(i18n.t('importModal.errorInvalidFormat'));
          }
      } catch (error) {
           setImportState({ 
            status: 'error', 
            title: i18n.t('importLinkModal.title'), 
            message: error instanceof Error ? error.message : i18n.t('importModal.error') 
        });
      }
  };

  const handleConfirmLinkImport = (itemToImport: {type: 'plan' | 'template', data: any}) => {
    if (itemToImport.type === 'plan') {
        const newPlan = { ...itemToImport.data, id: Date.now().toString() };
        if (workoutPlans.some(p => p.name === newPlan.name)) {
            newPlan.name = `${newPlan.name} (Imported)`;
        }
        setWorkoutPlans(prev => [...prev, newPlan]);
    } else if (itemToImport.type === 'template') {
        const newTemplate = { ...itemToImport.data, id: Date.now().toString() };
         if (timerTemplates.some(t => t.name === newTemplate.name)) {
            newTemplate.name = `${newTemplate.name} (Imported)`;
        }
        setTimerTemplates(prev => [...prev, newTemplate]);
    }

    setImportState({ status: 'success', title: i18n.t('importModal.title'), message: i18n.t('importModal.success') });
    clearUrlHash();
  };


  const handleFileSelectedForImport = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
             setImportState({
                status: 'confirm',
                title: i18n.t('importDataModal.title'),
                message: i18n.t('importDataModal.confirmMessage'),
                onConfirmAction: () => handleConfirmFileImport(text)
            });
        } else {
            setImportState({ status: 'error', title: i18n.t('importDataModal.title'), message: 'Failed to read the file.' });
        }
    };
    reader.onerror = () => {
        setImportState({ status: 'error', title: i18n.t('importDataModal.title'), message: 'Failed to read the file.' });
    };
    reader.readAsText(file);
  };

  const handleConfirmFileImport = (data: string) => {
    setImportState(prev => ({ ...prev, status: 'loading' }));

    setTimeout(() => {
      try {
        const importedData = JSON.parse(data);
        
        if (typeof importedData !== 'object' || importedData === null) {
          throw new Error(i18n.t('settings.data.importError'));
        }

        // Create a fully populated settings object to ensure backward compatibility
        const newSettings = {
          ...defaultSettings,
          ...(importedData.workoutSettings || {}),
          sounds: {
            ...defaultSettings.sounds,
            ...((importedData.workoutSettings || {}).sounds || {})
          }
        };

        setWorkouts(importedData.workouts ?? initialWorkouts);
        setDailyLogs(importedData.dailyLogs ?? {});
        setTimerTemplates(importedData.timerTemplates ?? initialTimerTemplates);
        setMusicState(importedData.musicState ?? { playlist: [], activeItemId: null });
        setSchedules(importedData.schedules ?? []);
        setWorkoutPlans(importedData.workoutPlans ?? []);
        setBodyMeasurements(importedData.bodyMeasurements ?? []);
        setWorkoutCategories(importedData.workoutCategories ?? ['Gym', 'Calisthenics']);
        setSettings(newSettings);

        setImportState({ status: 'success', title: i18n.t('importDataModal.title'), message: i18n.t('importDataModal.successMessage') });
      } catch (error) {
        console.error("Import failed:", error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        setImportState({ status: 'error', title: i18n.t('importDataModal.title'), message: errorMessage });
      }
    }, 500);
  };
  
  const handleCloseImportModal = () => {
    setImportState({ status: 'idle' });
  };


  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Could not create AudioContext:", e);
        }
    }
  }, []);
  
  const playSound = useCallback((soundConfig: SoundConfig) => {
      initializeAudio();
      if (!audioContextRef.current) return;
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const { frequency, endFrequency, duration, type, volumeMultiplier = 1.0 } = soundConfig;
      const now = audioContextRef.current.currentTime;
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.type = type;

      const effectiveVolume = settings.volume * volumeMultiplier;
      const startVolume = effectiveVolume > 0 ? effectiveVolume : 0.0001;
      
      gainNode.gain.setValueAtTime(startVolume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.frequency.setValueAtTime(frequency, now);
      if (endFrequency && endFrequency !== frequency) {
          oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
      }

      oscillator.start(now);
      oscillator.stop(now + duration);
  }, [settings.volume, initializeAudio]);
  
  const unlockAudioAndPlaySplashSound = useCallback(() => {
    if (!audioUnlockedRef.current) {
        audioUnlockedRef.current = true;
    }
  }, []);

  const navigate = (view: View) => {
    if(view !== 'music_player') { // Don't play sound for navigating to music, it's external
        playSound(settings.sounds.menuClick);
    }
    setView(view);
  };

  const scheduleNotifications = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
        if (notificationIntervalRef.current) {
            clearInterval(notificationIntervalRef.current);
        }

        notificationIntervalRef.current = window.setInterval(() => {
            const now = new Date();
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            schedules.forEach(schedule => {
                if (schedule.day === currentDay && schedule.time === currentTime) {
                    const workoutName = schedule.type === 'plan' 
                        ? workoutPlans.find(p => p.id === schedule.refId)?.name || schedule.name
                        : workouts.find(w => w.id === schedule.refId)?.name || schedule.name;

                    new Notification(i18n.t('notification.title'), {
                        body: i18n.t('notification.body', { workout: workoutName }),
                        icon: '/vite.svg'
                    });
                }
            });
        }, 60000); // Check every minute
    }
  }, [schedules, workoutPlans, workouts]);


  useEffect(() => {
      scheduleNotifications();
      return () => {
          if (notificationIntervalRef.current) {
              clearInterval(notificationIntervalRef.current);
          }
      };
  }, [scheduleNotifications]);


  useEffect(() => {
    if (!activeTimer?.isActive) {
        return;
    }

    const interval = setInterval(() => {
        setActiveTimer(currentTimer => {
            if (!currentTimer || !currentTimer.isActive) {
                return currentTimer;
            }

            if (currentTimer.type === 'quick') {
                const newTotalSeconds = (currentTimer.totalSeconds ?? 0) - 1;
                if (newTotalSeconds <= 0) {
                    playSound(settings.sounds.timerEnd);
                    return null;
                }
                return { ...currentTimer, totalSeconds: newTotalSeconds };
            }

            if (currentTimer.type === 'template' && currentTimer.flattenedSegments) {
                const newTimeInSegment = (currentTimer.timeInSegment ?? 0) - 1;
                const newTimeElapsed = (currentTimer.timeElapsed ?? 0) + 1;

                const currentFlattenedSegment = currentTimer.flattenedSegments[currentTimer.currentSegmentIndex ?? 0];
                if (currentFlattenedSegment.interval && currentFlattenedSegment.interval > 0 && newTimeInSegment > 0 && newTimeInSegment % currentFlattenedSegment.interval === 0) {
                    playSound(settings.sounds.interval);
                }

                if (newTimeInSegment > 0) {
                    return { ...currentTimer, timeInSegment: newTimeInSegment, timeElapsed: newTimeElapsed };
                }

                const nextSegmentIndex = (currentTimer.currentSegmentIndex ?? 0) + 1;
                if (nextSegmentIndex < currentTimer.flattenedSegments.length) {
                    playSound(settings.sounds.segmentEnd);
                    const nextSegment = currentTimer.flattenedSegments[nextSegmentIndex];
                    return {
                        ...currentTimer,
                        currentSegmentIndex: nextSegmentIndex,
                        timeInSegment: nextSegment.duration,
                        timeElapsed: newTimeElapsed,
                    };
                } else {
                    playSound(settings.sounds.timerEnd);
                    if (currentTimer.template) {
                        setCompletedWorkout(currentTimer.template);
                        setView('post_workout_summary');
                    }
                    return null;
                }
            }
            return currentTimer;
        });
    }, 1000);

    return () => clearInterval(interval);
}, [activeTimer?.isActive, playSound, settings.sounds, setCompletedWorkout, setView]);

    const handleStartTemplateTimer = (template: TimerTemplate) => {
        const flattenedSegments: any[] = [];
        template.segments.forEach((seg, segIndex) => {
            if (seg.type === 'work' && seg.sets && seg.workDuration) {
                for (let i = 0; i < seg.sets; i++) {
                    flattenedSegments.push({ 
                        name: seg.name, 
                        duration: seg.workDuration, 
                        workoutId: seg.workoutId,
                        isRest: false,
                        originalSegmentId: seg.id,
                        originalSegmentType: seg.type,
                        setNumber: i + 1,
                        totalSets: seg.sets,
                    });
                    if (i < seg.sets - 1 && seg.restDuration && seg.restDuration > 0) {
                        flattenedSegments.push({ 
                            name: i18n.t('manageTimers.summary.rest'), 
                            duration: seg.restDuration, 
                            isRest: true,
                            originalSegmentId: seg.id,
                            originalSegmentType: 'rest'
                        });
                    }
                }
            } else if (seg.duration > 0) {
                flattenedSegments.push({ 
                    name: seg.name, 
                    duration: seg.duration, 
                    isRest: seg.type === 'rest',
                    originalSegmentId: seg.id,
                    originalSegmentType: seg.type,
                    interval: seg.interval,
                });
            }

            // Add inter-segment rest if enabled and not the last segment
            if (template.restBetweenSegments?.enabled && template.restBetweenSegments.duration > 0 && segIndex < template.segments.length - 1) {
                flattenedSegments.push({
                    name: i18n.t('manageTimers.summary.rest'),
                    duration: template.restBetweenSegments.duration,
                    isRest: true,
                    originalSegmentId: `inter-segment-rest-${seg.id}`,
                    originalSegmentType: 'rest'
                });
            }
        });

        if (flattenedSegments.length === 0) return;
        initializeAudio();

        const totalDuration = flattenedSegments.reduce((acc, s) => acc + s.duration, 0);

        setActiveTimer({
            type: 'template',
            template,
            flattenedSegments,
            isActive: true,
            currentSegmentIndex: 0,
            timeInSegment: flattenedSegments[0].duration,
            timeElapsed: 0,
            totalDuration: totalDuration
        });
    };

  const handleStartQuickTimer = (minutes: number, seconds: number) => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 0) return;
    initializeAudio();
    setActiveTimer({
      type: 'quick',
      isActive: true,
      totalSeconds: totalSeconds,
      initialDuration: totalSeconds,
    });
  };

  const handlePauseResumeTimer = () => {
    if (!activeTimer) return;
    initializeAudio();
    setActiveTimer({ ...activeTimer, isActive: !activeTimer.isActive });
  };

  const handleStopTimer = () => {
    setActiveTimer(null);
  };
  
   const handleSavePostWorkoutLog = useCallback((logEntries: LogEntry[]) => {
      const today = new Date().toISOString().split('T')[0];
      setDailyLogs(prevLogs => {
          const newLogs = {...prevLogs};
          const todayLogs = newLogs[today] ? [...newLogs[today]] : [];

          logEntries.forEach(newEntry => {
            const existingEntryIndex = todayLogs.findIndex(e => e.workoutId === newEntry.workoutId);
            if(existingEntryIndex > -1) {
                const existingEntry = todayLogs[existingEntryIndex];
                const updatedEntry = {
                    ...existingEntry,
                    sets: [...existingEntry.sets, ...newEntry.sets]
                };
                todayLogs[existingEntryIndex] = updatedEntry;
            } else {
                todayLogs.push(newEntry);
            }
          });
          
          newLogs[today] = todayLogs;
          return newLogs;
      });
      setCompletedWorkout(null);
      navigate('daily_log');
   }, [setDailyLogs]);


  const renderView = () => {
    if (view === 'post_workout_summary' && completedWorkout) {
        return <PostWorkoutSummary 
            template={completedWorkout} 
            workouts={workouts} 
            onSave={handleSavePostWorkoutLog}
            onDiscard={() => {
                setCompletedWorkout(null);
                navigate('dashboard');
            }}
        />;
    }

    switch (view) {
      case 'manage_workouts':
        return <ManageWorkouts 
            workouts={workouts} 
            setWorkouts={setWorkouts} 
            plans={workoutPlans}
            setPlans={setWorkoutPlans}
            workoutCategories={workoutCategories}
            setWorkoutCategories={setWorkoutCategories}
            navigate={navigate} 
        />;
      case 'daily_log':
        return <WorkoutJournal 
          workouts={workouts} 
          dailyLogs={dailyLogs}
          setDailyLogs={setDailyLogs}
          workoutCategories={workoutCategories}
          navigate={navigate}
          playSound={playSound} 
        />;
       case 'manage_timers':
        return <ManageTimers 
            templates={timerTemplates} 
            setTemplates={setTimerTemplates}
            plans={workoutPlans}
            allWorkouts={workouts}
            navigate={navigate} 
        />;
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} navigate={navigate} playSound={playSound} onOpenImportLinkModal={() => setImportLinkModalOpen(true)} onFileSelected={handleFileSelectedForImport} defaultSettings={defaultSettings} />;
      case 'music_player':
        return <MusicPlayer musicState={musicState} setMusicState={setMusicState} navigate={navigate} />;
      // Body Tracker and Schedule are now accessed via Settings, so they don't need a main view
      case 'body_tracker':
        return <BodyTracker measurements={bodyMeasurements} setMeasurements={setBodyMeasurements} navigate={navigate} />;
      case 'dashboard':
      default:
        return (
          <Dashboard 
            navigate={navigate} 
            // FIX: Pass timerTemplates state variable to templates prop
            templates={timerTemplates}
            startTemplateTimer={handleStartTemplateTimer}
            startQuickTimer={handleStartQuickTimer}
            isTimerActive={!!activeTimer}
            dailyLogs={dailyLogs}
            schedules={schedules}
            workouts={workouts}
            // FIX: Pass workoutPlans state variable to plans prop
            plans={workoutPlans}
          />
        );
    }
  };

  return (
    <div className="min-h-screen font-sans" onClick={unlockAudioAndPlaySplashSound}>
      {showSplash && <SplashScreen />}
      {!showSplash && (
        <>
            {isImportLinkModalOpen && (
                <ImportLinkModal
                    onImport={handleImportFromLink}
                    onCancel={() => setImportLinkModalOpen(false)}
                />
            )}
            {importState.status !== 'idle' && (
                <ImportDataModal
                state={importState}
                onClose={handleCloseImportModal}
                />
            )}
            {activeTimer && (
                <GlobalTimerBar 
                timerState={activeTimer} 
                onPauseResume={handlePauseResumeTimer} 
                onStop={handleStopTimer} 
                />
            )}
            <main className="pb-24">
                <div key={view} className="animate-fade-in">
                {renderView()}
                </div>
            </main>
            <BottomNavBar currentView={view} navigate={navigate} />
        </>
      )}
    </div>
  );
};

export default App;