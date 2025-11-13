import React, { useState, useMemo, useEffect } from 'react';
import { DailyLog, Workout, LogEntry, WorkoutSet, SoundConfig } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon } from './icons';
import i18n from '../i18n';
import SetTimerModal from './SetTimerModal';

// A modified version of the log item, designed for use within the calendar view.
const CalendarLogItem: React.FC<{
    entry: LogEntry;
    workout: Workout | undefined;
    onUpdateEntry: (updatedEntry: LogEntry) => void;
    onDeleteEntry: (entryId: string) => void;
    playSound: (soundConfig: SoundConfig) => void;
}> = ({ entry, workout, onUpdateEntry, onDeleteEntry, playSound }) => {
    const t = i18n.t.bind(i18n);
    const [isExpanded, setIsExpanded] = useState(!entry.completed);
    const [timerState, setTimerState] = useState<{isOpen: boolean, duration: number}>({isOpen: false, duration: 0});

    const addSet = () => {
        const lastSet = entry.sets[entry.sets.length - 1] || { reps: 8, weight: 0, time: 0 };
        const newSet: WorkoutSet = { id: Date.now().toString(), reps: lastSet.reps, weight: lastSet.weight, time: lastSet.time };
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
        setIsExpanded(entry.completed); // Collapse when completed, expand when un-completed
    };

    const handleTimerOpen = (duration: number) => {
        if (duration > 0) {
            setTimerState({isOpen: true, duration});
        }
    };

    const isCalisthenics = workout?.category?.toLowerCase() === 'calisthenics';

    return (
        <>
        <SetTimerModal 
            isOpen={timerState.isOpen}
            duration={timerState.duration}
            onClose={() => setTimerState({isOpen: false, duration: 0})}
            playSound={playSound}
        />
        <div className={`bg-surface-inset rounded-lg p-3 border-l-4 transition-all ${entry.completed ? 'border-brand-500' : 'border-border'}`}>
            <div className="flex justify-between items-center">
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex-grow text-left flex items-center gap-2">
                    <h4 className="font-bold">{workout?.name || t('workoutLog.unknownExercise')}</h4>
                    {isExpanded ? <ChevronUpIcon className="w-4 h-4 text-text-muted" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted" />}
                </button>
                <div className="flex items-center gap-1">
                    <button onClick={toggleComplete} title={entry.completed ? 'Mark as incomplete' : 'Mark as complete'} className={`p-1.5 rounded-full text-white border-2 ${entry.completed ? 'bg-brand-600 border-brand-700' : 'bg-surface-raised hover:bg-opacity-80 border-border'}`}><CheckIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteEntry(entry.id)} title="Delete Entry" className="p-1.5 text-text-muted hover:text-red-500 border-2 border-transparent rounded-md"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-2 animate-fade-in">
                    <div className="space-y-2">
                        {entry.sets.map((set, index) => (
                            <div key={set.id} className="flex items-center gap-2 text-sm">
                                <span className="font-mono text-text-muted w-6 text-center">{index + 1}</span>
                                <input type="number" placeholder={t('workoutLog.reps')} value={set.reps} onChange={e => updateSet(set.id, 'reps', parseInt(e.target.value))} className="bg-surface-raised p-1 rounded w-full text-center"/>
                                <span className="text-text-subtle">x</span>
                                {!isCalisthenics && (
                                    <>
                                        <input type="number" placeholder={t('workoutLog.weight')} value={set.weight || ''} onChange={e => updateSet(set.id, 'weight', parseFloat(e.target.value))} className="bg-surface-raised p-1 rounded w-full text-center"/>
                                        <span className="text-text-subtle">kg</span>
                                    </>
                                )}
                                <input type="number" placeholder={t('workoutLog.time')} value={set.time || ''} onChange={e => updateSet(set.id, 'time', parseInt(e.target.value))} className="bg-surface-raised p-1 rounded w-full text-center"/>
                                <span className="text-text-subtle">s</span>
                                <button onClick={() => handleTimerOpen(set.time || 0)} title="Start Set Timer" className="text-text-subtle hover:text-brand-400 p-1 border-2 border-transparent rounded-md"><ClockIcon className="w-4 h-4" /></button>
                                <button onClick={() => deleteSet(set.id)} className="text-text-subtle hover:text-red-400 p-1 border-2 border-transparent rounded-md"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addSet} className="text-xs text-brand-400 hover:text-brand-300 font-semibold mt-2 border border-brand-700/50 hover:border-brand-600/50 rounded-md px-2 py-0.5">+ {t('workoutLog.addSet')}</button>
                </div>
            )}
        </div>
        </>
    );
};

