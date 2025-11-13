
import React from 'react';
import i18n from '../i18n';
import { WarningIcon } from './icons';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
    const t = i18n.t.bind(i18n);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-surface-raised rounded-2xl p-6 shadow-xl w-full max-w-sm text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WarningIcon className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-text-base">{title || t('confirmModal.defaultTitle')}</h2>
                <p className="text-text-muted">{message}</p>
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-surface-inset text-text-base font-bold py-3 px-4 rounded-lg hover:bg-border transition-colors border-2 border-border"
                    >
                        {t('confirmModal.cancelButton')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-500 transition-colors border-2 border-red-700 hover:border-red-500"
                    >
                        {t('confirmModal.confirmButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
