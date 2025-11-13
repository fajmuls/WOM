
import React, { useState } from 'react';
import { View, MusicState, PlaylistItem } from '../types';
import { ChevronLeftIcon, TrashIcon, LinkIcon, SpotifyIcon, YoutubeMusicIcon } from './icons';
import i18n from '../i18n';

interface MusicPlayerProps {
    musicState: MusicState;
    setMusicState: (state: MusicState) => void;
    navigate: (view: View) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicState, setMusicState, navigate }) => {
    const [inputValue, setInputValue] = useState('');
    const [itemType, setItemType] = useState<'single' | 'playlist'>('single');
    const t = i18n.t.bind(i18n);

    const isValidUrl = (url: string): boolean => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('spotify.com') || urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
        } catch (error) {
            return false;
        }
    };

    const handleAddItem = () => {
        if (!inputValue.trim() || !isValidUrl(inputValue.trim())) {
            alert(t('musicPlayer.invalidUrlWarning'));
            return;
        }
        const newItem: PlaylistItem = {
            id: Date.now().toString(),
            url: inputValue.trim(),
            type: itemType,
        };
        const newPlaylist = [...musicState.playlist, newItem];
        setMusicState({
            ...musicState,
            playlist: newPlaylist,
        });
        setInputValue('');
    };

    const handleRemoveItem = (itemId: string) => {
        const newPlaylist = musicState.playlist.filter(item => item.id !== itemId);
        setMusicState({
            ...musicState,
            playlist: newPlaylist,
        });
    };
    
    const getLinkTitle = (url: string) => {
        try {
            const hostname = new URL(url).hostname;
            if (hostname.includes('spotify.com')) return t('musicPlayer.spotifyLink');
            if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return t('musicPlayer.ytMusicLink');
        } catch {}
        return t('musicPlayer.unknownLink');
    };

    const renderPlaylist = (type: 'single' | 'playlist') => {
        const items = musicState.playlist.filter(item => item.type === type);
        return (
            <div className="space-y-2">
                {items.length > 0 ? items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-md bg-surface-inset">
                        <span className="font-mono text-text-muted text-sm">{String(index + 1).padStart(2, '0')}</span>
                        <p className="flex-grow truncate" title={item.url}>{getLinkTitle(item.url)}</p>
                        <div className="flex items-center gap-1">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1 text-brand-400 hover:text-brand-300"><LinkIcon className="w-5 h-5"/></a>
                            <button onClick={() => handleRemoveItem(item.id)} className="p-1 text-text-muted hover:text-red-500 border-2 border-transparent rounded-md"><TrashIcon /></button>
                        </div>
                    </div>
                )) : <p className="text-center text-text-subtle py-4">{t('musicPlayer.emptyList')}</p>}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('dashboard')} className="p-2 rounded-full hover:bg-surface-inset mr-4 border-2 border-transparent hover:border-border">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-2xl font-bold">{t('musicPlayer.title')}</h2>
            </div>

            <div className="bg-surface-raised rounded-lg p-4 mb-6">
                 <h3 className="text-lg font-semibold mb-3 text-center">{t('musicPlayer.platforms')}</h3>
                 <div className="flex justify-center items-center gap-6">
                    <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 transition-colors">
                        <SpotifyIcon />
                    </a>
                     <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 transition-colors">
                        <YoutubeMusicIcon />
                    </a>
                 </div>
            </div>
            
            <div className="bg-surface-raised rounded-lg p-4">
                 <h3 className="text-lg font-semibold mb-2">{t('musicPlayer.addToPlaylist')}</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('musicPlayer.placeholder')}
                        className="flex-grow bg-surface-inset border border-border rounded-md p-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <button onClick={handleAddItem} className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-500 font-semibold border-2 border-brand-700 hover:border-brand-500">{t('common.add')}</button>
                </div>
                 <div className="flex gap-4 my-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="itemType" value="single" checked={itemType === 'single'} onChange={() => setItemType('single')} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-border"/>
                        {t('musicPlayer.single')}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="itemType" value="playlist" checked={itemType === 'playlist'} onChange={() => setItemType('playlist')} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-border"/>
                        {t('musicPlayer.playlist')}
                    </label>
                 </div>
                 <p className="text-xs text-text-subtle mt-2 mb-4">
                    {t('musicPlayer.note')}
                </p>
                
                 <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{t('musicPlayer.singles')}</h3>
                        {renderPlaylist('single')}
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">{t('musicPlayer.playlists')}</h3>
                        {renderPlaylist('playlist')}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default MusicPlayer;