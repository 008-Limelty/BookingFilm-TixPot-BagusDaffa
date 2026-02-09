import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
    <div className="flex flex-col items-center justify-center py-20 text-white animate-fade-in">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted font-medium animate-pulse">{message}</p>
    </div>
);

export default LoadingSpinner;
