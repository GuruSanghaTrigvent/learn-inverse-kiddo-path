
import React from 'react';

interface AnswerOptionProps {
  option: {
    text: string;
    isHelping: boolean;
  };
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  activeOption: number | null;
  onClick: () => void;
  disabled: boolean;
  bounce: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  index,
  isSelected,
  isCorrect,
  activeOption,
  onClick,
  disabled,
  bounce
}) => {
  // Array of colors for the circles
  const circleColors = [
    "bg-kid-purple",        // Purple
    "bg-kid-yellow-dark",   // Orange
    "bg-kid-blue",          // Blue
    "bg-kid-green",         // Green
    "bg-kid-pink"           // Pink
  ];
  
  // Get color based on index, cycling through if more options than colors
  const circleColor = circleColors[index % circleColors.length];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full p-3 rounded-xl shadow-lg flex items-center transition-all duration-300 
        ${isSelected && isCorrect 
          ? "bg-green-200 border-4 border-green-500 scale-105" 
          : isSelected && !isCorrect
            ? "bg-red-200 border-4 border-red-500"
            : activeOption === index
              ? "bg-kid-yellow-light border-4 border-kid-yellow scale-105" 
              : "bg-white hover:bg-blue-50 hover:scale-105"
        }`}
    >
      <div className={`rounded-full p-2 mr-3 w-12 h-12 flex items-center justify-center ${
        isSelected && isCorrect ? "animate-bounce" : 
        bounce ? "scale-110" : ""
      }`}>
        <div className={`w-8 h-8 rounded-full ${circleColor} animate-pulse-slow`}></div>
      </div>
      <div className="flex-1 text-lg font-medium text-gray-800">{option.text}</div>
      
      {isSelected && (
        <div className="text-2xl ml-2 animate-pulse w-6 h-6 flex items-center justify-center">
          <span>{isCorrect ? "✅" : "❌"}</span>
        </div>
      )}
    </button>
  );
};
