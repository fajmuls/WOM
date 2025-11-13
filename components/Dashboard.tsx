import React from 'react';
import { View, TimerTemplate, DailyLog, WorkoutSchedule, Workout, WorkoutPlan } from '../types';
import Timer from './Timer';
import i18n from '../i18n';
import { DumbbellIcon } from './icons';

interface DashboardProps {
  navigate: (view: View) => void;
  templates: TimerTemplate[];
  startTemplateTimer: (template: TimerTemplate) => void;
  startQuickTimer: (minutes: number, seconds: number) => void;
  isTimerActive: boolean;
  dailyLogs: DailyLog;
  schedules: WorkoutSchedule[];
  workouts: Workout[];
  plans: WorkoutPlan[];
}

const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const Dashboard: React.FC<DashboardProps> = ({ 
    navigate, 
    templates, 
    startTemplateTimer, 
    startQuickTimer, 
    isTimerActive,
    dailyLogs,
    schedules,
    workouts,
    plans
}) => {
  const t = i18n.t.bind(i18n);

  // Today's workout logic
  const today = new Date();
  const todayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const todaysSchedule = schedules.find(s => s.day === todayName);
  const workoutName = todaysSchedule 
    ? (todaysSchedule.type === 'plan' 
        ? plans.find(p => p.id === todaysSchedule.refId)?.name 
        : workouts.find(w => w.id === todaysSchedule.refId)?.name) || todaysSchedule.name
    : null;

  // Weekly stats logic
  const weekStart = getWeekStartDate(new Date());
  weekStart.setHours(0, 0, 0, 0);
  let workoutCount = 0;
  let totalVolume = 0;

  Object.keys(dailyLogs).forEach((dateStr) => {
      const logs = dailyLogs[dateStr];
      const logDate = new Date(dateStr + 'T00:00:00');
      if (logDate >= weekStart && logDate <= today) {
          if (logs.length > 0) workoutCount++;
          logs.forEach(entry => {
              entry.sets.forEach(set => {
                  totalVolume += (set.reps || 0) * (set.weight || 0);
              });
          });
      }
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-base">{t('dashboard.title')}</h1>
        <p className="text-text-muted">Let's get stronger today.</p>
      </header>
      
      <div className="bg-surface-raised rounded-2xl p-5">
        <h2 className="font-bold text-lg mb-3">{t('dashboard.todaysWorkout')}</h2>
        {workoutName ? (
            <div className="bg-brand-900/50 border border-brand-700 rounded-lg p-4 flex justify-between items-center">
                <div>
                    <p className="font-semibold text-brand-300">{workoutName}</p>
                    <p className="text-sm text-brand-400">{todaysSchedule?.time}</p>
                </div>
                <button 
                    onClick={() => navigate('daily_log')}
                    className="bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-500 transition-colors border-2 border-brand-700 hover:border-brand-500"
                >
                    {t('timer.start')}
                </button>
            </div>
        ) : (
            <div className="text-center py-4 px-2 bg-surface-inset rounded-lg">
                <p className="text-text-muted text-sm">{t('dashboard.noWorkoutScheduled')}</p>
                 <button 
                    onClick={() => navigate('daily_log')}
                    className="mt-3 bg-brand-600/50 text-brand-300 font-semibold px-4 py-2 rounded-lg hover:bg-brand-600/80 transition-colors text-sm border-2 border-brand-700 hover:border-brand-600"
                >
                    {t('dashboard.startEmptyWorkout')}
                </button>
            </div>
        )}
      </div>

      <div className="bg-surface-raised rounded-2xl p-5">
        <h2 className="font-bold text-lg mb-3">{t('dashboard.weeklySummary')}</h2>
        <div className="flex gap-4">
            <div className="flex-1 bg-surface-inset p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-brand-400">{workoutCount}</p>
                <p className="text-xs text-text-muted uppercase tracking-wider">{t('dashboard.workouts')}</p>
            </div>
            <div className="flex-1 bg-surface-inset p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-brand-400">{totalVolume.toLocaleString()}</p>
                <p className="text-xs text-text-muted uppercase tracking-wider">{t('dashboard.volume')} (kg)</p>
            </div>
        </div>
      </div>

       <div className="-mt-2">
         {!isTimerActive && (
          <Timer 
            templates={templates}
            onStartTemplate={startTemplateTimer}
            onStartQuickTimer={startQuickTimer}
          />
         )}
      </div>
    </div>
  );
};

export default Dashboard;