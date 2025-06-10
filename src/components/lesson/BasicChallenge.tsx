
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Trophy, ArrowRight, HelpCircle, Volume2, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { useAudioSpeech } from "@/hooks/useAudioSpeech";

interface BasicChallengeProps {
  onComplete: () => void;
}

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  hint: string;
}

export const BasicChallenge: React.FC<BasicChallengeProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { speakText, isLoading } = useAudioSpeech();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasNotifiedCompletion, setHasNotifiedCompletion] = useState(false);
  
  const questions: Question[] = [
    {
      id: 1,
      text: "What is the most important thing to remember when helping others?",
      options: [
        { id: "a", text: "Being kind and respectful", isCorrect: true },
        { id: "b", text: "Getting something in return", isCorrect: false },
        { id: "c", text: "Finishing as quickly as possible", isCorrect: false }
      ],
      hint: "Think about how you would want to be treated when someone is helping you."
    },
    {
      id: 2,
      text: "Which of these is NOT a way to help at home?",
      options: [
        { id: "a", text: "Cleaning up your toys", isCorrect: false },
        { id: "b", text: "Leaving messes for others to clean", isCorrect: true },
        { id: "c", text: "Helping set the table", isCorrect: false }
      ],
      hint: "Think about actions that make extra work for others instead of helping them."
    },
    {
      id: 3,
      text: "Why is it important to help others?",
      options: [
        { id: "a", text: "So they will give you presents", isCorrect: false },
        { id: "b", text: "It makes the world a better place for everyone", isCorrect: true },
        { id: "c", text: "So you can become famous", isCorrect: false }
      ],
      hint: "Think about how helping creates positive changes beyond just yourself."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const challengeInstructions = "Let's test what you've learned! Answer these questions about helping others.";
  
  useEffect(() => {
    // Auto-play instructions when component mounts
    const timer = setTimeout(() => {
      // Fix: Using a proper React.MouseEvent type by creating a synthetic event
      const fakeEvent = { stopPropagation: () => {} } as React.MouseEvent<HTMLButtonElement>;
      speakText(challengeInstructions, undefined, "challenge-instructions", fakeEvent);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (isCompleted && !hasNotifiedCompletion) {
      setHasNotifiedCompletion(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Notify completion after a short delay
      const timer = setTimeout(() => {
        console.log("Challenge completed, calling onComplete");
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isCompleted, hasNotifiedCompletion, onComplete]);

  const handleOptionSelect = (optionId: string) => {
    if (isCorrect !== null) return; // Prevent selecting after answering
    
    setSelectedOption(optionId);
    const selectedOption = currentQuestion.options.find(o => o.id === optionId);
    
    if (selectedOption) {
      setIsCorrect(selectedOption.isCorrect);
      
      // Play sound based on correctness
      const audio = new Audio(selectedOption.isCorrect ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3");
      audio.play();
      
      // Show toast with feedback
      toast({
        title: selectedOption.isCorrect ? "Correct! 🎉" : "Not quite right",
        description: selectedOption.isCorrect 
          ? "Great job! That's the right answer." 
          : "Try again or use the hint to help you.",
        variant: selectedOption.isCorrect ? "default" : "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      // Challenge completed
      setIsCompleted(true);
      toast({
        title: "Congratulations! 🏆",
        description: "You've completed the challenge successfully!",
        variant: "default",
      });
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handlePlayQuestion = (e: React.MouseEvent) => {
    e.preventDefault();
    speakText(currentQuestion.text, undefined, `question-${currentQuestion.id}`, e);
  };
  
  const handlePlayOption = (e: React.MouseEvent, option: { id: string, text: string }) => {
    e.stopPropagation();
    speakText(option.text, undefined, `option-${option.id}`, e);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Challenge Time!</h2>
        <p className="text-lg text-gray-700">
          {challengeInstructions}
          <Button 
            onClick={(e) => speakText(challengeInstructions, undefined, "instructions", e)}
            variant="ghost" 
            size="icon"
            className="ml-2"
            disabled={isLoading === "instructions"}
          >
            {isLoading === "instructions" ? (
              <span className="animate-pulse">•••</span>
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </p>
      </div>

      <Card className="p-6 shadow-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setShowHint(!showHint)}
          >
            <HelpCircle className="h-4 w-4" /> {showHint ? "Hide Hint" : "Need a Hint?"}
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            {currentQuestion.text}
            <Button 
              onClick={handlePlayQuestion}
              variant="ghost" 
              size="icon"
              className="ml-2"
              disabled={isLoading === `question-${currentQuestion.id}`}
            >
              {isLoading === `question-${currentQuestion.id}` ? (
                <span className="animate-pulse">•••</span>
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </h3>
          {showHint && (
            <div className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm mt-2 flex items-center">
              <span className="mr-2">💡</span>
              <p>{currentQuestion.hint}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <div 
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-3 rounded-xl flex items-center cursor-pointer transition-all ${
                selectedOption === option.id 
                  ? option.isCorrect 
                    ? "bg-green-100 border-2 border-green-500" 
                    : "bg-red-100 border-2 border-red-500"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                selectedOption === option.id 
                  ? option.isCorrect 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                  : "bg-blue-100 text-blue-500"
              }`}>
                {selectedOption === option.id && option.isCorrect ? (
                  <Check className="h-5 w-5" />
                ) : (
                  option.id.toUpperCase()
                )}
              </div>
              <span className="flex-grow">{option.text}</span>
              <Button 
                onClick={(e) => handlePlayOption(e, option)}
                variant="ghost" 
                size="icon"
                className="ml-2"
                disabled={isLoading === `option-${option.id}`}
              >
                {isLoading === `option-${option.id}` ? (
                  <span className="animate-pulse">•••</span>
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {isCorrect === false && (
            <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
          )}
          {isCorrect === true && (
            <Button onClick={handleNext} className="bg-kid-green hover:bg-kid-green-dark flex items-center gap-2">
              {currentQuestionIndex < questions.length - 1 ? (
                <>Next Question <ArrowRight className="h-4 w-4" /></>
              ) : (
                <>Complete Challenge <Trophy className="h-4 w-4" /></>
              )}
            </Button>
          )}
        </div>

        {isCompleted && (
          <div className="mt-8 text-center">
            <div className="inline-block p-4 bg-yellow-100 rounded-full mb-2">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Challenge Completed!</h3>
            <p className="text-gray-600 mt-2">Great job answering all the questions correctly!</p>
          </div>
        )}
      </Card>
    </div>
  );
};

