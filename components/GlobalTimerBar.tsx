import React from 'react';
import { ActiveTimerState, TimerSegment } from '../types';
import { PauseIcon, PlayIcon, StopIcon } from './icons';
import i18n from '../i18n';

const getSegmentColors = (segmentType?: TimerSegment['type']) => {
    switch (segmentType) {
        case 'work': return { bg: 'bg-red-500', text: 'text-red-400' };
        case 'rest': return { bg: 'bg-blue-500', text: 'text-blue-400' };
        case 'warmup': return { bg: 'bg-yellow-500', text: 'text-yellow-400' };
        case 'cooldown': return { bg: 'bg-purple-500', text: 'text-purple-400' };
        default: return { bg: 'bg-brand-500', text: 'text-brand-400' };
    }
};

const GlobalTimerBar: React.FC<{
    timerState: ActiveTimerState;
    onPauseResume: () => void;
    onStop: () => void;
}> = ({ timerState, onPauseResume, onStop }) => {
    let displayTime = '00:00';
    let progress = 0;
    
    let currentSegmentName = '';
    let setInfo = '';
    let totalTimeDisplay = '';
    let segmentType: TimerSegment['type'] | undefined = undefined;


    if (timerState.type === 'quick' && timerState.totalSeconds !== undefined) {
        currentSegmentName = i18n.t('timer.quickTimerTitle');
        const minutes = Math.floor(timerState.totalSeconds / 60);
        const seconds = timerState.totalSeconds % 60;
        displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        progress = timerState.initialDuration ? ((timerState.initialDuration - timerState.totalSeconds) / timerState.initialDuration) * 100 : 0;
    }

    if (timerState.type === 'template' && timerState.flattenedSegments && timerState.currentSegmentIndex !== undefined && timerState.timeInSegment !== undefined) {
        const segment = timerState.flattenedSegments[timerState.currentSegmentIndex];
        currentSegmentName = segment.name;
        segmentType = segment.originalSegmentType;
        if (segment.setNumber && segment.totalSets) {
            setInfo = `Set ${segment.setNumber}/${segment.totalSets}`;
        }
        
        const segMinutes = Math.floor(timerState.timeInSegment / 60);
        const segSeconds = timerState.timeInSegment % 60;
        displayTime = `${String(segMinutes).padStart(2, '0')}:${String(segSeconds).padStart(2, '0')}`;
        
        const totalMinutes = Math.floor((timerState.totalDuration! - timerState.timeElapsed!) / 60);
        const totalSeconds = (timerState.totalDuration! - timerState.timeElapsed!) % 60;
        totalTimeDisplay = `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
        
        progress = timerState.totalDuration ? (timerState.timeElapsed! / timerState.totalDuration) * 100 : 0;
    }
    
    const colors = getSegmentColors(segmentType);

    return (
        <div className="bg-surface-raised p-3 shadow-lg fixed top-0 left-0 right-0 z-30 animate-view-in">
             <div className="w-full bg-surface-inset rounded-full h-1 absolute top-0 left-0">
                <div className={`${colors.bg} h-1 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
            </div>
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-baseline">
                        <div>
                            <p className={`font-bold ${colors.text} truncate text-lg leading-tight`}>{currentSegmentName}</p>
                            {setInfo && <p className="text-xs text-text-muted leading-tight">{setInfo}</p>}
                        </div>
                        {totalTimeDisplay && <p className="text-sm font-mono text-text-muted">{totalTimeDisplay}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                     <p className="text-3xl font-mono tracking-wider text-text-base w-28 text-center">{displayTime}</p>
                     <button onClick={onPauseResume} className="p-3 bg-surface-inset text-text-base rounded-full hover:bg-border transition-colors duration-200 border-2 border-border">
                        {timerState.isActive ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5"/>}
                    </button>
                    <button onClick={onStop} className="p-3 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/40 transition-colors duration-200 border-2 border-red-500/50">
                        <StopIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalTimerBar;