
import React from 'react';
import { DailyLog, Workout, LogEntry } from '../types';
import i18n from '../i18n';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-surface-inset p-4 rounded-lg text-center">
        <p className="text-sm text-text-muted">{title}</p>
        <p className="text-2xl font-bold text-brand-400">{value}</p>
    </div>
);

const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

type ExerciseStats = {
    sets: number;
    reps: number;
    volume: number;
};

const WorkoutSummary: React.FC<{ dailyLogs: DailyLog; workouts: Workout[]; }> = ({ dailyLogs, workouts }) => {
    const t = i18n.t.bind(i18n);

    const processLogs = (startDate: Date, endDate: Date) => {
        let workoutCount = 0;
        let totalVolume = 0;
        let totalSets = 0;
        let totalReps = 0;
        const exerciseFrequency: Record<string, number> = {};
        const exerciseStats: Record<string, ExerciseStats> = {};

        Object.keys(dailyLogs).forEach((dateStr) => {
            const logs = dailyLogs[dateStr];
            const logDate = new Date(dateStr + 'T00:00:00');
            if (logDate >= startDate && logDate <= endDate) {
                if (logs.length > 0) {
                    workoutCount++;
                }
                logs.forEach(entry => {
                    totalSets += entry.sets.length;
                    exerciseFrequency[entry.workoutId] = (exerciseFrequency[entry.workoutId] || 0) + 1;
                    
                    if (!exerciseStats[entry.workoutId]) {
                        exerciseStats[entry.workoutId] = { sets: 0, reps: 0, volume: 0 };
                    }
                    exerciseStats[entry.workoutId].sets += entry.sets.length;

                    entry.sets.forEach(set => {
                        const currentReps = set.reps || 0;
                        const currentWeight = set.weight || 0;
                        totalReps += currentReps;
                        totalVolume += currentReps * currentWeight;

                        exerciseStats[entry.workoutId].reps += currentReps;
                        exerciseStats[entry.workoutId].volume += currentReps * currentWeight;
                    });
                });
            }
        });

        const mostFrequentIds = Object.entries(exerciseFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);
            
        const mostFrequentNames = mostFrequentIds.map(id => workouts.find(w => w.id === id)?.name || t('workoutLog.unknownExercise'));

        return { workoutCount, totalVolume, totalSets, totalReps, mostFrequentNames, exerciseStats };
    };

    const today = new Date();
    const weekStart = getWeekStartDate(new Date());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    const weeklyStats = processLogs(weekStart, today);
    const monthlyStats = processLogs(monthStart, today);
    
    // Activity Chart Data (Last 30 days)
    const activityData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const logs = dailyLogs[dateString] || [];
        return { date: dateString, sets: logs.reduce((sum, entry) => sum + entry.sets.length, 0) };
    }).reverse();
    
    const maxSets = Math.max(...activityData.map(d => d.sets), 0);

    const renderStatsBlock = (stats: ReturnType<typeof processLogs>) => {
        if (stats.workoutCount === 0) {
            return <p className="text-text-subtle text-center py-4">{t('workoutJournal.summary.noActivity')}</p>;
        }
        
        const sortedExerciseStats = Object.entries(stats.exerciseStats)
            .map(([workoutId, data]) => ({
                workoutId,
                name: workouts.find(w => w.id === workoutId)?.name || t('workoutLog.unknownExercise'),
                ...data,
            }))
            .sort((a, b) => b.volume - a.volume);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title={t('workoutJournal.summary.workouts')} value={stats.workoutCount} />
                    <StatCard title={t('workoutJournal.summary.volume')} value={stats.totalVolume.toLocaleString()} />
                    <StatCard title={t('workoutJournal.summary.sets')} value={stats.totalSets} />
                    <StatCard title={t('workoutJournal.summary.totalReps')} value={stats.totalReps.toLocaleString()} />
                </div>
                <div>
                     <h4 className="text-lg font-bold mb-2">{t('workoutJournal.summary.exerciseStats.title')}</h4>
                     <div className="bg-surface-raised rounded-lg p-2 space-y-2">
                        <div className="grid grid-cols-4 gap-2 text-xs text-text-muted font-bold px-2">
                            <div className="col-span-2">{t('workoutJournal.summary.exerciseStats.exercise')}</div>
                            <div className="text-center">{t('workoutJournal.summary.exerciseStats.sets')}</div>
                            <div className="text-center">{t('workoutJournal.summary.exerciseStats.reps')}</div>
                        </div>
                         <div className="max-h-60 overflow-y-auto pr-1">
                             {sortedExerciseStats.map(({ workoutId, name, sets, reps, volume }) => (
                                 <div key={workoutId} className="grid grid-cols-4 gap-2 text-sm bg-surface-inset p-2 rounded-md items-center">
                                     <div className="col-span-2 truncate font-semibold">
                                         {name}
                                         <p className="text-xs text-text-muted font-normal">{t('workoutJournal.summary.exerciseStats.volume')}: {volume.toLocaleString()}</p>
                                    </div>
                                     <div className="text-center">{sets}</div>
                                     <div className="text-center">{reps}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">{t('workoutJournal.summary.thisWeek')}</h3>
                </div>
                {renderStatsBlock(weeklyStats)}
            </div>

            <div>
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">{t('workoutJournal.summary.thisMonth')}</h3>
                </div>
                {renderStatsBlock(monthlyStats)}
            </div>
            
             <div>
                <h3 className="text-xl font-bold mb-3">{t('workoutJournal.summary.activityLast30Days')}</h3>
                <div className="bg-surface-raised p-4 rounded-lg">
                    {maxSets > 0 ? (
                        <div className="flex gap-1 h-32 items-end">
                            {activityData.map(day => (
                                <div key={day.date} className="flex-1 flex flex-col justify-end items-center group">
                                    <div className="text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{day.sets}</div>
                                    <div 
                                        className="w-full bg-brand-600 hover:bg-brand-500 rounded-t-sm"
                                        style={{ height: `${(day.sets / (maxSets || 1)) * 100}%` }}
                                        title={`${day.date}: ${day.sets} sets`}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-text-subtle text-center py-4">{t('workoutJournal.summary.noActivity')}</p>}
                </div>
            </div>
        </div>
    );
};

export default WorkoutSummary;
