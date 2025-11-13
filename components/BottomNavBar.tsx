import React from 'react';
import { View } from '../types';
import { HomeIcon, ClipboardListIcon, LayoutGridIcon, ClockIcon, CogIcon } from './icons';
import i18n from '../i18n';

interface BottomNavBarProps {
    currentView: View;
    navigate: (view: View) => void;
}

const NavItem: React.FC<{
    view: View;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ view, label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 border-t-4 ${
                isActive ? 'border-brand-400 text-brand-400' : 'border-transparent text-text-muted hover:text-text-base'
            }`}
        >
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, navigate }) => {
    const t = i18n.t.bind(i18n);

    const mainViews: View[] = ['dashboard', 'daily_log', 'manage_workouts', 'manage_timers', 'settings'];
    const isMainView = mainViews.includes(currentView);

    if (!isMainView) {
        // Don't show the nav bar on sub-pages like body_tracker or post_workout_summary
        return null;
    }
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-raised border-t border-border shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex justify-around">
                <NavItem
                    view="dashboard"
                    label={t('nav.dashboard')}
                    icon={<HomeIcon />}
                    isActive={currentView === 'dashboard'}
                    onClick={() => navigate('dashboard')}
                />
                <NavItem
                    view="daily_log"
                    label={t('nav.journal')}
                    icon={<ClipboardListIcon />}
                    isActive={currentView === 'daily_log'}
                    onClick={() => navigate('daily_log')}
                />
                <NavItem
                    view="manage_workouts"
                    label={t('nav.library')}
                    icon={<LayoutGridIcon />}
                    isActive={currentView === 'manage_workouts'}
                    onClick={() => navigate('manage_workouts')}
                />
                <NavItem
                    view="manage_timers"
                    label={t('nav.timers')}
                    icon={<ClockIcon />}
                    isActive={currentView === 'manage_timers'}
                    onClick={() => navigate('manage_timers')}
                />
                 <NavItem
                    view="settings"
                    label={t('nav.settings')}
                    icon={<CogIcon />}
                    isActive={currentView === 'settings'}
                    onClick={() => navigate('settings')}
                />
            </div>
        </nav>
    );
};

export default BottomNavBar;