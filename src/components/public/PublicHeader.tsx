import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PublicHeaderProps {
  onBackToHome: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onBackToHome }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12">
                <img 
                  src="/CAPACITI Logo 3.png" 
                  alt="CAPACITI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-900">CAPACITI</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-secondary-600">TALENT HUB</span>
                  <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full font-medium">Public Directory</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-900 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </header>
  );
};