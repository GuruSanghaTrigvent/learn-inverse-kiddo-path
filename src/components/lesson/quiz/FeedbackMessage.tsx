
import React from 'react';
import { Scenario } from './QuizTypes';

interface FeedbackMessageProps {
  isCorrect: boolean | null;
  scenario?: Scenario;
  message?: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ isCorrect, scenario, message }) => {
  if (isCorrect === null) return null;
  
  // If message is provided directly, use it instead of scenario feedback
  const feedbackText = message ? message : (
    isCorrect 
      ? scenario?.feedback.correct
      : scenario?.feedback.incorrect
  );
  
  if (!feedbackText) return null;
  
  return (
    <div className={`w-full p-3 rounded-xl text-center text-lg transition-all duration-500 mb-4 animate-fade-in ${
      isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}>
      {isCorrect ? (
        <div className="flex items-center justify-center">
          <span className="animate-bounce mr-2 w-5 h-5 flex items-center justify-center">
            <span style={{ fontSize: "1.125rem" }}>👏</span>
          </span>
          {feedbackText}
          <span className="animate-bounce ml-2 w-5 h-5 flex items-center justify-center">
            <span style={{ fontSize: "1.125rem" }}>👏</span>
          </span>
        </div>
      ) : (
        <div>
          {feedbackText}
        </div>
      )}
    </div>
  );
};
