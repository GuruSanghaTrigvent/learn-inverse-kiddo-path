
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, HelpCircle } from 'lucide-react';

interface ControlButtonsProps {
  isCorrect?: boolean | null;
  onNext?: () => void;
  onRestart?: () => void;
  isLastScenario?: boolean;
  showNextButton?: boolean;
  onHint?: () => void;
  isHintVisible?: boolean;
  isReading?: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  isCorrect,
  onNext,
  onRestart,
  isLastScenario,
  showNextButton,
  onHint,
  isHintVisible,
  isReading
}) => {
  return (
    <div className="flex justify-between items-center">
      {/* Hint button */}
      {onHint && (
        <Button
          onClick={onHint}
          variant="outline"
          className={`text-gray-600 transition-all duration-300 ${isHintVisible ? 'bg-gray-100' : ''}`}
          disabled={isReading}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          {isHintVisible ? 'Hide Hint' : 'Show Hint'}
        </Button>
      )}
      
      {/* Navigation with enhanced effects */}
      <div className="flex space-x-3 ml-auto">
        {/* Next button for money lesson */}
        {showNextButton && onNext && (
          <Button 
            onClick={onNext}
            className="bg-kid-green hover:bg-kid-green-dark text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center shadow-md"
          >
            Next <RefreshCw className="h-4 w-4 ml-1" />
          </Button>
        )}
        
        {/* Original buttons for helping quiz */}
        {isCorrect === true && onNext && onRestart && (
          <Button 
            onClick={isLastScenario ? onRestart : onNext}
            className="bg-kid-green hover:bg-kid-green-dark text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center shadow-md"
          >
            {isLastScenario ? (
              <>
                Restart <RotateCcw className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Next <RefreshCw className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
