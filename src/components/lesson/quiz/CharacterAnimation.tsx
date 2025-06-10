
import React from 'react';
import { CharacterState } from './QuizTypes';

interface CharacterAnimationProps {
  state?: CharacterState;
  characterState?: CharacterState;
  currentScenario?: number;
  spilled?: boolean;
  celebrate?: boolean;
}

export const CharacterAnimation: React.FC<CharacterAnimationProps> = ({ 
  state,
  characterState, 
  currentScenario = 0, 
  spilled = false, 
  celebrate = false 
}) => {
  // Use state prop if provided, otherwise use characterState
  const charState = state || characterState || "neutral";
  
  return (
    <div className="relative z-10 flex flex-col items-center justify-center">
      {charState === "neutral" && (
        <div className="flex items-center justify-center animate-float">
          {/* Removed girl emoji */}
        </div>
      )}
      {charState === "excited" && (
        <div className="flex items-center justify-center animate-bounce">
          <span style={{ fontSize: "1.5rem" }}>🎉</span>
        </div>
      )}
      {charState === "thinking" && (
        <div className="flex items-center justify-center animate-pulse">
          <span style={{ fontSize: "1.5rem" }}>🤔</span>
        </div>
      )}
      
      {currentScenario === 0 && (
        <div className="flex flex-col items-center justify-center mt-1">
          <div className={`flex items-center justify-center transition-all duration-500 transform ${spilled ? "rotate-45 translate-y-1" : ""}`}>
            <span style={{ fontSize: "1.5rem" }}>🧃</span>
          </div>
          <div className={`flex flex-col items-center justify-center transition-all duration-1000 ${spilled ? "opacity-100" : "opacity-0"}`}>
            <div className="flex space-x-1">
              <div className={`flex items-center justify-center transition-all ${spilled ? "translate-y-0" : "-translate-y-2"}`}>
                <span style={{ fontSize: "1rem" }}>💧</span>
              </div>
              <div className={`flex items-center justify-center transition-all delay-100 ${spilled ? "translate-y-0" : "-translate-y-2"}`}>
                <span style={{ fontSize: "1rem" }}>💧</span>
              </div>
              <div className={`flex items-center justify-center transition-all delay-200 ${spilled ? "translate-y-0" : "-translate-y-2"}`}>
                <span style={{ fontSize: "1rem" }}>💧</span>
              </div>
            </div>
            <div className={`mt-1 text-xs font-bold text-orange-700 transition-all duration-500 ${spilled ? "opacity-100" : "opacity-0"}`}>
              Oh no! Spilled juice!
            </div>
          </div>
        </div>
      )}

      {celebrate && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-4 h-4 flex items-center justify-center animate-ping-slow"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              <span style={{ fontSize: "0.75rem" }}>
                {['✨', '🎉', '⭐', '🌟', '👏'][Math.floor(Math.random() * 5)]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
