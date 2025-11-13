
import React, { useState, useEffect, useRef } from 'react';
import { SoundConfig } from '../types';
import { StopIcon } from './icons';
import i18n from '../i18n';

interface SetTimerModalProps {
    isOpen: boolean;
    duration: number;
    onClose: () => void;
    playSound: (soundConfig: SoundConfig) => void;
}

const SetTimerModal: React.FC<SetTimerModalProps> = ({ isOpen, duration, onClose, playSound }) => {
    const [remainingTime, setRemainingTime] = useState(duration);
    const intervalRef = useRef<number | null>(null);
    const t = i18n.t.bind(i18n);

    useEffect(() => {
        if (isOpen) {
            setRemainingTime(duration);
        }
    }, [isOpen, duration]);

    useEffect(() => {
        if (isOpen && remainingTime > 0) {
            intervalRef.current = window.setInterval(() => {
                setRemainingTime(prev => prev - 1);
            }, 1000);
        } else if (remainingTime <= 0 && isOpen) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            playSound({ frequency: 1200, duration: 0.5, type: 'sine' });
            onClose();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isOpen, remainingTime, playSound, onClose]);

    if (!isOpen) {
        return null;
    }
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const progress = (duration - remainingTime) / duration * 100;

    return (
        <div className="fixed inset-0 bg-surface-base bg-opacity-95 flex flex-col items-center justify-center z-50 animate-fade-in p-4">
            <div className="w-full bg-surface-raised rounded-full h-2 absolute top-0 left-0">
                <div className="bg-brand-500 h-2 rounded-full transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
            </div>

            <h2 className="text-3xl font-bold text-text-muted mb-8">{t('setTimerModal.title')}</h2>
            
            <p className="text-8xl md:text-9xl font-mono text-brand-400 tracking-widest">
                 {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>

            <button 
                onClick={onClose} 
                className="mt-12 bg-red-600/20 text-red-400 font-bold py-3 px-6 rounded-lg hover:bg-red-600/40 transition-colors border-2 border-red-500/50 flex items-center gap-2"
            >
                <StopIcon /> {t('setTimerModal.close')}
            </button>
        </div>
    );
};

export default SetTimerModal;
