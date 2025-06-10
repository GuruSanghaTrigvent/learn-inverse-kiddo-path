
import { useState, useEffect } from "react";
import { useStudentData } from "@/hooks/useStudentData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { moneyScenarios } from "./quiz/QuizData";
import { ThemeBackground } from "./quiz/ThemeBackground";
import { ScenarioDisplay } from "./quiz/ScenarioDisplay";
import { AnswerOption } from "./quiz/AnswerOption";
import { FeedbackMessage } from "./quiz/FeedbackMessage";
import { ControlButtons } from "./quiz/ControlButtons";
import { CharacterAnimation } from "./quiz/CharacterAnimation";
import { useVoiceOver } from "./quiz/useVoiceOver";
import { useConfetti } from "./quiz/useConfetti";
import { supabase } from "@/integrations/supabase/client";
import Lottie from "lottie-react";
import confetti from "canvas-confetti";
import workAnimation from "../../../public/animations/work.json";

interface MoneyLessonGameProps {
  onComplete: () => void;
  lessonId: string;
}

const MoneyLessonGame = ({ onComplete, lessonId }: MoneyLessonGameProps) => {
  const { selectedStudentId } = useStudentData();
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [characterState, setCharacterState] = useState<"neutral" | "excited" | "thinking">("neutral");
  const [bounce, setBounce] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  
  const { playVoiceOver, cleanupAudio } = useVoiceOver(moneyScenarios);
  const { triggerConfetti } = useConfetti();

  // Trigger bounce animation periodically to draw attention
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }, 5000);
    
    return () => clearInterval(bounceInterval);
  }, []);

  // Play voice over when scenario changes
  useEffect(() => {
    playVoiceOver(currentScenario, setIsReading, setActiveOption);
    
    return () => cleanupAudio();
  }, [currentScenario, playVoiceOver, cleanupAudio]);

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || isReading) return;
    
    const correctSound = new Audio("/sounds/correct.mp3");
    const incorrectSound = new Audio("/sounds/incorrect.mp3");
    
    setSelectedOption(optionIndex);
    const isOptionCorrect = moneyScenarios[currentScenario].options[optionIndex].isHelping;
    setIsCorrect(isOptionCorrect);
    
    if (isOptionCorrect) {
      setCharacterState("excited");
      correctSound.play();
      triggerConfetti();
      setPointsEarned(prev => prev + 5);
    } else {
      setCharacterState("thinking");
      incorrectSound.play();
    }
    
    setShowNextButton(true);
  };

  // Handle next button click
  const handleNext = async () => {
    if (currentScenario < moneyScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsHintVisible(false);
      setShowNextButton(false);
      setCharacterState("neutral");
    } else {
      setIsGameComplete(true);
      
      // Add big celebration
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
      
      // Update student progress in the database
      if (selectedStudentId && lessonId) {
        try {
          // First, check if there's an existing progress record
          const { data: existingProgress } = await supabase
            .from("student_progress")
            .select("*")
            .eq("student_id", selectedStudentId)
            .eq("lesson_id", lessonId)
            .single();
            
          if (existingProgress) {
            // Update completed sections
            const completedSections = existingProgress.completed_sections || [];
            if (!completedSections.includes("money_lesson")) {
              completedSections.push("money_lesson");
            }
            
            await supabase
              .from("student_progress")
              .update({
                completed_sections: completedSections,
                completed_at: completedSections.length >= 4 ? new Date().toISOString() : existingProgress.completed_at
              })
              .eq("id", existingProgress.id);
          } else {
            // Create new progress record
            await supabase
              .from("student_progress")
              .insert({
                student_id: selectedStudentId,
                lesson_id: lessonId,
                completed_sections: ["money_lesson"]
              });
          }
          
          // Update student's total points
          await supabase
            .from("students")
            .select("points")
            .eq("id", selectedStudentId)
            .single()
            .then(({ data, error }) => {
              if (error) throw error;
              
              const currentPoints = data?.points || 0;
              const newPoints = currentPoints + pointsEarned;
              
              return supabase
                .from("students")
                .update({ points: newPoints })
                .eq("id", selectedStudentId);
            });
            
          // Show success toast
          toast({
            title: "Progress saved!",
            description: `You earned ${pointsEarned} points!`,
          });
          
          // Call the onComplete callback
          setTimeout(() => {
            onComplete();
          }, 3000);
          
        } catch (error) {
          console.error("Error saving progress:", error);
          toast({
            title: "Error",
            description: "Failed to save your progress",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Toggle hint visibility
  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
    if (!isHintVisible) {
      setCharacterState("thinking");
    } else {
      setCharacterState("neutral");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 min-h-[500px]">
      <ThemeBackground theme="rainbow">
        {isGameComplete ? (
          <div className="text-center py-12 space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">
              Great job learning about money!
            </h2>
            <div className="w-48 h-48 mx-auto">
              <Lottie animationData={workAnimation} loop={true} />
            </div>
            <p className="text-xl text-white">
              You earned {pointsEarned} points!
            </p>
            <div className="max-w-sm mx-auto">
              <Progress value={100} className="h-6" />
            </div>
            <Button
              onClick={onComplete}
              size="lg"
              className="bg-kid-yellow font-bold text-gray-800 hover:bg-kid-yellow-dark"
            >
              Continue Learning!
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/90 p-4 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  What is Money? ({currentScenario + 1}/{moneyScenarios.length})
                </h2>
                <Progress 
                  value={((currentScenario + 1) / moneyScenarios.length) * 100} 
                  className="h-4" 
                />
              </div>
              
              <ScenarioDisplay 
                scenario={moneyScenarios[currentScenario]} 
                bounce={bounce} 
              />
              
              <div className="space-y-3">
                {moneyScenarios[currentScenario].options.map((option, index) => (
                  <AnswerOption
                    key={index}
                    option={option}
                    index={index}
                    isSelected={selectedOption === index}
                    isCorrect={selectedOption === index ? isCorrect : null}
                    activeOption={activeOption}
                    onClick={() => handleOptionSelect(index)}
                    disabled={selectedOption !== null || isReading}
                    bounce={bounce && index === 0}
                  />
                ))}
              </div>
              
              {selectedOption !== null && (
                <FeedbackMessage 
                  isCorrect={isCorrect || false}
                  message={isCorrect 
                    ? moneyScenarios[currentScenario].feedback.correct
                    : moneyScenarios[currentScenario].feedback.incorrect
                  }
                />
              )}
              
              {isHintVisible && (
                <div className="bg-yellow-100 p-4 rounded-2xl text-gray-800 shadow-lg animate-fade-in">
                  <p className="font-semibold">Hint: {moneyScenarios[currentScenario].hint}</p>
                </div>
              )}
              
              <ControlButtons
                showNextButton={showNextButton}
                onNext={handleNext}
                onHint={toggleHint}
                isHintVisible={isHintVisible}
                isReading={isReading}
              />
            </div>
            
            <div className="hidden md:block">
              <CharacterAnimation state={characterState} />
            </div>
          </div>
        )}
      </ThemeBackground>
    </div>
  );
};

export default MoneyLessonGame;
