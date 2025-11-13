
import React, { useState } from 'react';
import { View, AppSettings, SoundConfig, Language } from '../types';
import { ChevronLeftIcon, PlayIcon, InfoIcon, ChevronDownIcon, ChevronUpIcon, BellIcon, ScaleIcon, CalendarIcon, ChevronRightIcon, MusicIcon, RefreshCwIcon } from './icons';
import i18n from '../i18n';
import ConfirmModal from './ConfirmModal';

interface SettingsProps {
    settings: AppSettings;
    setSettings: (settings: AppSettings) => void;
    defaultSettings: AppSettings;
    navigate: (view: View) => void;
    playSound: (soundConfig: SoundConfig) => void;
    onOpenImportLinkModal: () => void;
    onFileSelected: (file: File) => void;
}

const SettingCard: React.FC<{children: React.ReactNode, title?: string, className?: string}> = ({ children, title, className }) => (
    <div className={`bg-surface-raised rounded-2xl p-4 ${className} relative`}>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
    </div>
);

const SoundSettingsEditor: React.FC<Omit<SettingsProps, 'navigate' | 'onOpenImportLinkModal' | 'onFileSelected' | 'defaultSettings'>> = ({ settings, setSettings, playSound }) => {
    const [expandedSound, setExpandedSound] = useState<string | null>(null);
    const t = i18n.t.bind(i18n);

    const handleSoundChange = (soundKey: keyof AppSettings['sounds'], field: keyof SoundConfig, value: string | number) => {
        const newSoundConfig = {
            ...settings.sounds[soundKey],
            [field]: field === 'type' ? value : Number(value)
        };
        setSettings({
            ...settings,
            sounds: {
                ...settings.sounds,
                [soundKey]: newSoundConfig
            }
        });
    };
    
    const soundKeys = Object.keys(settings.sounds).filter(k => settings.sounds[k as keyof AppSettings['sounds']]) as (keyof AppSettings['sounds'])[];


    return (
        <SettingCard title={t('settings.sounds.title')}>
            <div className="space-y-2 divide-y divide-border">
                {soundKeys.map(key => (
                    <div key={key} className="pt-4 first:pt-0">
                        <button onClick={() => setExpandedSound(expandedSound === key ? null : key)} className="w-full flex justify-between items-center font-medium text-left border-2 border-transparent p-2 rounded-lg hover:bg-surface-inset">
                            <span>{t(`settings.sounds.types.${key}`)}</span>
                            {expandedSound === key ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                        {expandedSound === key && (
                            <div className="mt-4 space-y-4 bg-surface-inset p-3 rounded-lg animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1">{t('settings.sounds.frequency')}</label>
                                        <input type="number" value={settings.sounds[key]!.frequency} onChange={e => handleSoundChange(key, 'frequency', e.target.value)} className="w-full bg-surface-raised border border-border rounded-md p-2 text-sm" />
                                    </div>
                                     <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1">{t('settings.sounds.duration')}</label>
                                        <input type="number" step="0.05" value={settings.sounds[key]!.duration} onChange={e => handleSoundChange(key, 'duration', e.target.value)} className="w-full bg-surface-raised border border-border rounded-md p-2 text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1">{t('settings.sounds.waveform')}</label>
                                    <select value={settings.sounds[key]!.type} onChange={e => handleSoundChange(key, 'type', e.target.value)} className="w-full bg-surface-raised border border-border rounded-md p-2 text-sm">
                                        {(['sine', 'square', 'sawtooth', 'triangle'] as const).map(type => (
                                            <option key={type} value={type}>{t(`settings.sounds.waveforms.${type}`)}</option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={() => playSound(settings.sounds[key]!)} className="w-full flex items-center justify-center gap-2 bg-brand-700/50 text-brand-300 text-sm font-semibold py-2 rounded-md hover:bg-brand-700/80 border-2 border-brand-700/80">
                                    <PlayIcon className="w-4 h-4" /> {t('settings.sounds.test')}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </SettingCard>
    );
};


const Settings: React.FC<SettingsProps> = ({ settings, setSettings, defaultSettings, navigate, playSound, onOpenImportLinkModal, onFileSelected }) => {
    const [notificationStatus, setNotificationStatus] = useState(Notification.permission);
    const [showDataHelp, setShowDataHelp] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const t = i18n.t.bind(i18n);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, volume: parseFloat(e.target.value) });
    };

    const handleThemeChange = (theme: 'dark' | 'light' | 'faztheme' | 'aritheme') => {
        setSettings({ ...settings, theme });
    };

    const handleLanguageChange = (lang: Language) => {
        i18n.changeLanguage(lang);
        setSettings({ ...settings, language: lang });
    };
    
    const handleResetSettings = () => {
      setSettings(defaultSettings);
      setIsResetConfirmOpen(false);
    }

    const handleExportData = () => {
        const dataToExport: Record<string, any> = {};
        const keysToExport = ['workouts', 'dailyLogs', 'timerTemplates', 'musicState', 'workoutSchedules', 'workoutPlans', 'bodyMeasurements', 'workoutSettings', 'workoutCategories'];
        
        keysToExport.forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                dataToExport[key] = JSON.parse(item);
            }
        });

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(dataToExport, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `workout-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };
    
    return (
        <div className="p-4 md:p-6">
            <ConfirmModal
              isOpen={isResetConfirmOpen}
              title={t('settings.reset.confirmTitle')}
              message={t('settings.reset.confirmMessage')}
              onConfirm={handleResetSettings}
              onCancel={() => setIsResetConfirmOpen(false)}
            />
            <header className="flex items-center mb-6">
                <h2 className="text-3xl font-bold">{t('settings.title')}</h2>
            </header>

            <div className="space-y-4">
                <SettingCard title={t('settings.general.title')}>
                    <div className="space-y-4 divide-y divide-border">
                        <div className="flex items-center justify-between pt-4 first:pt-0">
                            <label className="font-medium">{t('settings.theme.title')}</label>
                             <div className="flex gap-1 p-1 bg-surface-inset rounded-lg">
                               <button onClick={() => handleThemeChange('dark')} className={`px-3 py-1 text-sm rounded-md border-2 ${settings.theme === 'dark' ? 'bg-brand-600 text-white border-brand-700' : 'text-text-muted border-transparent'}`}>Dark</button>
                               <button onClick={() => handleThemeChange('light')} className={`px-3 py-1 text-sm rounded-md border-2 ${settings.theme === 'light' ? 'bg-brand-600 text-white border-brand-700' : 'text-text-muted border-transparent'}`}>Light</button>
                               <button onClick={() => handleThemeChange('faztheme')} className={`px-3 py-1 text-sm rounded-md border-2 ${settings.theme === 'faztheme' ? 'bg-brand-600 text-white border-brand-700' : 'text-text-muted border-transparent'}`}>Faz</button>
                               <button onClick={() => handleThemeChange('aritheme')} className={`px-3 py-1 text-sm rounded-md border-2 ${settings.theme === 'aritheme' ? 'bg-brand-600 text-white border-brand-700' : 'text-text-muted border-transparent'}`}>{t('settings.theme.AriTheme')}</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 first:pt-0">
                            <label className="font-medium">{t('settings.language.title')}</label>
                            <div className="flex gap-2 p-1 bg-surface-inset rounded-lg">
                               <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1 text-sm rounded-md border-2 ${settings.language === 'en' ? 'bg-brand-600 text-white border-brand-700' : 'text-text-muted border-transparent'}`}>EN</button>
                               <button onClick={() => handleLanguageChange('id')} className={`px-3 py-1 text-sm rounded-md border-2 ${settings.language === 'id' ? 'bg-brand-600 text-white border-brand-700' : 'text-text-muted border-transparent'}`}>ID</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 first:pt-0">
                             <label className="font-medium">{t('settings.reset.title')}</label>
                             <button onClick={() => setIsResetConfirmOpen(true)} className="flex items-center gap-2 bg-surface-inset text-text-muted font-bold py-2 px-3 rounded-lg hover:bg-border transition-colors border-2 border-border text-sm">
                                <RefreshCwIcon className="w-4 h-4" />
                                {t('settings.reset.button')}
                            </button>
                        </div>
                    </div>
                </SettingCard>

                <SettingCard title={t('settings.features.title')}>
                    <div className="space-y-2">
                        <button onClick={() => navigate('body_tracker')} className="w-full flex items-center justify-between text-left border-2 bg-surface-inset hover:bg-border border-border rounded-lg p-3 transition-colors">
                            <div className="flex items-center gap-3">
                                <ScaleIcon className="w-5 h-5 text-brand-400" />
                                <span className="font-medium">{t('dashboard.bodyTracker.title')}</span>
                            </div>
                            <ChevronRightIcon className="text-text-subtle" />
                        </button>
                        <button onClick={() => navigate('music_player')} className="w-full flex items-center justify-between text-left border-2 bg-surface-inset hover:bg-border border-border rounded-lg p-3 transition-colors">
                            <div className="flex items-center gap-3">
                                <MusicIcon className="w-5 h-5 text-brand-400" />
                                <span className="font-medium">{t('dashboard.musicPlayer.title')}</span>
                            </div>
                            <ChevronRightIcon className="text-text-subtle" />
                        </button>
                    </div>
                </SettingCard>
                
                <SettingCard title={t('settings.offline.title')}>
                    <p className="text-sm text-text-muted">{t('settings.offline.description')}</p>
                </SettingCard>

                <SettingCard title={t('settings.volume.title')}>
                     <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.volume}
                            onChange={handleVolumeChange}
                            className="w-full h-2 bg-surface-inset rounded-lg appearance-none cursor-pointer accent-brand-500"
                        />
                        <span className="font-mono text-lg w-14 text-center bg-surface-inset rounded-md py-1">{(settings.volume * 100).toFixed(0)}%</span>
                    </div>
                </SettingCard>
                
                <SoundSettingsEditor settings={settings} setSettings={setSettings} playSound={playSound} defaultSettings={defaultSettings} />

                 <SettingCard title={t('settings.data.title')}>
                    <button onClick={() => setShowDataHelp(!showDataHelp)} className="absolute top-4 right-4 text-text-muted hover:text-brand-400 p-1 border-2 border-transparent rounded-full">
                        {showDataHelp ? <ChevronUpIcon className="w-5 h-5"/> : <InfoIcon className="w-5 h-5" />}
                    </button>
                    <p className="text-sm text-text-muted mb-4 pr-8">{t('settings.data.description')}</p>
                    {showDataHelp && (
                        <div 
                            className="bg-surface-inset p-3 rounded-lg text-sm text-text-muted mb-4 animate-fade-in"
                            dangerouslySetInnerHTML={{ __html: t('settings.data.howToDetails') }}
                        >
                        </div>
                    )}
                    <div className="space-y-2">
                        <div className="flex gap-4">
                            <button onClick={handleExportData} className="flex-1 bg-brand-700 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-600 transition-colors border-2 border-brand-800 hover:border-brand-600">{t('settings.data.export')}</button>
                            <label className="flex-1 bg-surface-inset text-text-base font-bold py-2.5 px-4 rounded-lg hover:bg-border transition-colors text-center cursor-pointer border-2 border-border">
                                {t('settings.data.importFile')}
                                <input type="file" hidden accept=".json" onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        onFileSelected(e.target.files[0]);
                                    }
                                    e.target.value = '';
                                }} />
                            </label>
                        </div>
                        <button onClick={onOpenImportLinkModal} className="w-full bg-surface-inset text-text-base font-bold py-2.5 px-4 rounded-lg hover:bg-border transition-colors border-2 border-border">
                            {t('settings.data.importFromLink')}
                        </button>
                    </div>
                </SettingCard>
                
                <div className="text-center text-text-subtle text-sm pt-4">
                    {t('settings.version')}: 2.2.0
                </div>
            </div>
        </div>
    );
};

export default Settings;
