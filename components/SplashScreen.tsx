import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-surface-base flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <h1
          className="text-5xl font-bold text-brand-400"
        >
          <span className="inline-block opacity-0" style={{ animation: 'slide-in-left 0.8s ease-out forwards', animationDelay: '0.3s' }}>WorkOut</span>
          <span className="inline-block opacity-0" style={{ animation: 'slide-in-right 0.8s ease-out forwards', animationDelay: '0.3s' }}> Manager</span>
        </h1>
        <p
          className="text-xl text-text-muted mt-4 opacity-0"
          style={{ animation: 'splash-fade-in 0.8s ease-out forwards', animationDelay: '1.0s' }}
        >
          by Fajmuls
        </p>
        <p
          className="text-lg text-text-subtle mt-12 opacity-0"
          style={{ animation: 'splash-fade-in 0.8s ease-out forwards', animationDelay: '1.5s' }}
        >
          Powered by AI
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
