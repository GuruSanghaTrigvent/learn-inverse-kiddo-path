
import React from 'react';
import { Play } from 'lucide-react';

interface SoundButtonProps {
  isReading: boolean;
  isPulsing: boolean;
  onClick: () => void;
}

export const SoundButton: React.FC<SoundButtonProps> = ({ isReading, isPulsing, onClick }) => {
  return (
    <button 
      onClick={onClick}
      disabled={isReading}
      className={`rounded-full transition-all duration-700 transform ${
        isPulsing 
          ? "scale-110 shadow-lg shadow-kid-yellow/60" 
          : "scale-100 shadow-md"
      } ${
        isReading 
          ? "bg-kid-yellow animate-pulse" 
          : "bg-kid-yellow hover:bg-kid-yellow-dark"
      } p-3`}
    >
      <Play className={`h-8 w-8 text-black ${isReading ? 'animate-pulse' : ''}`} fill="black" />
      <span className="sr-only">Play audio</span>
    </button>
  );
};
