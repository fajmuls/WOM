

import React, { useState } from 'react';
import { DailyLog, View, Workout, SoundConfig } from '../types';
import i18n from '../i18n';
import WorkoutCalendar from './WorkoutCalendar';
import WorkoutSummary from './WorkoutSummary';
import WorkoutHistory from './WorkoutHistory';

type JournalTab = 'summary' | 'calendar' | 'history';

const WorkoutJournal: React.FC<{
  workouts: Workout[];
  dailyLogs: DailyLog;
  setDailyLogs: (logs: DailyLog) => void;
  workoutCategories: string[];
  navigate: (view: View) => void;
  playSound: (soundConfig: SoundConfig) => void;
}> = ({ workouts, dailyLogs, setDailyLogs, workoutCategories, navigate, playSound }) => {
  const [activeTab, setActiveTab] = useState<JournalTab>('calendar');
  const t = i18n.t.bind(i18n);

  const TabButton: React.FC<{tab: JournalTab, children: React.ReactNode}> = ({tab, children}) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2.5 text-sm font-semibold rounded-lg flex-grow text-center transition-colors border-2 ${activeTab === tab ? 'bg-brand-600 text-white border-brand-700' : 'bg-surface-inset text-text-muted hover:bg-border border-border'}`}
      >
          {children}
      </button>
  );

  return (
    <div className="p-4 md:p-6">
      <header className="flex items-center mb-6">
        <h2 className="text-3xl font-bold">{t('workoutJournal.title')}</h2>
      </header>

      <div className="flex gap-2 mb-6 p-1.5 bg-surface-inset rounded-xl sticky top-0 z-10 bg-opacity-80 backdrop-blur-sm">
        <TabButton tab="summary">{t('workoutJournal.tabs.summary')}</TabButton>
        <TabButton tab="calendar">{t('workoutJournal.tabs.calendar')}</TabButton>
        <TabButton tab="history">{t('workoutJournal.tabs.history')}</TabButton>
      </div>

      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'summary' && <WorkoutSummary dailyLogs={dailyLogs} workouts={workouts} />}
        {activeTab === 'calendar' && <WorkoutCalendar dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} workouts={workouts} workoutCategories={workoutCategories} playSound={playSound} />}
        {activeTab === 'history' && <WorkoutHistory dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} workouts={workouts} playSound={playSound} />}
      </div>
    </div>
  );
};

export default WorkoutJournal;