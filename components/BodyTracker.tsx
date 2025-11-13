import React, { useState, useMemo } from 'react';
import { View, BodyMeasurement } from '../types';
import { ChevronLeftIcon, TrashIcon } from './icons';
import i18n from '../i18n';

interface BodyTrackerProps {
    measurements: BodyMeasurement[];
    setMeasurements: (measurements: BodyMeasurement[]) => void;
    navigate: (view: View) => void;
}

const BodyTracker: React.FC<BodyTrackerProps> = ({ measurements, setMeasurements, navigate }) => {
    const t = i18n.t.bind(i18n);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState(measurements[0]?.height.toString() || '');
    const [bodyFat, setBodyFat] = useState('');

    const latestMeasurement = useMemo(() => {
        return [...measurements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    }, [measurements]);

    const calculateBMI = (weightKg: number, heightCm: number): number | null => {
        if (!weightKg || !heightCm) return null;
        const heightM = heightCm / 100;
        return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    };

    const bmi = useMemo(() => {
        const w = parseFloat(weight) || latestMeasurement?.weight;
        const h = parseFloat(height) || latestMeasurement?.height;
        if (w && h) {
            return calculateBMI(w, h);
        }
        return null;
    }, [weight, height, latestMeasurement]);
    
    const languageLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';

    const handleAddMeasurement = () => {
        if (!weight || !height) {
            alert("Weight and height are required.");
            return;
        }

        const newMeasurement: BodyMeasurement = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            weight: parseFloat(weight),
            height: parseFloat(height),
            bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        };
        setMeasurements([...measurements, newMeasurement]);
        setWeight('');
        setBodyFat('');
    };
    
    const handleDeleteMeasurement = (id: string) => {
        setMeasurements(measurements.filter(m => m.id !== id));
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('settings')} className="p-2 rounded-full hover:bg-surface-inset mr-4">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-3xl font-bold">{t('bodyTracker.title')}</h2>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-raised rounded-2xl p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-brand-400">{t('bodyTracker.addMeasurement')}</h3>
                     <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">{t('bodyTracker.weight')}</label>
                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-surface-inset border-2 border-border rounded-lg p-3" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">{t('bodyTracker.height')}</label>
                        <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-surface-inset border-2 border-border rounded-lg p-3" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">{t('bodyTracker.bodyFat')}</label>
                        <input type="number" value={bodyFat} onChange={e => setBodyFat(e.target.value)} className="w-full bg-surface-inset border-2 border-border rounded-lg p-3" />
                    </div>
                     <button onClick={handleAddMeasurement} className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-500 transition-colors">
                        {t('common.add')}
                    </button>
                </div>
                 <div className="bg-surface-raised rounded-2xl p-4 flex flex-col items-center justify-center">
                     <h3 className="text-lg font-semibold text-text-muted mb-2">{t('bodyTracker.bmi')} ({t('bodyTracker.latest')})</h3>
                     <p className="text-6xl font-bold text-brand-400">{bmi ?? (latestMeasurement && calculateBMI(latestMeasurement.weight, latestMeasurement.height)) ?? '--'}</p>
                </div>
             </div>

            <div className="mt-8">
                 <h3 className="text-xl font-bold mb-4">{t('bodyTracker.history')}</h3>
                 <div className="space-y-3">
                     {measurements.length > 0 ? (
                         [...measurements].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(m => {
                            const currentBmi = calculateBMI(m.weight, m.height);
                            return (
                             <div key={m.id} className="bg-surface-raised rounded-2xl p-4 flex items-center justify-between">
                                 <div>
                                     <p className="font-semibold">{new Date(m.date).toLocaleDateString(languageLocale, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                     <p className="text-sm text-text-muted">
                                         {m.weight}kg &bull; {m.height}cm {m.bodyFat && `&bull; ${m.bodyFat}% Fat`} &bull; BMI: {currentBmi}
                                     </p>
                                 </div>
                                 <button onClick={() => handleDeleteMeasurement(m.id)} className="p-2 text-text-muted hover:text-red-500">
                                     <TrashIcon />
                                 </button>
                             </div>
                            )
                         })
                     ) : (
                        <p className="text-center text-text-subtle mt-8">{t('bodyTracker.noHistory')}</p>
                     )}
                 </div>
            </div>
        </div>
    );
};

export default BodyTracker;