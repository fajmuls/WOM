
import React, { useState, useMemo } from 'react';
import { Workout } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon } from './icons';
import i18n from '../i18n';
import ConfirmModal from './ConfirmModal';

interface ManageCategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    setCategories: (value: string[] | ((val: string[]) => string[])) => void;
    workouts: Workout[];
    setWorkouts: (value: Workout[] | ((val: Workout[]) => Workout[])) => void;
}

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ isOpen, onClose, categories, setCategories, workouts, setWorkouts }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const t = i18n.t.bind(i18n);

    const displayCategories = useMemo(() => {
        const uncategorizedLabel = t('manageCategories.uncategorized');
        const allCats = new Set(categories);
        const hasUncategorized = workouts.some(w => !w.category || w.category === uncategorizedLabel);
        if (hasUncategorized) {
            allCats.add(uncategorizedLabel);
        }
        return Array.from(allCats).sort();
    }, [categories, workouts, t]);

    if (!isOpen) return null;

    const handleAddCategory = () => {
        const trimmedName = newCategoryName.trim();
        if (trimmedName && !categories.includes(trimmedName)) {
            setCategories(prev => [...prev, trimmedName].sort());
            setNewCategoryName('');
        }
    };

    const handleUpdateCategory = () => {
        if (!editingCategory) return;
        const { oldName, newName } = editingCategory;
        const trimmedNewName = newName.trim();
        if (trimmedNewName && trimmedNewName !== oldName && !categories.includes(trimmedNewName)) {
            // Update category list
            setCategories(prev => prev.map(c => c === oldName ? trimmedNewName : c).sort());
            // Update workouts
            setWorkouts(prev => prev.map(w => w.category === oldName ? { ...w, category: trimmedNewName } : w));
            setEditingCategory(null);
        }
    };

    const handleDeleteCategory = (categoryToDelete: string) => {
        const uncategorized = t('manageCategories.uncategorized');
        // Remove from categories list
        setCategories(prev => prev.filter(c => c !== categoryToDelete));
        // Update workouts
        setWorkouts(prev => prev.map(w => w.category === categoryToDelete ? { ...w, category: uncategorized } : w));
        setConfirmDelete(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4">
            <ConfirmModal
                isOpen={!!confirmDelete}
                title={t('manageCategories.deleteConfirmTitle')}
                message={t('manageCategories.deleteConfirmMessage', { name: confirmDelete })}
                onConfirm={() => handleDeleteCategory(confirmDelete!)}
                onCancel={() => setConfirmDelete(null)}
            />
            <div className="bg-surface-raised rounded-2xl p-6 shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-brand-400">{t('manageCategories.title')}</h2>
                
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-2">
                    {displayCategories.length > 0 ? displayCategories.map(category => {
                        const isUncategorized = category === t('manageCategories.uncategorized');
                        return (
                            <div key={category} className="flex items-center gap-2 p-2 rounded-md bg-surface-inset">
                                {editingCategory?.oldName === category ? (
                                    <input 
                                        type="text"
                                        value={editingCategory.newName}
                                        onChange={e => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                        className="flex-grow bg-surface-raised border-2 border-brand-500 rounded-md p-1"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="flex-grow text-text-base">{category}</span>
                                )}
                                {editingCategory?.oldName === category ? (
                                    <button onClick={handleUpdateCategory} className="p-2 text-green-400 hover:text-green-300"><CheckIcon /></button>
                                ) : (
                                    <button 
                                        onClick={() => setEditingCategory({ oldName: category, newName: category })} 
                                        className="p-2 text-text-muted hover:text-brand-400 disabled:text-text-subtle disabled:cursor-not-allowed"
                                        disabled={isUncategorized}
                                    >
                                        <PencilIcon />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setConfirmDelete(category)} 
                                    className="p-2 text-text-muted hover:text-red-500 disabled:text-text-subtle disabled:cursor-not-allowed"
                                    disabled={isUncategorized}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        )
                    }) : (
                        <p className="text-center text-sm text-text-subtle py-4">{t('manageWorkouts.noCategories')}</p>
                    )}
                </div>

                <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-2">{t('manageCategories.addCategory')}</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder={t('manageCategories.categoryNamePlaceholder')}
                            className="w-full bg-surface-inset border-2 border-border rounded-lg p-3"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button onClick={handleAddCategory} className="bg-brand-600 text-white p-3 rounded-lg hover:bg-brand-500 border-2 border-brand-700 hover:border-brand-500">
                            <PlusIcon />
                        </button>
                    </div>
                </div>

                <button onClick={onClose} className="mt-6 w-full bg-surface-inset text-text-base font-bold py-3 px-4 rounded-lg hover:bg-border transition-colors border-2 border-border">
                    {t('importDataModal.doneButton')}
                </button>
            </div>
        </div>
    );
};

export default ManageCategoriesModal;
