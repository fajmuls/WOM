

import React from 'react';
import i18n from '../i18n';
import { LoaderIcon, CheckIcon, InfoIcon } from './icons';

type ImportState = {
    status: 'confirm' | 'loading' | 'success' | 'error';
    title?: string;
    message?: string;
    onConfirmAction?: () => void;
};

interface ImportDataModalProps {
    state: ImportState;
    onClose: () => void;
}

const ImportDataModal: React.FC<ImportDataModalProps> = ({ state, onClose }) => {
    const t = i18n.t.bind(i18n);
    const { status, title, message, onConfirmAction } = state;

    const renderContent = () => {
        switch (status) {
            case 'confirm':
                return (
                    <>
                        <p className="text-text-base my-4 whitespace-pre-wrap">{message}</p>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-surface-inset text-text-base font-bold py-3 px-4 rounded-lg hover:bg-border transition-colors border-2 border-border"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={onConfirmAction}
                                className="flex-1 bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-500 transition-colors border-2 border-brand-700 hover:border-brand-500"
                            >
                                {t('importModal.addButton')}
                            </button>
                        </div>
                    </>
                );
            case 'loading':
                return (
                    <>
                        <LoaderIcon className="w-12 h-12 text-brand-400 mx-auto" />
                        <p className="mt-4 text-text-base">{t('importDataModal.loading')}</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckIcon className="w-10 h-10 text-green-400" />
                        </div>
                        <p className="text-text-base mt-4">{message || t('importDataModal.successMessage')}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-500 transition-colors border-2 border-brand-700 hover:border-brand-500"
                        >
                            {t('importDataModal.doneButton')}
                        </button>
                    </>
                );
            case 'error':
                 return (
                    <>
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                           <InfoIcon className="h-10 w-10 text-red-400" />
                        </div>
                        <p className="text-sm text-text-muted mt-4 bg-surface-inset p-2 rounded-md">{message}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 w-full bg-surface-inset text-text-base font-bold py-3 px-4 rounded-lg hover:bg-border transition-colors border-2 border-border"
                        >
                            {t('importDataModal.closeButton')}
                        </button>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-surface-raised rounded-2xl p-6 shadow-xl w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-2 text-brand-400">{title || 'Status'}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default ImportDataModal;
