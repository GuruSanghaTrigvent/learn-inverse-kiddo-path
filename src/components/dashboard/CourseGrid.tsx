
import { Progress } from "@/components/ui/progress";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Volume2, ChevronDown, Check } from "lucide-react";
import Lottie from "lottie-react";

interface CourseProgress {
  MINDSET: number;
  HOME_MAINTENANCE: number;
  COOKING: number;
  CAREER: number;
  SOCIAL: number;
}

interface CourseCategory {
  emoji?: string;
  animation?: any;
  title: string;
  description: string;
  color: string;
  progressKey: keyof CourseProgress;
  courseId: string;
}

interface CourseGridProps {
  categories: CourseCategory[];
  progress?: CourseProgress;
  onCategoryClick: (category: keyof CourseProgress, courseId: string) => void;
  courseCompletionStatus?: Record<string, boolean>;
}

export const CourseGrid = ({ 
  categories, 
  progress, 
  onCategoryClick,
  courseCompletionStatus = {}
}: CourseGridProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const lastAudioElement = useRef<HTMLAudioElement | null>(null);
  const [workAnimation, setWorkAnimation] = useState<any>(null);

  useEffect(() => {
    fetch('/animations/work1.json')
      .then(response => response.json())
      .then(data => {
        setWorkAnimation(data);
        categories[0].animation = data;
      })
      .catch(error => {
        console.error('Error loading animation:', error);
      });
  }, [categories]);

  const handleCategoryClick = (category: keyof CourseProgress, courseId: string) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
    onCategoryClick(category, courseId);
  };

  const speakText = async (text: string, description: string, cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (lastAudioElement.current) {
        lastAudioElement.current.pause();
        lastAudioElement.current = null;
      }

      setIsLoading(cardId);
      
      const fullText = `${text} - ${description}`;
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: fullText,
          voice: "alloy",
        },
      });
      
      if (error) {
        console.error('Error invoking text-to-speech:', error);
        throw new Error('Failed to generate speech');
      }
      
      if (!data || !data.audioContent) {
        throw new Error('No audio content returned');
      }

      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        lastAudioElement.current = null;
      };

      lastAudioElement.current = audio;
      await audio.play();
    } catch (error) {
      console.error('Error in speakText:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 sm:space-y-24 pt-6 sm:pt-12 pb-6 sm:pb-12 px-4 sm:px-0">
      {categories.map((category, index) => {
        // Debug logging - show current progress values with type information
        const progressValue = progress?.[category.progressKey];
        console.log(`CourseGrid - ${category.title}: Progress value = ${progressValue}, type: ${typeof progressValue}`);
        
        // Check if we have course completion status from lesson progress
        const completionKey = category.progressKey;
        const hasCompletionStatus = courseCompletionStatus && completionKey in courseCompletionStatus;
        
        // Determine completion status:
        // 1. First use lesson-based completion status if available
        // 2. Fall back to progress === 100 check only if lesson data not available
        let isCompleted = false;
        
        if (hasCompletionStatus) {
          isCompleted = courseCompletionStatus[completionKey];
          console.log(`CourseGrid - ${category.title}: Using lesson-based completion: ${isCompleted}`);
        } else if (progress) {
          isCompleted = progress[category.progressKey] === 100;
          console.log(`CourseGrid - ${category.title}: Using progress-based completion: ${isCompleted}`);
        }
        
        // Custom color for Helping Hands course
        let categoryColor = category.color;
        if (category.title === "Helping Hands" || category.title === "HELPING HANDS") {
          categoryColor = "bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] hover:from-[#FEC6A1] hover:to-[#FDE1D3]";
        }
        
        return (
          <div key={category.title} className="relative">
            <div
              className={`
                rounded-3xl p-4 sm:p-6 cursor-pointer transition-all duration-300
                hover:scale-105 ${categoryColor} border-4 border-white/10
                hover:shadow-xl animate-fade-in relative overflow-hidden group
              `}
              style={{ 
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleCategoryClick(category.progressKey, category.courseId)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-2 right-2 z-20">
                <button
                  onClick={(e) => speakText(category.title, category.description, category.title, e)}
                  className="p-2 rounded-full bg-[#F97316] hover:bg-[#F97316]/80 transition-colors relative transform hover:scale-110"
                >
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="absolute inset-0 rounded-full bg-[#F97316] animate-ping opacity-75"></span>
                  {isLoading === category.title && (
                    <span className="absolute -top-1 -right-1 animate-pulse">🔊</span>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 relative z-10 space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0">
                  {category.animation ? (
                    <div 
                      className="w-20 h-20 sm:w-24 sm:h-24 sm:mr-4 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center"
                    >
                      <Lottie
                        animationData={category.animation}
                        loop={true}
                        autoplay={true}
                        className="w-full h-full"
                        onLoadedImages={() => {
                          console.log("Lottie animation loaded for:", category.title);
                        }}
                        onError={(error) => {
                          console.error("Lottie error for:", category.title, error);
                        }}
                        style={{ width: '100%', height: '100%' }}
                        renderer="svg"
                        initialSegment={[0, 180]}
                      />
                    </div>
                  ) : (
                    <span className="text-5xl sm:text-6xl sm:mr-4 transform hover:scale-110 transition-transform duration-300">
                      {category.emoji}
                    </span>
                  )}
                  <div className="sm:ml-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:scale-110 transition-transform leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                
                {isCompleted && (
                  <div className="hidden sm:flex w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                )}
              </div>

              {progress && (
                <div className="mt-4 sm:mt-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base sm:text-lg font-medium text-gray-700">
                      Your progress!
                    </span>
                    <span className="text-base sm:text-lg font-medium text-gray-700">
                      {progress[category.progressKey]}%
                    </span>
                  </div>
                  <Progress 
                    value={progress[category.progressKey]}
                    className="h-4 rounded-full bg-white/30"
                  />
                </div>
              )}
            </div>

            {index < categories.length - 1 && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 sm:mt-8">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                  <ChevronDown className="h-6 w-6 text-primary" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
