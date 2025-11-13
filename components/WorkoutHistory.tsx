
import React, { useState } from 'react';
import { DailyLog, LogEntry, Workout, WorkoutSet, SoundConfig } from '../types';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, DuplicateIcon, ClockIcon, TrashIcon } from './icons';
import i18n from '../i18n';
import SetTimerModal from './SetTimerModal';

// A self-contained item for displaying and editing a log entry, used within the history list.
const WorkoutLogItem: React.FC<{
    entry: LogEntry;
    workout: Workout | undefined;
    onUpdateEntry: (updatedEntry: LogEntry) => void;
    onDeleteEntry: (entryId: string) => void;
    playSound: (soundConfig: SoundConfig) => void;
}> = ({ entry, workout, onUpdateEntry, onDeleteEntry, playSound }) => {
    const t = i18n.t.bind(i18n);
    const [timerState, setTimerState] = useState<{isOpen: boolean, duration: number}>({isOpen: false, duration: 0});
    
    const addSet = () => {
        const lastSet = entry.sets[entry.sets.length - 1] || { reps: 8, weight: 0, time: 0 };
        const newSet: WorkoutSet = { id: Date.now().toString(), reps: lastSet.reps, weight: lastSet.weight, time: 0 };
        onUpdateEntry({ ...entry, sets: [...entry.sets, newSet] });
    };

    const updateSet = (setId: string, field: 'reps' | 'weight' | 'time', value: number) => {
        const updatedSets = entry.sets.map(s => s.id === setId ? { ...s, [field]: isNaN(value) ? 0 : value } : s);
        onUpdateEntry({ ...entry, sets: updatedSets });
    };

    const deleteSet = (setId: string) => {
        const updatedSets = entry.sets.filter(s => s.id !== setId);
        onUpdateEntry({ ...entry, sets: updatedSets });
    };

    const toggleComplete = () => {
        onUpdateEntry({ ...entry, completed: !entry.completed });
    };

    const setAllSameFrom = (sourceSetId: string) => {
        const sourceSet = entry.sets.find(s => s.id === sourceSetId);
        if (!sourceSet) return;
        const updatedSets = entry.sets.map(set => ({
            ...set,
            reps: sourceSet.reps,
            weight: sourceSet.weight,
            time: sourceSet.time,
        }));
        onUpdateEntry({ ...entry, sets: updatedSets });
    };
    
    const handleTimerOpen = (duration: number) => {
        if (duration > 0) {
            setTimerState({isOpen: true, duration});
        }
    };

    const isCalisthenics = workout?.category?.toLowerCase() === 'calisthenics';
    const gridColsClass = isCalisthenics ? 'grid-cols-2' : 'grid-cols-3';

    return (
         <>
        <SetTimerModal 
            isOpen={timerState.isOpen}
            duration={timerState.duration}
            onClose={() => setTimerState({isOpen: false, duration: 0})}
            playSound={playSound}
        />
        <div className={`bg-surface-inset rounded-lg p-4 border-l-4 ${entry.completed ? 'border-brand-500' : 'border-border'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold">{workout?.name || t('workoutLog.unknownExercise')}</h4>
                    <div className={`grid ${gridColsClass} gap-x-4 items-center text-xs text-text-muted mt-1`}>
                        <span className="text-center">{t('workoutLog.reps')}</span>
                        {!isCalisthenics && <span className="text-center">{t('workoutLog.weight')} (kg)</span>}
                        <span className="text-center">{t('workoutLog.time')} (s)</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleComplete} className={`p-2 rounded-full text-white border-2 ${entry.completed ? 'bg-brand-600 border-brand-700' : 'bg-surface-raised hover:bg-opacity-80 border-border'}`}>
                        <CheckIcon />
                    </button>
                    <button onClick={() => onDeleteEntry(entry.id)} className="p-2 text-text-muted hover:text-red-500 border-2 border-transparent rounded-md">
                        <TrashIcon />
                    </button>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {entry.sets.map((set, index) => (
                    <div key={set.id} className="flex items-center gap-2">
                        <span className="font-bold text-text-muted w-8">{index + 1}</span>
                         <div className={`flex-grow grid ${gridColsClass} gap-2`}>
                            <input type="number" value={set.reps} onChange={e => updateSet(set.id, 'reps', parseInt(e.target.value))} className="bg-surface-raised p-1 rounded w-full text-center"/>
                            {!isCalisthenics && <input type="number" value={set.weight || ''} onChange={e => updateSet(set.id, 'weight', parseFloat(e.target.value))} className="bg-surface-raised p-1 rounded w-full text-center"/>}
                            <input type="number" value={set.time || ''} placeholder={t('workoutLog.secondsAbbr')} onChange={e => updateSet(set.id, 'time', parseInt(e.target.value))} className="bg-surface-raised p-1 rounded w-full text-center"/>
                        </div>
                        <div className="flex items-center ml-auto">
                           <button onClick={() => handleTimerOpen(set.time || 0)} title="Start Set Timer" className="text-text-subtle hover:text-brand-400 p-1 border-2 border-transparent rounded-md"><ClockIcon className="w-4 h-4" /></button>
                           <button onClick={() => setAllSameFrom(set.id)} title={t('workoutLog.setAllSame')} className="text-text-subtle hover:text-brand-400 p-1 border-2 border-transparent rounded-md">
                                <DuplicateIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteSet(set.id)} className="text-text-subtle hover:text-red-400 p-1 border-2 border-transparent rounded-md">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-between mt-3">
                <button onClick={addSet} className="text-sm text-brand-400 hover:text-brand-300 font-semibold px-3 py-1 rounded-md border-2 border-brand-800 hover:border-brand-600">
                    + {t('workoutLog.addSet')}
                </button>
            </div>
        </div>
        </>
    );
};


const WorkoutHistory: React.FC<{
    dailyLogs: DailyLog;
    workouts: Workout[];
    setDailyLogs: (logs: DailyLog) => void;
    playSound: (soundConfig: SoundConfig) => void;
}> = ({ dailyLogs, workouts, setDailyLogs, playSound }) => {
    const t = i18n.t.bind(i18n);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    const sortedLogDays = Object.keys(dailyLogs)
        .filter(date => dailyLogs[date] && dailyLogs[date].length > 0)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const handleUpdateEntry = (date: string, updatedEntry: LogEntry) => {
        const newLogForDate = dailyLogs[date].map(entry => entry.id === updatedEntry.id ? updatedEntry : entry);
        setDailyLogs({ ...dailyLogs, [date]: newLogForDate });
    };

    const handleDeleteEntry = (date: string, entryId: string) => {
        const newLogForDate = dailyLogs[date].filter(entry => entry.id !== entryId);
        setDailyLogs({ ...dailyLogs, [date]: newLogForDate });
    };

    const languageLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';

    return (
        <div className="space-y-3">
            {sortedLogDays.length > 0 ? (
                sortedLogDays.map(date => {
                    const logForDate = dailyLogs[date];
                    const workoutNames = logForDate
                        .map(entry => workouts.find(w => w.id === entry.workoutId)?.name)
                        .filter(Boolean)
                        .join(', ');

                    return (
                        <div key={date} className="bg-surface-raised rounded-lg p-4">
                            <button onClick={() => setExpandedDay(expandedDay === date ? null : date)} className="w-full flex justify-between items-center text-left border-2 border-transparent rounded-lg p-2 -m-2 hover:bg-surface-inset">
                                <div>
                                    <p className="font-bold text-lg text-text-base">
                                        {new Date(date + 'T00:00:00').toLocaleDateString(languageLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className="text-sm text-text-muted truncate">{workoutNames}</p>
                                </div>
                                {expandedDay === date ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </button>
                            {expandedDay === date && (
                                <div className="mt-4 space-y-4 border-t border-border pt-4">
                                    {logForDate.map(entry => (
                                        <WorkoutLogItem 
                                            key={entry.id}
                                            entry={entry}
                                            workout={workouts.find(w => w.id === entry.workoutId)}
                                            onUpdateEntry={(updated) => handleUpdateEntry(date, updated)}
                                            onDeleteEntry={(id) => handleDeleteEntry(date, id)}
                                            playSound={playSound}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-text-subtle mt-8">{t('workoutJournal.history.noHistory')}</p>
            )}
        </div>
    );
};

export default WorkoutHistory;
