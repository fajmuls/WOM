import React, { useState, useEffect } from 'react';
import { PlayIcon } from './icons';
import { TimerTemplate } from '../types';
import i18n from '../i18n';

const QuickTimer: React.FC<{
    onStart: (minutes: number, seconds: number) => void;
}> = ({ onStart }) => {
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const t = i18n.t.bind(i18n);

    const handleStart = () => {
        onStart(minutes, seconds);
    };

    return (
        <div>
            <div className="flex justify-center items-center my-6">
                <p className="text-7xl font-mono text-brand-400 tracking-widest">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
            </div>
            <div className="flex justify-center items-center space-x-4 mb-6">
                <div>
                    <label htmlFor="minutes" className="block text-sm font-medium text-text-muted">{t('timer.minutes')}</label>
                    <input 
                        id="minutes" 
                        type="number" 
                        value={minutes} 
                        onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value, 10)) || 0)} 
                        className="bg-surface-inset border border-border text-text-base rounded-md p-2 w-24 text-center"
                    />
                </div>
                <div>
                    <label htmlFor="seconds" className="block text-sm font-medium text-text-muted">{t('timer.seconds')}</label>
                    <input 
                        id="seconds" 
                        type="number" 
                        value={seconds} 
                        onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value, 10))) || 0)} 
                        className="bg-surface-inset border border-border text-text-base rounded-md p-2 w-24 text-center"
                    />
                </div>
            </div>
            <div className="flex justify-center space-x-4">
                <button onClick={handleStart} className="p-4 bg-brand-600 rounded-full hover:bg-brand-500 text-white border-4 border-brand-700 hover:border-brand-500">
                    <PlayIcon />
                </button>
            </div>
        </div>
    );
};

const Timer: React.FC<{ 
    templates: TimerTemplate[];
    onStartTemplate: (template: TimerTemplate) => void;
    onStartQuickTimer: (minutes: number, seconds: number) => void;
}> = ({ templates, onStartTemplate, onStartQuickTimer }) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const t = i18n.t.bind(i18n);

    useEffect(() => {
        if (templates.length > 0 && !selectedTemplateId) {
            setSelectedTemplateId(templates[0].id);
        }
         if (templates.length === 0 && selectedTemplateId) {
            setSelectedTemplateId('');
        }
    }, [templates, selectedTemplateId]);

    const handleStartTemplate = () => {
        const template = templates.find(t => t.id === selectedTemplateId);
        if (template) {
            if (template.segments.length > 0) {
                 onStartTemplate(template);
            } else {
                alert(t('timer.emptyTemplateWarning'));
            }
        }
    };
    
    return (
        <div className="bg-surface-raised rounded-lg p-6 shadow-lg space-y-8 divide-y divide-border">
            <div>
                <h2 className="text-xl font-bold text-center mb-4 text-text-base">{t('timer.templatesTitle')}</h2>
                 {templates.length > 0 ? (
                    <div className="flex gap-2">
                        <select
                            value={selectedTemplateId}
                            onChange={e => setSelectedTemplateId(e.target.value)}
                            className="w-full bg-surface-inset border border-border rounded-md p-2 focus:ring-brand-500 focus:border-brand-500 text-text-base"
                        >
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <button onClick={handleStartTemplate} className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-500 font-semibold flex-shrink-0 border-2 border-brand-700 hover:border-brand-500">{t('timer.start')}</button>
                    </div>
                 ) : (
                    <p className="text-center text-text-subtle">{t('timer.noTemplates')}</p>
                 )}
            </div>
            <div className="pt-8">
                <h2 className="text-xl font-bold text-center text-text-base">{t('timer.quickTimerTitle')}</h2>
                <QuickTimer onStart={onStartQuickTimer} />
            </div>
        </div>
    );
};

export default Timer;