// Helper to get YYYY-MM-DD string from a local date object, avoiding timezone issues.
const toISODateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const WorkoutCalendar: React.FC<{
    dailyLogs: DailyLog;
    setDailyLogs: (logs: DailyLog) => void;
    workouts: Workout[];
    workoutCategories: string[];
    playSound: (soundConfig: SoundConfig) => void;
}> = ({ dailyLogs, setDailyLogs, workouts, workoutCategories, playSound }) => {
    const t = i18n.t.bind(i18n);
    const languageLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(toISODateString(new Date()));
    const [selectedAddCategory, setSelectedAddCategory] = useState<string>('');
    const [newWorkoutId, setNewWorkoutId] = useState('');

    const categoryOptions = useMemo(() => {
        const uncategorizedLabel = t('manageCategories.uncategorized');
        // Union of managed categories and categories actually in use
        const allCategories = new Set(workoutCategories);
        workouts.forEach(w => allCategories.add(w.category || uncategorizedLabel));
        return Array.from(allCategories).sort();
    }, [workouts, workoutCategories, t]);

    const filteredWorkouts = useMemo(() => {
        if (!selectedAddCategory) return [];
        const uncategorizedLabel = t('manageCategories.uncategorized');
        if (selectedAddCategory === uncategorizedLabel) {
            return workouts.filter(w => !w.category || w.category === uncategorizedLabel);
        }
        return workouts.filter(w => w.category === selectedAddCategory);
    }, [workouts, selectedAddCategory, t]);
    
    useEffect(() => {
        if (filteredWorkouts.length > 0) {
            setNewWorkoutId(filteredWorkouts[0].id);
        } else {
            setNewWorkoutId('');
        }
    }, [selectedAddCategory, filteredWorkouts]);

    const { month, year, calendarGrid } = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Adjust for week starting on Monday
        const startOffset = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);

        const grid: (Date | null)[] = Array(startOffset).fill(null);
        for (let day = 1; day <= daysInMonth; day++) {
            grid.push(new Date(year, month, day));
        }
        return { month, year, calendarGrid: grid };
    }, [currentDate]);
    
    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(toISODateString(date));
    };

    const handleAddExercise = () => {
        if (!newWorkoutId || !selectedDate) return;
        const newEntry: LogEntry = {
            id: Date.now().toString(),
            workoutId: newWorkoutId,
            sets: [{ id: Date.now().toString() + '-set', reps: 8, weight: 0, time: 0 }],
            completed: false,
        };
        const updatedLogs = [...(dailyLogs[selectedDate] || []), newEntry];
        setDailyLogs({ ...dailyLogs, [selectedDate]: updatedLogs });
    };

    const handleUpdateEntry = (updatedEntry: LogEntry) => {
        const newLogForDate = dailyLogs[selectedDate].map(entry => entry.id === updatedEntry.id ? updatedEntry : entry);
        setDailyLogs({ ...dailyLogs, [selectedDate]: newLogForDate });
    };

    const handleDeleteEntry = (entryId: string) => {
        const newLogForDate = dailyLogs[selectedDate].filter(entry => entry.id !== entryId);
        setDailyLogs({ ...dailyLogs, [selectedDate]: newLogForDate });
    };

    const selectedDayLogs = dailyLogs[selectedDate] || [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-raised p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4 bg-surface-inset p-2 rounded-lg">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-surface-raised border-2 border-transparent hover:border-border"><ChevronLeftIcon /></button>
                    <h3 className="text-lg font-bold">{new Date(year, month).toLocaleDateString(languageLocale, { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-surface-raised border-2 border-transparent hover:border-border"><ChevronRightIcon /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-text-muted mb-2 bg-surface-inset p-2 rounded-md">
                    {t('workoutJournal.calendar.days', { returnObjects: true }).map((day:string) => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarGrid.map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} />;
                        const dateStr = toISODateString(date);
                        const logsForDay = dailyLogs[dateStr];
                        const hasLog = logsForDay && logsForDay.length > 0;
                        const isSelected = dateStr === selectedDate;
                        const isToday = toISODateString(new Date()) === dateStr;
                        
                        let buttonClasses = 'h-10 w-10 flex items-center justify-center rounded-full text-sm transition-colors border-2 relative';
                        
                        if (isSelected) {
                            buttonClasses += ' bg-brand-600 text-white font-bold border-brand-700 shadow-lg';
                        } else {
                            buttonClasses += ' hover:bg-surface-inset';
                            if (hasLog) {
                                const allCompleted = logsForDay.every(log => log.completed);
                                if (allCompleted) {
                                    // green
                                    buttonClasses += ' bg-green-500/20 text-green-300 border-green-500/30';
                                } else {
                                    // red
                                    buttonClasses += ' bg-red-500/20 text-red-300 border-red-500/30';
                                }
                            } else {
                                buttonClasses += ' border-transparent text-text-base';
                            }
                        
                            if (isToday) {
                                // override border color for today
                                buttonClasses += ' border-blue-500'; 
                            }
                        }

                        return (
                            <div key={dateStr} className="flex items-center justify-center">
                                <button
                                    onClick={() => handleDateClick(date)}
                                    className={buttonClasses}
                                >
                                    {date.getDate()}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="bg-surface-raised p-4 rounded-lg">
                <h3 className="font-bold mb-3 border-b border-border pb-2">
                    {t('workoutLog.selectDate')} {new Date(selectedDate + 'T00:00:00').toLocaleDateString(languageLocale, { month: 'short', day: 'numeric' })}
                </h3>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {selectedDayLogs.length > 0 ? (
                        selectedDayLogs.map(entry => (
                            <CalendarLogItem
                                key={entry.id}
                                entry={entry}
                                workout={workouts.find(w => w.id === entry.workoutId)}
                                onUpdateEntry={handleUpdateEntry}
                                onDeleteEntry={handleDeleteEntry}
                                playSound={playSound}
                            />
                        ))
                    ) : (
                        <p className="text-center text-text-subtle text-sm py-8">{t('workoutJournal.calendar.noLog')}</p>
                    )}
                </div>
                 <div className="mt-4 border-t border-border pt-3">
                     <h4 className="font-semibold text-sm mb-2">{t('workoutJournal.calendar.addExercise')}</h4>
                     <div className="flex flex-col gap-2">
                        <select
                            value={selectedAddCategory}
                            onChange={e => setSelectedAddCategory(e.target.value)}
                            className="w-full bg-surface-inset border border-border rounded-md p-2 text-sm"
                        >
                            <option value="">{t('manageWorkouts.selectCategory')}</option>
                            {categoryOptions.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <select 
                                value={newWorkoutId} 
                                onChange={e => setNewWorkoutId(e.target.value)}
                                className="w-full bg-surface-inset border border-border rounded-md p-2 text-sm"
                                disabled={!selectedAddCategory}
                            >
                                {!selectedAddCategory ? (
                                    <option value="">{t('workoutLog.selectCategoryFirst')}</option>
                                ) : filteredWorkouts.length > 0 ? (
                                    filteredWorkouts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)
                                ) : (
                                    <option value="">{t('manageWorkouts.noExercisesInCategory', { category: selectedAddCategory })}</option>
                                )}
                            </select>
                            <button onClick={handleAddExercise} disabled={!newWorkoutId} className="bg-brand-600 text-white p-2 rounded-md hover:bg-brand-500 disabled:bg-gray-500 border-2 border-brand-700 hover:border-brand-500 disabled:border-gray-600">
                                <PlusIcon />
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutCalendar;