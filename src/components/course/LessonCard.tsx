
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    order_number: number;
    points: number;
    video_url: string | null;
  };
  index: number;
  progress: number;
  speakText: (text: string, elementId: string, e: React.MouseEvent) => Promise<void>;
  isLoading: string | null;
}

const LessonCard = ({ lesson, index, progress, speakText, isLoading }: LessonCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`
        bg-white/5 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300
        transform hover:scale-105 animate-fade-in border-4 border-white/10
        hover:shadow-xl h-full
      `}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-2 flex-1">
          <h3 className="text-2xl font-bold font-poppins flex items-center">
            {lesson.title}
            <button
              onClick={(e) => speakText(lesson.title, lesson.id, e)}
              className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-yellow-400 animate-pulse" />
              {isLoading === lesson.id && (
                <span className="absolute -top-1 -right-1 w-3 h-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
              )}
            </button>
          </h3>
          <p className="text-lg text-gray-300 font-poppins">{lesson.description}</p>
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center space-x-1 text-yellow-400">
              <span className="text-2xl">💰</span>
              <span className="text-lg font-poppins">{lesson.points} coins</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl">🎯</span>
              <span className="text-lg text-gray-300 font-poppins">4 fun activities</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/lesson/${lesson.id}`)}
          className={`
            w-full sm:w-auto text-lg font-poppins whitespace-nowrap
            ${progress === 100
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            }
          `}
        >
          {progress === 100 ? (
            <>
              💰 All Done!
            </>
          ) : progress > 0 ? (
            <>
              📚 Keep Going!
            </>
          ) : (
            <>
              ▶️ Start Learning!
            </>
          )}
        </Button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-lg text-gray-300 mb-1 font-poppins">
          <span>Your Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-6 rounded-full bg-white/20"
        />
      </div>
    </div>
  );
};

export default LessonCard;
