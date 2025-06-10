
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StudentProfile } from "@/components/dashboard/StudentProfile";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { Button } from "@/components/ui/button";
import { Star, StarOff, Trophy, Volume2, VolumeX, Play } from "lucide-react";
import { TreePine, Brush, Sun, Flower2 } from "lucide-react";
import Footer from "@/components/Footer";
import { AgeGroup, Student } from "@/types/student";
import { useStudentData } from "@/hooks/useStudentData";

interface CourseProgress {
  MINDSET: number;
  HOME_MAINTENANCE: number;
  COOKING: number;
  CAREER: number;
  SOCIAL: number;
}

const courseCategories = [
  {
    emoji: "💝",
    title: "MONEY EXPLORERS",
    description: "Learn about money & business!",
    color: "bg-yellow-500/20 hover:bg-yellow-500/30",
    progressKey: "CAREER" as keyof CourseProgress,
    icon: <Sun className="w-12 h-12 text-yellow-500" />,
    courseId: "fe6a6e85-bf43-4386-a204-de6481be7248",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "🧩",
    title: "BIG THINKERS",
    description: "Learn to be brave & try new things!",
    color: "bg-indigo-500/20 hover:bg-indigo-500/30",
    progressKey: "MINDSET" as keyof CourseProgress,
    icon: <Star className="w-12 h-12 text-indigo-500" />,
    courseId: "5f3c9a7e-2d8b-4f5a-9e6c-3d2f1b7e8a9b",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "🏡",
    title: "HOME HELPERS",
    description: "Cooking, cleaning & independence",
    color: "bg-blue-500/20 hover:bg-blue-500/30",
    progressKey: "HOME_MAINTENANCE" as keyof CourseProgress,
    icon: <TreePine className="w-12 h-12 text-blue-500" />,
    courseId: "6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "👑",
    title: "LEADERS IN TRAINING",
    description: "Develop leadership skills and guide others",
    color: "bg-purple-500/20 hover:bg-purple-500/30",
    progressKey: "MINDSET" as keyof CourseProgress,
    icon: <Star className="w-12 h-12 text-purple-500" />,
    courseId: "leaders-in-training",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "🧩",
    title: "SUPER THINKERS",
    description: "Mindset & Success",
    color: "bg-indigo-500/20 hover:bg-indigo-500/30",
    progressKey: "MINDSET" as keyof CourseProgress,
    icon: <Star className="w-12 h-12 text-indigo-500" />,
    courseId: "super-thinkers-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "💝",
    title: "MONEY ADVENTURERS",
    description: "Financial Literacy & Entrepreneurship",
    color: "bg-yellow-500/20 hover:bg-yellow-500/30",
    progressKey: "CAREER" as keyof CourseProgress,
    icon: <Sun className="w-12 h-12 text-yellow-500" />,
    courseId: "money-adventurers-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "👑",
    title: "FUTURE LEADERS",
    description: "Leadership & Communication",
    color: "bg-purple-500/20 hover:bg-purple-500/30",
    progressKey: "MINDSET" as keyof CourseProgress,
    icon: <Star className="w-12 h-12 text-purple-500" />,
    courseId: "future-leaders-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "🤝",
    title: "HELPING HANDS",
    description: "How People Help the World",
    color: "bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] hover:from-[#FEC6A1] hover:to-[#FDE1D3]",
    progressKey: "SOCIAL" as keyof CourseProgress,
    icon: <Flower2 className="w-12 h-12 text-green-500" />,
    courseId: "helping-hands-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "🏠",
    title: "LIFE SUPERSTARS",
    description: "Cooking, Cleaning & Independence",
    color: "bg-blue-500/20 hover:bg-blue-500/30",
    progressKey: "HOME_MAINTENANCE" as keyof CourseProgress,
    icon: <TreePine className="w-12 h-12 text-blue-500" />,
    courseId: "life-superstars-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "🧠",
    title: "MINDSET MASTERS",
    description: "Mindset & Success",
    color: "bg-indigo-500/20 hover:bg-indigo-500/30",
    progressKey: "MINDSET" as keyof CourseProgress,
    icon: <Star className="w-12 h-12 text-indigo-500" />,
    courseId: "mindset-masters-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "💰",
    title: "MONEY MAKERS",
    description: "Financial Literacy & Entrepreneurship",
    color: "bg-yellow-500/20 hover:bg-yellow-500/30",
    progressKey: "CAREER" as keyof CourseProgress,
    icon: <Sun className="w-12 h-12 text-yellow-500" />,
    courseId: "money-makers-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "🚀",
    title: "LEAD THE WAY",
    description: "Leadership & Communication",
    color: "bg-purple-500/20 hover:bg-purple-500/30",
    progressKey: "MINDSET" as keyof CourseProgress,
    icon: <Star className="w-12 h-12 text-purple-500" />,
    courseId: "lead-the-way-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "🌎",
    title: "THE WORLD OF WORK",
    description: "How People Help the World",
    color: "bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] hover:from-[#FEC6A1] hover:to-[#FDE1D3]",
    progressKey: "SOCIAL" as keyof CourseProgress,
    icon: <Flower2 className="w-12 h-12 text-green-500" />,
    courseId: "world-of-work-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "🏡",
    title: "LIFE READY",
    description: "Cooking, Cleaning & Independence",
    color: "bg-blue-500/20 hover:bg-blue-500/30",
    progressKey: "HOME_MAINTENANCE" as keyof CourseProgress,
    icon: <TreePine className="w-12 h-12 text-blue-500" />,
    courseId: "life-ready-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  }
];

const kidFriendlyCategories = [
  {
    emoji: "💝",
    title: "Money Explorers",
    description: "Learn about money & business!",
    color: "bg-kid-pink-light hover:bg-kid-pink-light/80",
    progressKey: "CAREER" as keyof CourseProgress,
    courseId: "fe6a6e85-bf43-4386-a204-de6481be7248",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "🧩",
    title: "Big Thinkers",
    description: "Learn to be brave & try new things!",
    color: "bg-kid-blue-light hover:bg-kid-blue-light/80",
    progressKey: "MINDSET" as keyof CourseProgress,
    courseId: "5f3c9a7e-2d8b-4f5a-9e6c-3d2f1b7e8a9b",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "🏠",
    title: "Home Helpers",
    description: "Cooking, cleaning & independence",
    color: "bg-kid-green-light hover:bg-kid-green-light/80",
    progressKey: "HOME_MAINTENANCE" as keyof CourseProgress,
    courseId: "6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "👑",
    title: "Leaders in Training",
    description: "Learn to lead and guide others!",
    color: "bg-kid-purple-light hover:bg-kid-purple-light/80",
    progressKey: "MINDSET" as keyof CourseProgress,
    courseId: "leaders-in-training",
    ageGroups: ["GROUP_5_6"] as AgeGroup[]
  },
  {
    emoji: "🧩",
    title: "Super Thinkers",
    description: "Mindset & Success",
    color: "bg-kid-blue-light hover:bg-kid-blue-light/80",
    progressKey: "MINDSET" as keyof CourseProgress,
    courseId: "super-thinkers-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "💝",
    title: "Money Adventurers",
    description: "Financial Literacy & Entrepreneurship",
    color: "bg-kid-pink-light hover:bg-kid-pink-light/80",
    progressKey: "CAREER" as keyof CourseProgress,
    courseId: "money-adventurers-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "👑",
    title: "Future Leaders",
    description: "Leadership & Communication",
    color: "bg-kid-purple-light hover:bg-kid-purple-light/80",
    progressKey: "MINDSET" as keyof CourseProgress,
    courseId: "future-leaders-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "🤝",
    title: "Helping Hands",
    description: "How People Help the World",
    color: "bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] hover:from-[#FEC6A1] hover:to-[#FDE1D3]",
    progressKey: "SOCIAL" as keyof CourseProgress,
    courseId: "helping-hands-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "🏠",
    title: "Life Superstars",
    description: "Cooking, Cleaning & Independence",
    color: "bg-kid-green-light hover:bg-kid-green-light/80",
    progressKey: "HOME_MAINTENANCE" as keyof CourseProgress,
    courseId: "life-superstars-7-9",
    ageGroups: ["GROUP_7_9"] as AgeGroup[]
  },
  {
    emoji: "🧠",
    title: "Mindset Masters",
    description: "Mindset & Success",
    color: "bg-kid-blue-light hover:bg-kid-blue-light/80",
    progressKey: "MINDSET" as keyof CourseProgress,
    courseId: "mindset-masters-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "💰",
    title: "Money Makers",
    description: "Financial Literacy & Entrepreneurship",
    color: "bg-kid-pink-light hover:bg-kid-pink-light/80",
    progressKey: "CAREER" as keyof CourseProgress,
    courseId: "money-makers-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "🚀",
    title: "Lead the Way",
    description: "Leadership & Communication",
    color: "bg-kid-purple-light hover:bg-kid-purple-light/80",
    progressKey: "MINDSET" as keyof CourseProgress,
    courseId: "lead-the-way-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "🌎",
    title: "The World of Work",
    description: "How People Help the World",
    color: "bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] hover:from-[#FEC6A1] hover:to-[#FDE1D3]",
    progressKey: "SOCIAL" as keyof CourseProgress,
    courseId: "world-of-work-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  },
  {
    emoji: "🏡",
    title: "Life Ready",
    description: "Cooking, Cleaning & Independence",
    color: "bg-kid-green-light hover:bg-kid-green-light/80",
    progressKey: "HOME_MAINTENANCE" as keyof CourseProgress,
    courseId: "life-ready-10-12",
    ageGroups: ["GROUP_10_12"] as AgeGroup[]
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { students, isLoading: studentsLoading, setStudents } = useStudentData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [courses, setCourses] = useState<Record<string, any>[]>([]);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const lastAudioElement = useRef<HTMLAudioElement | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioCache = useRef<Map<string, string>>(new Map());
  const [actualProgress, setActualProgress] = useState<CourseProgress | null>(null);
  const [filteredKidCategories, setFilteredKidCategories] = useState(kidFriendlyCategories);
  const [filteredAdultCategories, setFilteredAdultCategories] = useState(courseCategories);
  const [courseCompletionStatus, setCourseCompletionStatus] = useState<Record<string, boolean>>({});

  const handleStudentChange = (student: Student) => {
    setSelectedStudent(student);
    fetchActualProgress(student.id);
    fetchLessonProgress(student.id);
  };

  const fetchLessonProgress = async (studentId: string) => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("id, category");
      
      if (coursesError) throw coursesError;
      
      let completionStatus: Record<string, boolean> = {};
      
      for (const course of coursesData) {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("id")
          .eq("course_id", course.id);
          
        if (lessonsError) throw lessonsError;
        
        if (!lessonsData || lessonsData.length === 0) {
          completionStatus[course.category] = false;
          continue;
        }
        
        const lessonIds = lessonsData.map(lesson => lesson.id);
        const { data: progressData, error: progressError } = await supabase
          .from("student_progress")
          .select("lesson_id, completed_at")
          .eq("student_id", studentId)
          .in("lesson_id", lessonIds);
          
        if (progressError) throw progressError;
        
        const totalLessons = lessonsData.length;
        const completedLessons = progressData.filter(p => p.completed_at !== null).length;
        
        console.log(`Course ${course.category} completion check: ${completedLessons}/${totalLessons} lessons completed`);
        
        completionStatus[course.category] = completedLessons === totalLessons && totalLessons > 0;
      }
      
      console.log("Final course completion status:", completionStatus);
      setCourseCompletionStatus(completionStatus);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
    }
  };

  const speakText = async (text: string, elementId: string) => {
    if (!isSoundEnabled) return;
    
    try {
      console.log('Starting speech generation for:', text);
      
      if (lastAudioElement.current) {
        console.log('Stopping previous audio');
        lastAudioElement.current.pause();
        lastAudioElement.current = null;
      }

      setIsLoading(elementId);

      const cachedAudioUrl = audioCache.current.get(text);
      if (cachedAudioUrl) {
        console.log('Using cached audio for:', text);
        const audio = new Audio(cachedAudioUrl);
        lastAudioElement.current = audio;
        await audio.play();
        setIsLoading(null);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text,
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

      console.log('Got audio response, creating blob...');
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      
      audioCache.current.set(text, audioUrl);
      
      const audio = new Audio(audioUrl);
      
      audio.oncanplay = () => console.log('Audio ready to play');
      audio.onplay = () => console.log('Audio started playing');
      audio.onended = () => {
        console.log('Audio finished playing');
        lastAudioElement.current = null;
      };
      audio.onerror = (e) => console.error('Audio playback error:', e);

      lastAudioElement.current = audio;
      console.log('Starting audio playback...');
      await audio.play();
    } catch (error) {
      console.error('Error in speakText:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleStartGuidedLearning = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    const currentCategory = filteredAdultCategories[currentCourseIndex];
    const matchingKidCategory = filteredKidCategories.find(
      cat => cat.progressKey === currentCategory.progressKey
    );
    
    if (matchingKidCategory) {
      navigate(`/course/${matchingKidCategory.courseId}`);
    } else {
      toast({
        title: "Coming Soon",
        description: "This course is not available yet",
      });
    }
  };

  const handlePlayVoice = async () => {
    try {
      if (lastAudioElement.current) {
        lastAudioElement.current.pause();
        lastAudioElement.current = null;
      }
      
      setIsLoading("start-journey");
      await speakText("Start Learning Journey", "start-journey");
    } catch (error) {
      console.error('Error playing voice:', error);
    }
  };

  const handleCategoryClick = async (category: keyof CourseProgress, courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    if (selectedStudent) {
      setSelectedStudent({ ...selectedStudent, avatar_url: avatarUrl });
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id ? { ...student, avatar_url: avatarUrl } : student
      );
      setStudents(updatedStudents);
    }
  };

  const isCourseCompleted = (index: number) => {
    if (!selectedStudent?.course_progress) {
      console.log("No course progress available");
      return false;
    }
    
    if (index < 0 || index >= filteredAdultCategories.length) {
      console.log(`Invalid index: ${index}`);
      return false;
    }
    
    const category = filteredAdultCategories[index].progressKey;
    
    if (courseCompletionStatus[category] !== undefined) {
      console.log(`Course ${index} (${category}) completion based on lessons: ${courseCompletionStatus[category]}`);
      return courseCompletionStatus[category];
    }
    
    console.log(`Checking completion for category ${category}: ${selectedStudent.course_progress[category]}`);
    
    const progress = selectedStudent.course_progress[category];
    const isComplete = progress === 100;
    
    console.log(`Course ${index} (${category}) progress: ${progress}, type: ${typeof progress}, isComplete: ${isComplete}`);
    return isComplete;
  };

  const fetchActualProgress = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId);
        
      if (error) {
        console.error('Error fetching student progress:', error);
        return;
      }
      
      console.log('Fetched actual progress data from database:', data);
      
      if (data && Array.isArray(data)) {
        if (data.length > 0) {
          const courseProgress = data[0].course_progress;
          setActualProgress(courseProgress);
        }
      }
    } catch (err) {
      console.error('Error in fetchActualProgress:', err);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: coursesData, error } = await supabase
        .from("courses")
        .select("*");

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch courses",
          variant: "destructive",
        });
        return;
      }

      const updatedCourseCategories = [...courseCategories];
      const updatedKidFriendlyCategories = [...kidFriendlyCategories];
      
      coursesData.forEach(course => {
        if (course.title === "Leaders in Training") {
          const adultIndex = updatedCourseCategories.findIndex(c => c.title === "LEADERS IN TRAINING");
          if (adultIndex !== -1) {
            updatedCourseCategories[adultIndex].courseId = course.id;
          }
          
          const kidIndex = updatedKidFriendlyCategories.findIndex(c => c.title === "Leaders in Training");
          if (kidIndex !== -1) {
            updatedKidFriendlyCategories[kidIndex].courseId = course.id;
          }
        }
      });
      
      setCourses(coursesData);
    };

    fetchCourses();
  }, [toast]);

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      handleStudentChange(students[0]);
    }
  }, [students, selectedStudent]);

  useEffect(() => {
    return () => {
      audioCache.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      audioCache.current.clear();
    };
  }, []);

  useEffect(() => {
    if (selectedStudent && selectedStudent.age_group) {
      const ageAppropriateAdultCategories = courseCategories.filter(category => 
        category.ageGroups.includes(selectedStudent.age_group)
      );
      setFilteredAdultCategories(ageAppropriateAdultCategories);
      
      const ageAppropriateKidCategories = kidFriendlyCategories.filter(category => 
        category.ageGroups.includes(selectedStudent.age_group)
      );
      setFilteredKidCategories(ageAppropriateKidCategories);
      
      if (currentCourseIndex >= ageAppropriateAdultCategories.length) {
        setCurrentCourseIndex(0);
      }
      
      console.log(`Filtered courses for age group ${selectedStudent.age_group}:`, 
        ageAppropriateKidCategories.map(c => c.title));
      
      setActualProgress(null);
      
      if (selectedStudent.id) {
        fetchActualProgress(selectedStudent.id);
        fetchLessonProgress(selectedStudent.id);
      }
    }
  }, [selectedStudent, currentCourseIndex]);

  useEffect(() => {
    if (selectedStudent?.course_progress) {
      const updateStudentProgress = async () => {
        if (!selectedStudent || !selectedStudent.id) return;
        
        try {
          for (const [category, isCompleted] of Object.entries(courseCompletionStatus)) {
            const currentProgress = selectedStudent.course_progress[category as keyof CourseProgress];
            const targetProgress = isCompleted ? 100 : Math.min(99, currentProgress);
            
            if ((currentProgress === 100 && !isCompleted) || (currentProgress !== 100 && isCompleted)) {
              console.log(`Fixing progress mismatch for ${category}: Current=${currentProgress}, Should be ${isCompleted ? 100 : 'less than 100'}`);
              
              const updatedProgress = {
                ...selectedStudent.course_progress,
                [category]: targetProgress
              };
              
              await supabase
                .from('students')
                .update({ course_progress: updatedProgress })
                .eq('id', selectedStudent.id);
                
              setSelectedStudent({
                ...selectedStudent,
                course_progress: updatedProgress
              });
            }
          }
        } catch (error) {
          console.error("Error updating student progress:", error);
        }
      };
      
      updateStudentProgress();
    }
  }, [selectedStudent?.id, courseCompletionStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow">
        <DashboardHeader
          students={students}
          selectedStudent={selectedStudent}
          onStudentChange={handleStudentChange}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {selectedStudent && (
            <StudentProfile
              student={selectedStudent}
              onAvatarUpdate={handleAvatarUpdate}
              showAvatarSelector={showAvatarSelector}
              onAvatarSelectorToggle={setShowAvatarSelector}
            />
          )}

          <div className="mb-8 flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              Start Learning Journey
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayVoice();
                }}
                disabled={!isSoundEnabled}
                className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors inline-flex"
              >
                <Volume2 className="w-5 h-5 text-yellow-400 animate-pulse" />
                {isLoading === "start-journey" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                )}
              </button>
            </h2>
            
            <Button 
              onClick={handleStartGuidedLearning}
              className="group relative w-32 h-32 rounded-full 
                bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#F97316]
                hover:from-[#9B69FA] hover:via-[#E456FF] hover:to-[#FF8326]
                shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]
                hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.7)]
                transition-all duration-300 ease-out
                hover:scale-105 active:scale-95
                flex items-center justify-center
                overflow-hidden
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 animate-spin-slow [animation-duration:10s] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <Play className="w-24 h-24 text-white transform transition-transform duration-300 group-hover:scale-110 relative z-10 stroke-[3]" />
            </Button>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-4">
                  {filteredAdultCategories.map((_, index) => {
                    const completed = isCourseCompleted(index);
                    
                    return (
                      <div
                        key={index}
                        className={`w-12 h-12 rounded-full flex items-center justify-center 
                          ${completed 
                            ? "bg-gray-800 text-white" 
                            : index === currentCourseIndex
                              ? "bg-purple-500/50 text-white"
                              : "bg-gray-800 text-gray-500"
                          }
                          transition-colors duration-300
                        `}
                      >
                        {completed ? (
                          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <StarOff className="w-6 h-6" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="w-full flex justify-center sm:w-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                    ${Object.values(selectedStudent?.course_progress || {}).every(progress => progress === 100)
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-800 text-gray-500"}
                    transition-colors duration-300
                  `}>
                    <Trophy className={`w-6 h-6 ${Object.values(selectedStudent?.course_progress || {}).every(progress => progress === 100) 
                      ? "text-yellow-400" : ""}`} />
                  </div>
                </div>
              </div>
              
              <div className="text-white/80 text-lg font-medium bg-purple-500/20 px-4 py-1 rounded-full">
                Level One
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-white/90">Or choose your own path:</h2>
            <CourseGrid
              categories={filteredKidCategories}
              progress={selectedStudent?.course_progress}
              onCategoryClick={handleCategoryClick}
              courseCompletionStatus={courseCompletionStatus}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
