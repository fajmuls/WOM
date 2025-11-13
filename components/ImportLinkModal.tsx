
import React, { useState } from 'react';
import i18n from '../i18n';

interface ImportLinkModalProps {
    onImport: (link: string) => void;
    onCancel: () => void;
}

const ImportLinkModal: React.FC<ImportLinkModalProps> = ({ onImport, onCancel }) => {
    const [link, setLink] = useState('');
    const t = i18n.t.bind(i18n);

    const handleImportClick = () => {
        if (link.trim()) {
            onImport(link.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-surface-raised rounded-2xl p-6 shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-brand-400 text-center">{t('importLinkModal.title')}</h2>
                <textarea
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={t('importLinkModal.placeholder')}
                    className="w-full bg-surface-inset border-2 border-border rounded-lg p-3 h-24 resize-none focus:ring-brand-500 focus:border-brand-500 transition mb-4"
                />
                <div className="flex gap-4">
                    <button 
                        onClick={onCancel} 
                        className="flex-1 bg-surface-inset text-text-base font-bold py-3 px-4 rounded-lg hover:bg-border transition-colors border-2 border-border"
                    >
                        {t('common.cancel')}
                    </button>
                    <button 
                        onClick={handleImportClick} 
                        className="flex-1 bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-500 transition-colors border-2 border-brand-700 hover:border-brand-500"
                    >
                        {t('importLinkModal.importButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportLinkModal;
