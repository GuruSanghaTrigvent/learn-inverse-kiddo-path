
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Camera, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface CourseProgress {
  MINDSET: number;
  HOME_MAINTENANCE: number;
  COOKING: number;
  CAREER: number;
  SOCIAL: number;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  points: number;
  course_progress: CourseProgress;
}

interface StudentProfileProps {
  student: Student;
  onAvatarUpdate: (url: string) => void;
  showAvatarSelector: boolean;
  onAvatarSelectorToggle: (show: boolean) => void;
}

export const StudentProfile = ({
  student,
  onAvatarUpdate,
  showAvatarSelector,
  onAvatarSelectorToggle,
}: StudentProfileProps) => {
  const { toast } = useToast();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/animations/happydance.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  const calculateTotalProgress = (progress: CourseProgress) => {
    const totalProgress = Object.values(progress).reduce((sum, value) => sum + value, 0);
    return Math.round(totalProgress / Object.keys(progress).length);
  };

  const updateAvatar = async (avatarUrl: string) => {
    const { error } = await supabase
      .from("students")
      .update({ avatar_url: avatarUrl })
      .eq("id", student.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      });
      return;
    }

    onAvatarUpdate(avatarUrl);
    onAvatarSelectorToggle(false);
    toast({
      title: "Success",
      description: "Avatar updated successfully",
    });
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
          <Avatar className="h-20 w-20 cursor-pointer ring-2 ring-white/20 group-hover:ring-white/40 transition-all relative">
            {student.avatar_url ? (
              <AvatarImage src={student.avatar_url} alt={`${student.first_name}'s avatar`} />
            ) : (
              <AvatarFallback className="bg-[#334155]">
                <Camera className="h-8 w-8 text-white/70" />
              </AvatarFallback>
            )}
          </Avatar>
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer"
            onClick={() => onAvatarSelectorToggle(true)}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
          {showAvatarSelector && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-[#1E293B] rounded-lg shadow-xl grid grid-cols-3 gap-2 z-50 border border-white/10 animate-scale-in">
              {[
                "/avatars/kid-astronaut.png",
                "/avatars/kid-superhero.png",
                "/avatars/kid-scientist.png",
                "/avatars/kid-artist.png",
                "/avatars/kid-chef.png",
                "/avatars/kid-explorer.png",
              ].map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="Avatar option"
                  className="w-16 h-16 rounded cursor-pointer hover:ring-2 ring-white/40 transition-all hover:scale-110"
                  onClick={() => updateAvatar(avatar)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Welcome, {student.first_name}!
            </h2>
            <div className="relative">
              {animationData && (
                <Lottie 
                  animationData={animationData}
                  loop={true}
                  style={{ width: 50, height: 50 }}
                  className="opacity-90"
                />
              )}
            </div>
          </div>
          <div className="flex items-center mt-1 mb-2">
            <div className="relative mr-3">
              <Trophy className="h-5 w-5 text-yellow-500 animate-pulse" />
              <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-white/70">
              Coins Earned: <span className="text-yellow-500 font-bold">{student.points}</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white/70">Overall Progress</span>
              <span className="text-sm text-white/70">
                {calculateTotalProgress(student.course_progress)}%
              </span>
            </div>
            <Progress 
              value={calculateTotalProgress(student.course_progress)} 
              className="h-2 bg-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
