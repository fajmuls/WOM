import React, { useState, useMemo } from 'react';
import { Workout, TimerTemplate, LogEntry, WorkoutSet } from '../types';
import { TrashIcon, DuplicateIcon } from './icons';
import i18n from '../i18n';

interface PostWorkoutSummaryProps {
    template: TimerTemplate;
    workouts: Workout[];
    onSave: (logEntries: LogEntry[]) => void;
    onDiscard: () => void;
}

const PostWorkoutSummary: React.FC<PostWorkoutSummaryProps> = ({ template, workouts, onSave, onDiscard }) => {
    const t = i18n.t.bind(i18n);

    const initialLogEntries = useMemo(() => {
        const workSegments = template.segments.filter(s => s.type === 'work' && s.workoutId && s.sets && s.sets > 0);
        
        const logMap = new Map<string, LogEntry>();

        workSegments.forEach(seg => {
            if (!seg.workoutId) return;

            const existing = logMap.get(seg.workoutId);
            const newSets: WorkoutSet[] = Array.from({ length: seg.sets || 0 }).map((_, i) => ({
                id: `${Date.now()}-${seg.id}-${i}`,
                reps: 8,
                weight: 0,
                time: seg.workDuration,
            }));

            if (existing) {
                existing.sets.push(...newSets);
            } else {
                logMap.set(seg.workoutId, {
                    id: `${Date.now()}-${seg.workoutId}`,
                    workoutId: seg.workoutId,
                    sets: newSets,
                    completed: true,
                });
            }
        });

        return Array.from(logMap.values());
    }, [template]);

    const [logEntries, setLogEntries] = useState<LogEntry[]>(initialLogEntries);

    const handleUpdateSet = (entryId: string, setId: string, field: 'reps' | 'weight' | 'time', value: number) => {
        setLogEntries(prevEntries => 
            prevEntries.map(entry => {
                if (entry.id !== entryId) return entry;
                return {
                    ...entry,
                    sets: entry.sets.map(s => s.id === setId ? { ...s, [field]: isNaN(value) ? 0 : value } : s)
                };
            })
        );
    };

    const handleSetAllSame = (entryId: string, sourceSetId: string) => {
        setLogEntries(prevEntries =>
            prevEntries.map(entry => {
                if (entry.id !== entryId) return entry;
                const sourceSet = entry.sets.find(s => s.id === sourceSetId);
                if (!sourceSet) return entry;
                return {
                    ...entry,
                    sets: entry.sets.map(set => ({
                        ...set,
                        reps: sourceSet.reps,
                        weight: sourceSet.weight,
                        time: sourceSet.time,
                    }))
                };
            })
        );
    };

    const handleSave = () => {
        onSave(logEntries);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-brand-400">{t('postWorkout.title')}</h2>
                <p className="text-text-muted">{t('postWorkout.subtitle')}</p>
            </div>
            
            <div className="space-y-4">
                {logEntries.map(entry => {
                    const workout = workouts.find(w => w.id === entry.workoutId);
                    return (
                        <div key={entry.id} className="bg-surface-raised rounded-lg p-4">
                            <h3 className="text-xl font-bold mb-2">{workout?.name || 'Unknown Exercise'}</h3>
                            <div className="flex items-center text-xs text-text-muted mt-1 mb-2 space-x-4">
                                <span>{t('workoutLog.sets')}</span>
                                <span>{t('workoutLog.reps')}</span>
                                <span>{t('workoutLog.weight')} (kg)</span>
                                <span>{t('workoutLog.time')} (s)</span>
                            </div>
                            <div className="space-y-2">
                                {entry.sets.map((set, index) => (
                                     <div key={set.id} className="flex items-center gap-2">
                                        <span className="font-bold text-text-muted w-8">{index + 1}</span>
                                        <input type="number" value={set.reps} onChange={e => handleUpdateSet(entry.id, set.id, 'reps', parseInt(e.target.value))} className="bg-surface-inset p-1 rounded w-20 text-center"/>
                                        <input type="number" value={set.weight} onChange={e => handleUpdateSet(entry.id, set.id, 'weight', parseInt(e.target.value))} className="bg-surface-inset p-1 rounded w-20 text-center"/>
                                        <input type="number" value={set.time || ''} placeholder="s" onChange={e => handleUpdateSet(entry.id, set.id, 'time', parseInt(e.target.value))} className="bg-surface-inset p-1 rounded w-20 text-center"/>
                                        <button onClick={() => handleSetAllSame(entry.id, set.id)} title={t('workoutLog.setAllSame')} className="text-text-subtle hover:text-brand-400 p-1 ml-auto border-2 border-transparent rounded-md">
                                            <DuplicateIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-4 mt-8">
                <button onClick={handleSave} className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-500 transition-colors border-2 border-brand-700 hover:border-brand-500">
                    {t('postWorkout.saveLog')}
                </button>
                 <button onClick={onDiscard} className="w-full bg-surface-inset text-text-base font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors border-2 border-border">
                    {t('postWorkout.discard')}
                </button>
            </div>
        </div>
    );
};

export default PostWorkoutSummary;