
// Fix: Import useEffect from react
import React, { useState, useMemo, useEffect } from 'react';
import { Workout, View, WorkoutPlan } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, FolderPlusIcon } from './icons';
import i18n from '../i18n';
import ManagePlansComponent from './ManagePlans';
import ManageCategoriesModal from './ManageCategoriesModal';
import ConfirmModal from './ConfirmModal';

// Exercise Management Component
const ManageExercises: React.FC<{
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  categories: string[];
}> = ({ workouts, setWorkouts, categories }) => {
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutCategory, setNewWorkoutCategory] = useState('');
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const t = i18n.t.bind(i18n);

  const categoryOptions = useMemo(() => {
    const uncategorizedLabel = t('manageCategories.uncategorized');
    // This is the list of ALL categories that exist: user-defined ones, and any from workouts (e.g. "Uncategorized" or legacy ones).
    const allCategories = new Set(categories);
    workouts.forEach(w => allCategories.add(w.category || uncategorizedLabel));
    return Array.from(allCategories).sort();
  }, [categories, workouts, t]);

  useEffect(() => {
    if (!newWorkoutCategory && categoryOptions.length > 0) {
      setNewWorkoutCategory(categoryOptions.includes('Gym') ? 'Gym' : categoryOptions[0]);
    }
  }, [categoryOptions, newWorkoutCategory]);

  const handleAddWorkout = () => {
    if (newWorkoutName.trim() === '') return;
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: newWorkoutName.trim(),
      category: newWorkoutCategory || t('manageCategories.uncategorized'),
    };
    setWorkouts(prev => [...prev, newWorkout]);
    setNewWorkoutName('');
  };

  const handleUpdateWorkout = () => {
    if (!editingWorkout || editingWorkout.name.trim() === '') return;
    setWorkouts(workouts.map(w => w.id === editingWorkout.id ? { ...editingWorkout, category: editingWorkout.category || t('manageCategories.uncategorized') } : w));
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    setConfirmDeleteId(null);
  };

  const groupedWorkouts = useMemo(() => {
    return workouts.reduce((acc, workout) => {
      const category = workout.category || t('manageCategories.uncategorized');
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(workout);
      return acc;
    }, {} as Record<string, Workout[]>);
  }, [workouts, t]);
  
  const sortedCategories = Object.keys(groupedWorkouts).sort();
  const workoutToDelete = workouts.find(w => w.id === confirmDeleteId);

  const renderWorkoutList = (list: Workout[], title: string) => (
      <div className="mb-6">
        <h4 className="text-xl font-bold text-brand-400 mb-3">{title}</h4>
        <div className="space-y-3">
          {list.map(workout => (
            <div key={workout.id} className="bg-surface-raised rounded-2xl p-4 flex justify-between items-center">
              <span className="font-medium text-text-base">{workout.name}</span>
              <div className="flex gap-2">
                <button onClick={() => setEditingWorkout(workout)} className="p-2 text-text-muted hover:text-brand-400 rounded-md border-2 border-surface-inset hover:border-brand-400">
                  <PencilIcon />
                </button>
                <button onClick={() => setConfirmDeleteId(workout.id)} className="p-2 text-text-muted hover:text-red-500 rounded-md border-2 border-surface-inset hover:border-red-500">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
  
  return (
      <div>
          <ConfirmModal
              isOpen={!!confirmDeleteId}
              title={t('common.delete') + " " + workoutToDelete?.name}
              message={t('manageWorkouts.deleteConfirmMessage', { name: workoutToDelete?.name })}
              onConfirm={() => handleDeleteWorkout(confirmDeleteId!)}
              onCancel={() => setConfirmDeleteId(null)}
          />
          <div className="bg-surface-raised rounded-2xl p-4 mb-8">
            <h3 className="text-lg font-semibold mb-3">{editingWorkout ? t('manageWorkouts.editExercise') : t('manageWorkouts.addExercise')}</h3>
            <div className="space-y-3">
               <input
                type="text"
                value={editingWorkout ? editingWorkout.name : newWorkoutName}
                onChange={(e) => editingWorkout ? setEditingWorkout({...editingWorkout, name: e.target.value}) : setNewWorkoutName(e.target.value)}
                placeholder={t('manageWorkouts.placeholder')}
                className="w-full bg-surface-inset border-2 border-border rounded-lg p-3 focus:ring-brand-500 focus:border-brand-500 transition"
              />
              <div className="flex gap-2">
                 <select
                    value={editingWorkout ? (editingWorkout.category || '') : newWorkoutCategory}
                    onChange={(e) => editingWorkout ? setEditingWorkout({...editingWorkout, category: e.target.value}) : setNewWorkoutCategory(e.target.value)}
                    className="flex-grow bg-surface-inset border-2 border-border rounded-lg p-3 focus:ring-brand-500 focus:border-brand-500 transition"
                  >
                    <option value="">{t('manageWorkouts.selectCategory')}</option>
                    {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {editingWorkout ? (
                    <div className="flex gap-2">
                      <button onClick={handleUpdateWorkout} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-500 font-semibold border-2 border-brand-700 hover:border-brand-500">{t('common.save')}</button>
                      <button onClick={() => setEditingWorkout(null)} className="bg-surface-inset text-text-base px-4 py-2 rounded-lg hover:bg-border border-2 border-border">{t('common.cancel')}</button>
                    </div>
                  ) : (
                    <button onClick={handleAddWorkout} className="bg-brand-600 text-white p-3 rounded-lg hover:bg-brand-500 border-2 border-brand-700 hover:border-brand-500">
                        <PlusIcon />
                    </button>
                  )}
              </div>
            </div>
          </div>
          
          <div>
            {sortedCategories.length > 0 ? (
                sortedCategories.map(category => renderWorkoutList(groupedWorkouts[category], category))
            ) : (
                <p className="text-center text-text-subtle mt-8">{t('manageWorkouts.noExercises')}</p>
            )}
          </div>
      </div>
  );
};

// Main Component with Tabs
const ManageWorkouts: React.FC<{
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  plans: WorkoutPlan[];
  setPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  workoutCategories: string[];
  setWorkoutCategories: React.Dispatch<React.SetStateAction<string[]>>;
  navigate: (view: View) => void;
}> = ({ workouts, setWorkouts, plans, setPlans, workoutCategories, setWorkoutCategories, navigate }) => {
  const [activeTab, setActiveTab] = useState<'exercises' | 'plans'>('exercises');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const t = i18n.t.bind(i18n);

  const TabButton: React.FC<{tab: 'exercises' | 'plans', children: React.ReactNode}> = ({tab, children}) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2.5 text-sm font-semibold rounded-lg flex-grow transition-colors border-2 ${activeTab === tab ? 'bg-brand-600 text-white border-brand-700' : 'bg-surface-inset text-text-muted hover:bg-border border-border'}`}
      >
          {children}
      </button>
  );

  return (
    <div className="p-4 md:p-6">
      {isCategoriesModalOpen && (
        <ManageCategoriesModal
          isOpen={isCategoriesModalOpen}
          onClose={() => setIsCategoriesModalOpen(false)}
          categories={workoutCategories}
          setCategories={setWorkoutCategories}
          workouts={workouts}
          setWorkouts={setWorkouts}
        />
      )}
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">{t('workoutLibrary.title')}</h2>
        {activeTab === 'exercises' && (
            <button onClick={() => setIsCategoriesModalOpen(true)} className="flex items-center gap-2 text-sm bg-surface-inset text-text-muted font-semibold px-3 py-2 rounded-lg hover:bg-border border-2 border-border">
                <FolderPlusIcon className="w-5 h-5" />
                {t('manageCategories.title')}
            </button>
        )}
      </header>

      <div className="flex gap-2 mb-6 p-1.5 bg-surface-inset rounded-xl">
        <TabButton tab="exercises">{t('workoutLibrary.tabs.exercises')}</TabButton>
        <TabButton tab="plans">{t('workoutLibrary.tabs.plans')}</TabButton>
      </div>

      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'exercises' && <ManageExercises workouts={workouts} setWorkouts={setWorkouts} categories={workoutCategories} />}
        {activeTab === 'plans' && <ManagePlansComponent plans={plans} setPlans={setPlans} allWorkouts={workouts} />}
      </div>
    </div>
  );
};

export default ManageWorkouts;
