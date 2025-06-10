
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Import our new components and hooks
import { HelpingQuizGameProps, CharacterState } from './quiz/QuizTypes';
import { scenarios, backgrounds } from './quiz/QuizData';
import { ScenarioDisplay } from './quiz/ScenarioDisplay';
import { IllustrationBox } from './quiz/IllustrationBox';
import { AnswerOption } from './quiz/AnswerOption';
import { FeedbackMessage } from './quiz/FeedbackMessage';
import { ControlButtons } from './quiz/ControlButtons';
import { useVoiceOver } from './quiz/useVoiceOver';
import { useConfetti } from './quiz/useConfetti';

export const HelpingQuizGame = ({ onComplete }: HelpingQuizGameProps) => {
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const [theme, setTheme] = useState<string>("jungle");
  const [spilled, setSpilled] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [characterState, setCharacterState] = useState<CharacterState>("neutral");
  const [isReading, setIsReading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completionAudio, setCompletionAudio] = useState<HTMLAudioElement | null>(null);
  
  const { playVoiceOver, cleanupAudio } = useVoiceOver(scenarios);
  const { triggerConfetti } = useConfetti();

  // Create audio element on mount to avoid issues with user interaction
  useEffect(() => {
    const audio = new Audio();
    setCompletionAudio(audio);
    
    const bounceInterval = setInterval(() => {
      setBounce(prev => !prev);
    }, 2000);
    
    setTimeout(() => {
      setSpilled(true);
    }, 1000);
    
    return () => {
      clearInterval(bounceInterval);
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  // Cleanup function on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (completionAudio) {
        completionAudio.pause();
        completionAudio.src = "";
      }
    };
  }, [cleanupAudio, completionAudio]);

  const handlePlayVoiceOver = () => {
    playVoiceOver(currentScenario, setIsReading, setActiveOption);
  };

  const handleOptionSelect = async (option: string, isHelpingOption: boolean) => {
    cleanupAudio();
    
    setSelectedOption(option);
    setIsCorrect(isHelpingOption);
    
    if (isHelpingOption) {
      triggerConfetti();
      setCelebrate(true);
      setCharacterState("excited");
      
      const feedbackMessage = scenarios[currentScenario].feedback.correct;
      
      toast({
        title: "That's right!",
        description: "You're becoming a Helping Hero! 🌟",
        variant: "default",
      });
      
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: {
            text: feedbackMessage,
            voice: "alloy",
          },
        });
        
        if (error) {
          console.error('Error invoking text-to-speech:', error);
        } else if (data.audioContent) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          await audio.play();
          
          audio.onended = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (currentScenario < scenarios.length - 1) {
              handleNextScenario();
            } else {
              playCompletionMessage();
            }
          };
        }
      } catch (error) {
        console.error('Error playing feedback:', error);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (currentScenario < scenarios.length - 1) {
          handleNextScenario();
        } else {
          playCompletionMessage();
        }
      }
    } else {
      toast({
        title: "Try again!",
        description: "Think about how you can help others. 💭",
        variant: "destructive",
      });
      
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: {
            text: "That's incorrect, but it's okay, try again",
            voice: "alloy",
          },
        });
        
        if (error) {
          console.error('Error invoking text-to-speech:', error);
        } else if (data.audioContent) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          await audio.play();
          
          audio.onended = () => {
            setTimeout(() => {
              setSelectedOption(null);
              setIsCorrect(null);
            }, 1000);
          };
        }
      } catch (error) {
        console.error('Error playing feedback:', error);
        setTimeout(() => {
          setSelectedOption(null);
          setIsCorrect(null);
        }, 2000);
      }
    }
  };

  const playCompletionMessage = async () => {
    if (!completionAudio) {
      console.error("No completion audio element available");
      onComplete();
      return;
    }
    
    // Set quiz state to completed
    setQuizCompleted(true);
    setIsReading(true);
    
    // Simple, clear message without emojis or complex formatting
    const completionMessage = "Congratulations! Great job! Every worker helps people in their own way. What job do YOU want to do when you grow up?";
    
    console.log("Starting to play completion message");
    
    try {
      // Make sure audio isn't playing anything else
      completionAudio.pause();
      
      // Reset event handlers
      completionAudio.onended = () => {
        console.log("Completion audio finished playing");
        setIsReading(false);
        onComplete();
      };
      
      completionAudio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsReading(false);
        onComplete();
      };
      
      // Call OpenAI text-to-speech API using our edge function
      console.log("Calling text-to-speech API");
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: completionMessage,
          voice: "alloy",
        },
      });
      
      if (error) {
        console.error("API error:", error);
        setIsReading(false);
        onComplete();
        return;
      }
      
      if (!data || !data.audioContent) {
        console.error("No audio content returned");
        setIsReading(false);
        onComplete();
        return;
      }
      
      console.log("Received audio data, setting src and playing");
      
      // Set the audio source to the base64 data
      completionAudio.src = `data:audio/mp3;base64,${data.audioContent}`;
      
      try {
        // Use the load() method to ensure the audio is ready to play
        completionAudio.load();
        
        // Wait a short time to ensure audio is loaded
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Force a user interaction event to allow audio playback
        // This is a workaround for browsers that require user interaction
        document.body.click();
        
        // Add attempt counter for multiple retries
        let attempts = 0;
        const maxAttempts = 3;
        
        const attemptPlay = async () => {
          try {
            attempts++;
            console.log(`Attempt ${attempts} to play audio`);
            await completionAudio.play();
            console.log("Audio is now playing");
          } catch (playError) {
            console.error(`Error playing audio (attempt ${attempts}):`, playError);
            
            if (attempts < maxAttempts) {
              // Wait longer between attempts
              await new Promise(resolve => setTimeout(resolve, 500));
              attemptPlay();
            } else {
              console.error("Max play attempts reached, giving up");
              setIsReading(false);
              onComplete();
            }
          }
        };
        
        await attemptPlay();
      } catch (playError) {
        console.error("Error playing audio:", playError);
        setIsReading(false);
        onComplete();
      }
    } catch (err) {
      console.error("General error in playCompletionMessage:", err);
      setIsReading(false);
      onComplete();
    }
  };

  const handleNextScenario = () => {
    setCurrentScenario(prevScenario => prevScenario + 1);
    setSelectedOption(null);
    setIsCorrect(null);
    setCelebrate(false);
    setCharacterState("neutral");
    setTimeout(() => {
      setSpilled(true);
    }, 500);
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCelebrate(false);
    setCharacterState("neutral");
    setSpilled(false);
    setQuizCompleted(false);
    
    setTimeout(() => {
      setSpilled(true);
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <div className={`relative rounded-3xl shadow-xl overflow-hidden transition-all duration-1000 ${backgrounds[theme]}`}>
      <div className="p-4 md:p-6 mt-14">
        <div className="text-center mb-2">
          <h2 
            className="text-3xl font-bold text-white"
            style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}
          >
            What do these jobs do?
          </h2>
        </div>
        
        <div className="flex justify-center mb-4">
          {!quizCompleted && (
            <Button
              onClick={handlePlayVoiceOver}
              className="bg-kid-purple hover:bg-kid-purple-dark text-white rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-lg"
              size="icon"
              disabled={isReading || isCorrect !== null || quizCompleted}
              style={{ width: '80px', height: '80px' }}
            >
              <Play className="h-10 w-10" />
            </Button>
          )}
        </div>
        
        {quizCompleted ? (
          <div className="bg-kid-yellow-light p-6 rounded-2xl shadow-lg mb-4 text-center animate-fadeIn">
            <h3 className="text-2xl font-bold mb-3 text-black">🎉 Congratulations! 🎉</h3>
            <p className="text-xl text-black">Great job! Every worker helps people in their own way.</p>
            <p className="text-xl mt-3 text-black">What job do YOU want to do when you grow up? 🚀</p>
          </div>
        ) : (
          <>
            <ScenarioDisplay scenario={currentScenarioData} bounce={bounce} />
            
            <div className="space-y-2 mb-3">
              {currentScenarioData.options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  index={index}
                  isSelected={selectedOption === option.text}
                  isCorrect={selectedOption === option.text ? isCorrect : null}
                  activeOption={activeOption}
                  onClick={() => handleOptionSelect(option.text, option.isHelping)}
                  disabled={isCorrect !== null && isCorrect !== false}
                  bounce={bounce}
                />
              ))}
            </div>
            
            <FeedbackMessage isCorrect={isCorrect} scenario={currentScenarioData} />
          </>
        )}
        
        {!quizCompleted && (
          <ControlButtons
            isCorrect={isCorrect}
            onNext={handleNextScenario}
            onRestart={handleRestart}
            isLastScenario={currentScenario === scenarios.length - 1}
          />
        )}
      </div>
    </div>
  );
};
