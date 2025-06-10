
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseBannerProps {
  title: string;
  description: string;
  category: string;
  points: number;
  speakText: (text: string, elementId: string, e: React.MouseEvent) => Promise<void>;
  isLoading: string | null;
}

const CourseBanner = ({
  title,
  description,
  category,
  points,
  speakText,
  isLoading
}: CourseBannerProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl sm:text-4xl font-bold font-poppins bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text flex items-center">
        {title}
        <button
          onClick={(e) => speakText(title, 'course-title', e)}
          className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Volume2 className="w-6 h-6 text-yellow-400 animate-pulse" />
          {isLoading === 'course-title' && (
            <span className="absolute -top-1 -right-1 w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
          )}
        </button>
      </h1>
      <p className="text-xl text-gray-300 font-poppins">{description}</p>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-yellow-400 animate-bounce">
          <span className="text-4xl mr-2">💰</span>
          <span className="text-xl font-poppins">{points} coins to collect!</span>
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
