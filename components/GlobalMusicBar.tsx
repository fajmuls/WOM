import React from 'react';
import { View } from '../types';
import { MusicIcon } from './icons';
import i18n from '../i18n';

interface GlobalMusicBarProps {
    navigate: (view: View) => void;
}

const GlobalMusicBar: React.FC<GlobalMusicBarProps> = ({ navigate }) => {
    return (
        <div 
            onClick={() => navigate('music_player')}
            className="fixed bottom-0 left-0 right-0 bg-surface-inset p-2 shadow-lg cursor-pointer hover:bg-border transition-colors duration-200 z-20 animate-fade-in-up"
        >
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
                <MusicIcon className="w-5 h-5 text-brand-400" />
                <p className="font-semibold text-text-base text-sm">{i18n.t('musicPlayer.nowPlaying')}</p>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default GlobalMusicBar;