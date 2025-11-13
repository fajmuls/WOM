
import React, { useState } from 'react';
import { Workout, WorkoutPlan } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, DuplicateIcon, ShareIcon } from './icons';
import i18n, { compressPlan } from '../i18n';
import ConfirmModal from './ConfirmModal';

const ManagePlansComponent: React.FC<{
    plans: WorkoutPlan[];
    setPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
    allWorkouts: Workout[];
}> = ({ plans, setPlans, allWorkouts }) => {
    const t = i18n.t.bind(i18n);
    const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
    const [planName, setPlanName] = useState('');
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    
    const startEditing = (plan: WorkoutPlan) => {
        setEditingPlan(plan);
        setPlanName(plan.name);
        setSelectedWorkouts(plan.workoutIds);
    };

    const startCreating = () => {
        setEditingPlan({ id: Date.now().toString(), name: '', workoutIds: [] });
        setPlanName('');
        setSelectedWorkouts([]);
    };
    
    const cancelEditing = () => {
        setEditingPlan(null);
    };

    const handleSavePlan = () => {
        if (!planName.trim()) return;

        const planToSave: WorkoutPlan = {
            id: editingPlan!.id,
            name: planName.trim(),
            workoutIds: selectedWorkouts,
        };

        const exists = plans.some(p => p.id === planToSave.id);
        if (exists) {
            setPlans(plans.map(p => p.id === planToSave.id ? planToSave : p));
        } else {
            setPlans([...plans, planToSave]);
        }
        cancelEditing();
    };
    
    const handleDeletePlan = (id: string) => {
        setPlans(plans.filter(p => p.id !== id));
        setConfirmDeleteId(null);
    };

    const handleDuplicatePlan = (id: string) => {
        const planToDuplicate = plans.find(p => p.id === id);
        if (!planToDuplicate) return;
        const newPlan: WorkoutPlan = {
            ...planToDuplicate,
            id: Date.now().toString(),
            name: `${planToDuplicate.name} (Copy)`,
        };
        setPlans([...plans, newPlan]);
    };

    const handleSharePlan = (id: string) => {
        const plan = plans.find(p => p.id === id);
        if (!plan) return;

        try {
            const dataToShare = { type: 'plan', data: compressPlan(plan) };
            const jsonString = JSON.stringify(dataToShare);
            const base64String = btoa(unescape(encodeURIComponent(jsonString))); // Handle UTF-8
            const url = `${window.location.origin}${window.location.pathname}#import=${base64String}`;
            
            navigator.clipboard.writeText(url).then(() => {
                alert(t('common.shareLinkCopied'));
            }, (err) => {
                console.error('Could not copy text: ', err);
            });
        } catch (error) {
            console.error("Failed to create share link:", error);
        }
    };

    const handleWorkoutSelection = (workoutId: string) => {
        setSelectedWorkouts(prev => 
            prev.includes(workoutId) ? prev.filter(id => id !== workoutId) : [...prev, workoutId]
        );
    };

    const planToDelete = plans.find(p => p.id === confirmDeleteId);

    if (editingPlan) {
        return (
            <div className="bg-surface-raised rounded-2xl p-4 space-y-4">
                <h3 className="text-lg font-semibold">{plans.some(p => p.id === editingPlan.id) ? t('managePlans.editPlan') : t('managePlans.addPlan')}</h3>
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">{t('managePlans.planName')}</label>
                    <input type="text" value={planName} onChange={e => setPlanName(e.target.value)} placeholder={t('managePlans.planNamePlaceholder')} className="w-full bg-surface-inset border-2 border-border rounded-lg p-3"/>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">{t('managePlans.selectExercises')}</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2 bg-surface-inset p-3 rounded-lg">
                        {allWorkouts.length > 0 ? allWorkouts.map(w => (
                            <div key={w.id} className="flex items-center p-2 rounded-md hover:bg-border">
                                <input 
                                    type="checkbox" 
                                    id={`plan-workout-${w.id}`}
                                    checked={selectedWorkouts.includes(w.id)} 
                                    onChange={() => handleWorkoutSelection(w.id)}
                                    className="h-5 w-5 rounded border-border text-brand-600 focus:ring-brand-500 bg-surface-raised"
                                />
                                <label htmlFor={`plan-workout-${w.id}`} className="ml-3 text-text-base flex-grow cursor-pointer">{w.name}</label>
                            </div>
                        )) : <p className="text-text-subtle text-sm text-center py-4">{t('managePlans.noExercises')}</p>}
                    </div>
                </div>
                 <div className="flex gap-2 pt-2">
                    <button onClick={handleSavePlan} className="bg-brand-600 text-white px-4 py-3 rounded-lg hover:bg-brand-500 flex-grow font-semibold border-2 border-brand-700 hover:border-brand-500">{t('common.save')}</button>
                    <button onClick={cancelEditing} className="bg-surface-inset text-text-base px-4 py-3 rounded-lg hover:bg-border border-2 border-border">{t('common.cancel')}</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <ConfirmModal
                isOpen={!!confirmDeleteId}
                title={t('common.delete') + " " + planToDelete?.name}
                message={t('managePlans.deleteConfirmMessage', { name: planToDelete?.name })}
                onConfirm={() => handleDeletePlan(confirmDeleteId!)}
                onCancel={() => setConfirmDeleteId(null)}
            />
            <button onClick={startCreating} className="w-full mb-6 bg-brand-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-500 transition-colors border-2 border-brand-700 hover:border-brand-500">
                <PlusIcon /> {t('managePlans.addPlan')}
            </button>

            <div className="space-y-3">
                {plans.length > 0 ? (
                    plans.map(plan => (
                        <div key={plan.id} className="bg-surface-raised rounded-2xl p-4">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold">{plan.name}</h3>
                                <div className="flex gap-1">
                                     <button onClick={() => handleSharePlan(plan.id)} title={t('common.share')} className="p-2 text-text-muted hover:text-brand-400 rounded-md border-2 border-surface-inset hover:border-brand-400"><ShareIcon /></button>
                                     <button onClick={() => startEditing(plan)} title={t('common.edit')} className="p-2 text-text-muted hover:text-brand-400 rounded-md border-2 border-surface-inset hover:border-brand-400"><PencilIcon /></button>
                                     <button onClick={() => handleDuplicatePlan(plan.id)} title={t('managePlans.duplicate')} className="p-2 text-text-muted hover:text-brand-400 rounded-md border-2 border-surface-inset hover:border-brand-400"><DuplicateIcon /></button>
                                     <button onClick={() => setConfirmDeleteId(plan.id)} title={t('common.delete')} className="p-2 text-text-muted hover:text-red-500 rounded-md border-2 border-surface-inset hover:border-red-500"><TrashIcon /></button>
                                </div>
                             </div>
                             <div className="text-text-muted text-sm space-y-1 bg-surface-inset p-3 rounded-lg">
                                {plan.workoutIds.length > 0 ? plan.workoutIds.map(id => {
                                    const workout = allWorkouts.find(w => w.id === id);
                                    return <p key={id} className="truncate">&bull; {workout?.name || 'Unknown Exercise'}</p>
                                }) : <p className="text-text-subtle">{t('managePlans.noExercisesInPlan')}</p>}
                             </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-text-subtle mt-8">{t('managePlans.noPlans')}</p>
                )}
            </div>
        </div>
    );
};

export default ManagePlansComponent;
