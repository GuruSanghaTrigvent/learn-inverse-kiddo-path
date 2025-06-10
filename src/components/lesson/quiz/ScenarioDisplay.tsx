
import React from 'react';
import { Scenario } from './QuizTypes';

interface ScenarioDisplayProps {
  scenario: Scenario;
  bounce: boolean;
}

export const ScenarioDisplay: React.FC<ScenarioDisplayProps> = ({ scenario, bounce }) => {
  return (
    <div className="text-center mb-4">
      <div className={`bg-kid-yellow-light p-4 rounded-2xl shadow-lg mb-4 transform transition-transform ${bounce ? 'animate-bounce' : 'hover:scale-105'} relative`}>
        <div className="text-xl font-bold text-gray-800">{scenario.situation}</div>
        <div className="mt-2 text-lg text-gray-700">{scenario.question}</div>
        
        {/* Scenario illustration */}
        {scenario.imageUrl && (
          <div className="mt-3">
            <img 
              src={scenario.imageUrl} 
              alt={scenario.situation}
              className="h-40 mx-auto rounded-lg object-cover shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};
