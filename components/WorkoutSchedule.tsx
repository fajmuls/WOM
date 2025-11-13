import React, { useState, useEffect } from 'react';
import { Workout, WorkoutSchedule, View, WorkoutPlan } from '../types';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from './icons';
import i18n from '../i18n';

interface WorkoutScheduleProps {
    schedules: WorkoutSchedule[];
    setSchedules: (schedules: WorkoutSchedule[]) => void;
    workouts: Workout[];
    plans: WorkoutPlan[];
    navigate: (view: View) => void;
}

const WorkoutScheduleComponent: React.FC<WorkoutScheduleProps> = ({ schedules, setSchedules, workouts, plans, navigate }) => {
    const t = i18n.t.bind(i18n);
    const [showAddForm, setShowAddForm] = useState(false);
    const [scheduleType, setScheduleType] = useState<'workout' | 'plan'>('workout');

    const initialNewScheduleState = {
        day: 'Monday',
        time: '17:00',
        refId: workouts[0]?.id || ''
    };
    const [newSchedule, setNewSchedule] = useState(initialNewScheduleState);

    useEffect(() => {
        if (scheduleType === 'workout') {
            setNewSchedule(prev => ({...prev, refId: workouts[0]?.id || ''}));
        } else {
            setNewSchedule(prev => ({...prev, refId: plans[0]?.id || ''}));
        }
    }, [scheduleType, workouts, plans]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAddSchedule = () => {
        if (!newSchedule.refId) {
            alert(scheduleType === 'workout' ? t('workoutSchedule.selectExercise') : t('workoutSchedule.selectPlan'));
            return;
        }

        const refItem = scheduleType === 'workout' 
            ? workouts.find(w => w.id === newSchedule.refId)
            : plans.find(p => p.id === newSchedule.refId);

        if (!refItem) return;

        const scheduleToAdd: WorkoutSchedule = {
            id: Date.now().toString(),
            day: newSchedule.day,
            time: newSchedule.time,
            type: scheduleType,
            refId: newSchedule.refId,
            name: refItem.name
        };
        setSchedules([...schedules, scheduleToAdd].sort((a,b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || a.time.localeCompare(b.time)));
        setShowAddForm(false);
        setNewSchedule(initialNewScheduleState);
    };

    const handleDeleteSchedule = (id: string) => {
        setSchedules(schedules.filter(s => s.id !== id));
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSchedule(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('dashboard')} className="p-2 rounded-full hover:bg-surface-inset mr-4">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-2xl font-bold">{t('workoutSchedule.title')}</h2>
            </div>

            {showAddForm ? (
                <div className="bg-surface-raised rounded-lg p-4 mb-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-text-muted">{t('workoutSchedule.scheduleType')}</label>
                        <select value={scheduleType} onChange={e => setScheduleType(e.target.value as 'workout' | 'plan')} className="w-full bg-surface-inset border border-border rounded-md p-2 mt-1">
                           <option value="workout">{t('workoutSchedule.singleExercise')}</option>
                           <option value="plan">{t('workoutSchedule.workoutPlan')}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted">{t('workoutSchedule.day')}</label>
                        <select name="day" value={newSchedule.day} onChange={handleInputChange} className="w-full bg-surface-inset border border-border rounded-md p-2 mt-1">
                            {daysOfWeek.map(day => <option key={day} value={day}>{t(`workoutSchedule.days.${day}`)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted">{t('workoutSchedule.time')}</label>
                        <input type="time" name="time" value={newSchedule.time} onChange={handleInputChange} className="w-full bg-surface-inset border border-border rounded-md p-2 mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted">{scheduleType === 'workout' ? t('workoutSchedule.exercise') : t('workoutSchedule.plan')}</label>
                        <select name="refId" value={newSchedule.refId} onChange={handleInputChange} className="w-full bg-surface-inset border border-border rounded-md p-2 mt-1">
                           {scheduleType === 'workout' ? (
                                <>
                                 <option value="">{t('workoutSchedule.selectExercise')}</option>
                                 {workouts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </>
                           ) : (
                                <>
                                 <option value="">{t('workoutSchedule.selectPlan')}</option>
                                 {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </>
                           )}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddSchedule} className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-500 flex-grow">{t('common.add')}</button>
                        <button onClick={() => setShowAddForm(false)} className="bg-surface-inset text-text-base px-4 py-2 rounded-md hover:bg-opacity-80">{t('common.cancel')}</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowAddForm(true)} className="w-full mb-6 bg-brand-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-500 transition-colors">
                    <PlusIcon /> {t('workoutSchedule.addSchedule')}
                </button>
            )}

            <div className="space-y-3">
                {schedules.length > 0 ? (
                    schedules.map(schedule => (
                        <div key={schedule.id} className="bg-surface-raised rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">{schedule.name}</p>
                                <p className="text-text-muted">{t(`workoutSchedule.days.${schedule.day}`)} at {schedule.time}</p>
                            </div>
                            <button onClick={() => handleDeleteSchedule(schedule.id)} className="p-2 text-text-muted hover:text-red-500">
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-text-subtle mt-8">{t('workoutSchedule.noSchedules')}</p>
                )}
            </div>
        </div>
    );
};

export default WorkoutScheduleComponent;