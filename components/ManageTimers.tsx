
import React, { useState, useMemo } from 'react';
import { TimerTemplate, TimerSegment, View, WorkoutPlan, Workout } from '../types';
import { PlusIcon, TrashIcon, ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon, DuplicateIcon, ShareIcon } from './icons';
import i18n, { compressTemplate } from '../i18n';
import ConfirmModal from './ConfirmModal';

interface ManageTimersProps {
    templates: TimerTemplate[];
    setTemplates: (templates: TimerTemplate[]) => void;
    plans: WorkoutPlan[];
    allWorkouts: Workout[];
    navigate: (view: View) => void;
}

const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const calculateSegmentDuration = (segment: TimerSegment): number => {
    if (segment.type === 'work') {
        const sets = segment.sets || 1;
        const work = segment.workDuration || 0;
        const rest = segment.restDuration || 0;
        if (sets <= 0) return 0;
        return (sets * work) + (Math.max(0, sets - 1) * rest);
    }
    return segment.duration || 0;
};

const ManageTimers: React.FC<ManageTimersProps> = ({ templates, setTemplates, plans, allWorkouts, navigate }) => {
    const [editingTemplate, setEditingTemplate] = useState<TimerTemplate | null>(null);
    const [linkedPlanId, setLinkedPlanId] = useState<string>('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const t = i18n.t.bind(i18n);

    const handleSelectTemplate = (id: string) => {
        const template = templates.find(t => t.id === id);
        setEditingTemplate(template ? JSON.parse(JSON.stringify(template)) : null); // Deep copy
        setLinkedPlanId('');
    };

    const handleAddNewTemplate = () => {
        setEditingTemplate({ 
            id: Date.now().toString(), 
            name: t('manageTimers.newTemplateName'), 
            segments: [],
            restBetweenSegments: { enabled: false, duration: 60 }
        });
        setLinkedPlanId('');
    };

    const handleDuplicateTemplate = (id: string) => {
        const templateToDuplicate = templates.find(t => t.id === id);
        if (!templateToDuplicate) return;
        const newTemplate: TimerTemplate = {
            ...JSON.parse(JSON.stringify(templateToDuplicate)),
            id: Date.now().toString(),
            name: `${templateToDuplicate.name} (Copy)`,
        };
        setTemplates([...templates, newTemplate]);
    };
    
    const handleShareTemplate = (id: string) => {
        const template = templates.find(t => t.id === id);
        if (!template) return;

        try {
            const dataToShare = { type: 'template', data: compressTemplate(template) };
            const jsonString = JSON.stringify(dataToShare);
            // This trick handles UTF-8 characters correctly during base64 encoding/decoding
            const base64String = btoa(unescape(encodeURIComponent(jsonString)));
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

    const handleSaveTemplate = () => {
        if (!editingTemplate || editingTemplate.name.trim() === '') return;
        
        const exists = templates.some(t => t.id === editingTemplate.id);
        if (exists) {
            setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        } else {
            setTemplates([...templates, editingTemplate]);
        }
        setEditingTemplate(null);
    };
    
    const handleDeleteTemplate = (id: string) => {
        setTemplates(templates.filter(t => t.id !== id));
        if (editingTemplate?.id === id) {
            setEditingTemplate(null);
        }
        setConfirmDeleteId(null);
    }

    const handleSegmentChange = (segId: string, field: keyof TimerSegment, value: any) => {
        if (!editingTemplate) return;
        
        const numValue = parseInt(value, 10);
        const finalValue = isNaN(numValue) ? value : numValue;
        
        setEditingTemplate({
            ...editingTemplate,
            segments: editingTemplate.segments.map(s => s.id === segId ? {...s, [field]: finalValue} : s)
        });
    };

    const handleRestSettingsChange = (field: 'enabled' | 'duration', value: boolean | number) => {
        if (!editingTemplate) return;
        setEditingTemplate({
            ...editingTemplate,
            restBetweenSegments: {
                ...(editingTemplate.restBetweenSegments || { enabled: false, duration: 60 }),
                [field]: value
            }
        });
    };

    const handleMoveSegment = (index: number, direction: 'up' | 'down') => {
        if (!editingTemplate) return;
        const newSegments = [...editingTemplate.segments];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSegments.length) return;
        [newSegments[index], newSegments[targetIndex]] = [newSegments[targetIndex], newSegments[index]];
        setEditingTemplate({ ...editingTemplate, segments: newSegments });
    };
    
    const handleAddSegment = () => {
        if (!editingTemplate) return;
        const newSegment: TimerSegment = { id: Date.now().toString(), name: t('manageTimers.newSegmentName'), duration: 60, type: 'work', sets: 3, workDuration: 30, restDuration: 10 };
        setEditingTemplate({...editingTemplate, segments: [...editingTemplate.segments, newSegment]});
    };
    
    const handleRemoveSegment = (segId: string) => {
        if (!editingTemplate) return;
        setEditingTemplate({...editingTemplate, segments: editingTemplate.segments.filter(s => s.id !== segId)});
    };
    
    const handleLinkPlan = (planId: string) => {
        setLinkedPlanId(planId);
        if (!planId || !editingTemplate) {
            if (editingTemplate) {
                // If unlinking, remove auto-added segments if they exist
                 setEditingTemplate({
                    ...editingTemplate, 
                    segments: editingTemplate.segments.filter(s => s.id !== 'auto-warmup' && s.id !== 'auto-cooldown')
                });
            }
            return;
        }

        const plan = plans.find(p => p.id === planId);
        if (plan) {
            const warmupSegment: TimerSegment = {
                id: 'auto-warmup',
                name: t('manageTimers.autoWarmup'),
                type: 'warmup',
                duration: 300, // 5 minutes
            };
            const planSegments: TimerSegment[] = plan.workoutIds.map(workoutId => {
                const workout = allWorkouts.find(w => w.id === workoutId);
                return {
                    id: Date.now().toString() + workoutId,
                    name: workout?.name || 'Unknown',
                    type: 'work',
                    duration: 0,
                    workoutId: workoutId,
                    sets: 3,
                    workDuration: 45,
                    restDuration: 60,
                };
            });
            const cooldownSegment: TimerSegment = {
                id: 'auto-cooldown',
                name: t('manageTimers.autoCooldown'),
                type: 'cooldown',
                duration: 180, // 3 minutes
            };

            setEditingTemplate({...editingTemplate, segments: [warmupSegment, ...planSegments, cooldownSegment]});
        }
    };

    const navigateBack = () => {
        if (editingTemplate) {
            setEditingTemplate(null);
        } else {
            navigate('dashboard');
        }
    };

    const totalDuration = useMemo(() => {
        if (!editingTemplate) return 0;
        const segmentsDuration = editingTemplate.segments.reduce((acc, seg) => acc + calculateSegmentDuration(seg), 0);
        const restBetweenDuration = (editingTemplate.restBetweenSegments?.enabled && editingTemplate.segments.length > 1) 
            ? editingTemplate.restBetweenSegments.duration * (editingTemplate.segments.length - 1)
            : 0;
        return segmentsDuration + restBetweenDuration;
    }, [editingTemplate]);

    const durationSummary = useMemo(() => {
        if (!editingTemplate) return null;
        const summary = { warmup: 0, work: 0, rest: 0, cooldown: 0 };
        editingTemplate.segments.forEach((seg, index) => {
            if (seg.type === 'work') {
                const sets = seg.sets || 1;
                const work = seg.workDuration || 0;
                const rest = seg.restDuration || 0;
                if (sets > 0) {
                    summary.work += sets * work;
                    summary.rest += Math.max(0, sets - 1) * rest;
                }
            } else {
                summary[seg.type] += seg.duration || 0;
            }

            if (editingTemplate.restBetweenSegments?.enabled && index < editingTemplate.segments.length - 1) {
                summary.rest += editingTemplate.restBetweenSegments.duration || 0;
            }
        });
        return summary;
    }, [editingTemplate]);

    const templateToDelete = templates.find(t => t.id === confirmDeleteId);

    return (
        <div className="p-4 md:p-6">
            <ConfirmModal
                isOpen={!!confirmDeleteId}
                title={t('common.delete') + " " + templateToDelete?.name}
                message={t('manageTimers.deleteConfirmMessage', { name: templateToDelete?.name })}
                onConfirm={() => handleDeleteTemplate(confirmDeleteId!)}
                onCancel={() => setConfirmDeleteId(null)}
            />
            <div className="flex items-center mb-6">
                <button onClick={navigateBack} className="p-2 rounded-full hover:bg-surface-inset mr-4 border-2 border-transparent hover:border-border">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-2xl font-bold">{editingTemplate ? t('manageTimers.editTemplateTitle') : t('manageTimers.title')}</h2>
            </div>
            
            {!editingTemplate ? (
                <div>
                    <button onClick={handleAddNewTemplate} className="w-full mb-6 bg-brand-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-500 transition-colors border-2 border-brand-700 hover:border-brand-500">
                        <PlusIcon /> {t('manageTimers.createNew')}
                    </button>
                    <div className="space-y-3">
                        {templates.map(template => (
                            <div key={template.id} className="bg-surface-raised rounded-lg p-4 flex justify-between items-center">
                                <div onClick={() => handleSelectTemplate(template.id)} className="flex-grow cursor-pointer">
                                    <p className="font-medium">{template.name}</p>
                                    <p className="text-xs text-text-muted">{t('manageTimers.totalDuration')}: {formatDuration(template.segments.reduce((acc, seg) => acc + calculateSegmentDuration(seg), 0))}</p>
                                </div>
                                <div className="flex items-center">
                                    <button onClick={(e) => {e.stopPropagation(); handleShareTemplate(template.id)}} title={t('common.share')} className="p-2 text-text-muted hover:text-text-base border-2 border-transparent rounded-md"><ShareIcon /></button>
                                    <button onClick={(e) => {e.stopPropagation(); handleDuplicateTemplate(template.id)}} title={t('manageTimers.duplicate')} className="p-2 text-text-muted hover:text-text-base border-2 border-transparent rounded-md"><DuplicateIcon /></button>
                                    <button onClick={(e) => {e.stopPropagation(); setConfirmDeleteId(template.id)}} title={t('common.delete')} className="p-2 text-text-muted hover:text-red-500 border-2 border-transparent rounded-md"><TrashIcon /></button>
                                </div>
                            </div>
                        ))}
                         {templates.length === 0 && <p className="text-center text-text-subtle mt-8">{t('manageTimers.noTemplates')}</p>}
                    </div>
                </div>
            ) : (
                <div className="bg-surface-raised rounded-lg p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-muted">{t('manageTimers.templateName')}</label>
                        <input type="text" value={editingTemplate.name} onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} className="w-full bg-surface-inset border border-border rounded-md p-2"/>
                    </div>
                    
                    <div className="mb-4 bg-surface-inset p-3 rounded-lg">
                        <h4 className="font-semibold mb-2 text-center text-brand-400">{t('manageTimers.summary.title')}</h4>
                        <div className="flex justify-around text-center text-sm">
                            <div><p className="text-text-muted">{t('manageTimers.summary.warmup')}</p><p>{formatDuration(durationSummary?.warmup || 0)}</p></div>
                            <div><p className="text-text-muted">{t('manageTimers.summary.work')}</p><p>{formatDuration(durationSummary?.work || 0)}</p></div>
                            <div><p className="text-text-muted">{t('manageTimers.summary.rest')}</p><p>{formatDuration(durationSummary?.rest || 0)}</p></div>
                            <div><p className="text-text-muted">{t('manageTimers.summary.cooldown')}</p><p>{formatDuration(durationSummary?.cooldown || 0)}</p></div>
                        </div>
                        <p className="text-center font-bold text-lg mt-2">{t('manageTimers.totalDuration')}: {formatDuration(totalDuration)}</p>
                    </div>

                    <div className="mb-4">
                         <label className="block text-sm font-medium text-text-muted">{t('manageTimers.linkPlan')}</label>
                         <select
                            value={linkedPlanId}
                            onChange={e => handleLinkPlan(e.target.value)}
                            className="w-full bg-surface-inset border border-border rounded-md p-2 mt-1"
                         >
                            <option value="">{t('manageTimers.linkPlanOptional')}</option>
                            {plans.map(plan => (
                                <option key={plan.id} value={plan.id}>{plan.name}</option>
                            ))}
                         </select>
                         <p className="text-xs text-text-subtle mt-1">{t('manageTimers.linkPlanDescription')}</p>
                    </div>

                    <div className="mb-4 bg-surface-inset p-3 rounded-lg">
                        <h4 className="font-semibold mb-2">{t('manageTimers.restBetweenSegments')}</h4>
                        <div className="flex items-center gap-4">
                             <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input 
                                    type="checkbox" 
                                    className="h-5 w-5 rounded border-border text-brand-600 focus:ring-brand-500 bg-surface-raised"
                                    checked={editingTemplate.restBetweenSegments?.enabled ?? false}
                                    onChange={e => handleRestSettingsChange('enabled', e.target.checked)}
                                />
                                {t('manageTimers.enableRest')}
                             </label>
                            {editingTemplate.restBetweenSegments?.enabled && (
                                <div className="flex items-center gap-2 flex-grow">
                                     <label className="text-sm text-text-muted">{t('manageTimers.restDuration')}</label>
                                     <input 
                                        type="number"
                                        className="w-full bg-surface-raised border border-border p-1 rounded-md text-center"
                                        value={editingTemplate.restBetweenSegments?.duration ?? 60}
                                        onChange={e => handleRestSettingsChange('duration', parseInt(e.target.value, 10))}
                                     />
                                </div>
                            )}
                        </div>
                    </div>

                    <h4 className="font-semibold mb-2">{t('manageTimers.segments')}</h4>
                    <div className="space-y-3 mb-4">
                    {editingTemplate.segments.map((seg, index) => (
                        <div key={seg.id} className="bg-surface-inset p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex-grow mr-2">
                                    <input 
                                        type="text" 
                                        value={seg.name} 
                                        onChange={e => handleSegmentChange(seg.id, 'name', e.target.value)} 
                                        placeholder={t('manageTimers.segmentNamePlaceholder')}
                                        className="bg-surface-raised p-2 rounded-md text-text-base font-semibold w-full border border-border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
                                    <p className="text-xs text-text-subtle mt-1 pl-1">{t('manageTimers.segmentDuration')}: {formatDuration(calculateSegmentDuration(seg))}</p>
                                </div>
                                <div className="flex">
                                    <button onClick={() => handleMoveSegment(index, 'up')} disabled={index === 0} className="p-1 text-text-muted hover:text-text-base disabled:opacity-30 border-2 border-transparent rounded-md"><ChevronUpIcon /></button>
                                    <button onClick={() => handleMoveSegment(index, 'down')} disabled={index === editingTemplate.segments.length - 1} className="p-1 text-text-muted hover:text-text-base disabled:opacity-30 border-2 border-transparent rounded-md"><ChevronDownIcon /></button>
                                    <button onClick={() => handleRemoveSegment(seg.id)} className="p-1 text-text-muted hover:text-red-500 border-2 border-transparent rounded-md"><TrashIcon /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-text-muted block mb-1">{t('manageTimers.segment.type')}</label>
                                    <select value={seg.type} onChange={e => handleSegmentChange(seg.id, 'type', e.target.value)} className="w-full bg-surface-raised border border-border p-2 rounded-md">
                                        <option value="warmup">{t('manageTimers.segment.types.warmup')}</option>
                                        <option value="work">{t('manageTimers.segment.types.work')}</option>
                                        <option value="rest">{t('manageTimers.segment.types.rest')}</option>
                                        <option value="cooldown">{t('manageTimers.segment.types.cooldown')}</option>
                                    </select>
                                </div>

                                {seg.type === 'work' && (
                                    <div>
                                        <label className="text-sm text-text-muted block mb-1">{t('manageTimers.segment.exercise')}</label>
                                        <select value={seg.workoutId || ''} onChange={e => handleSegmentChange(seg.id, 'workoutId', e.target.value)} className="w-full bg-surface-raised border border-border p-2 rounded-md">
                                            <option value="">{t('manageTimers.segment.noExercise')}</option>
                                            {allWorkouts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                            
                            {seg.type === 'work' ? (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div>
                                        <label className="text-xs text-text-muted block">{t('manageTimers.segment.sets')}</label>
                                        <input type="number" value={seg.sets || ''} onChange={e => handleSegmentChange(seg.id, 'sets', e.target.value)} className="w-full bg-surface-raised border border-border p-1 rounded-md text-center"/>
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-muted block">{t('manageTimers.segment.workDuration')} (s)</label>
                                        <input type="number" value={seg.workDuration || ''} onChange={e => handleSegmentChange(seg.id, 'workDuration', e.target.value)} className="w-full bg-surface-raised border border-border p-1 rounded-md text-center"/>
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-muted block">{t('manageTimers.segment.restDuration')} (s)</label>
                                        <input type="number" value={seg.restDuration || ''} onChange={e => handleSegmentChange(seg.id, 'restDuration', e.target.value)} className="w-full bg-surface-raised border border-border p-1 rounded-md text-center"/>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 space-y-2">
                                     <div>
                                        <label className="text-sm text-text-muted block mb-1">{t('manageTimers.duration')} (s)</label>
                                        <input type="number" value={seg.duration || ''} onChange={e => handleSegmentChange(seg.id, 'duration', e.target.value)} className="w-full bg-surface-raised border border-border p-2 rounded-md"/>
                                     </div>
                                     {(seg.type === 'warmup' || seg.type === 'cooldown') && (
                                        <div>
                                            <label className="text-sm text-text-muted block mb-1">{t('manageTimers.segment.interval')} (s)</label>
                                            <input type="number" value={seg.interval || ''} placeholder={t('common.optional')} onChange={e => handleSegmentChange(seg.id, 'interval', e.target.value)} className="w-full bg-surface-raised border border-border p-2 rounded-md"/>
                                        </div>
                                     )}
                                </div>
                            )}
                        </div>
                    ))}
                    </div>
                    <button onClick={handleAddSegment} className="text-sm text-brand-400 hover:text-brand-300 font-semibold mb-6 border-2 border-brand-700/50 hover:border-brand-600/50 rounded-lg px-3 py-1">+ {t('manageTimers.addSegment')}</button>
                    
                    <div className="flex gap-2">
                        <button onClick={handleSaveTemplate} className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-500 flex-grow font-semibold border-2 border-brand-700 hover:border-brand-500">{t('manageTimers.saveTemplate')}</button>
                        <button onClick={() => setEditingTemplate(null)} className="bg-surface-inset text-text-base px-4 py-2 rounded-md hover:bg-opacity-80 border-2 border-border">{t('common.cancel')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTimers;
