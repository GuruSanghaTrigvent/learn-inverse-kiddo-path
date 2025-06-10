
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  points: number;
  course_id: string;
}

export interface LessonSection {
  id: string;
  type: "video" | "interactive" | "challenge" | "quiz";
  content: any;
  order_number: number;
  lesson_id?: string;
}

export const useLessonData = (lessonId: string | undefined) => {
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sections, setSections] = useState<LessonSection[]>([]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;

      console.log("Fetching lesson data for lessonId:", lessonId);

      try {
        // Fetch lesson data
        const { data: lessonData, error: lessonError } = await supabase
          .from("lessons")
          .select("*")
          .eq("id", lessonId)
          .single();

        if (lessonError) {
          console.error("Error fetching lesson:", lessonError);
          toast({
            title: "Error",
            description: "Failed to fetch lesson details",
            variant: "destructive",
          });
          return;
        }

        console.log("Lesson data fetched:", lessonData);
        setLesson(lessonData);

        // Fetch lesson sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("lesson_sections")
          .select("*")
          .eq("lesson_id", lessonId)
          .order("order_number");

        if (sectionsError) {
          console.error("Error fetching sections:", sectionsError);
          toast({
            title: "Error",
            description: "Failed to fetch lesson sections",
            variant: "destructive",
          });
          return;
        }

        console.log("Raw sections data from DB:", sectionsData);

        // If we don't have any sections yet, let's add a default set including a challenge
        if (!sectionsData || sectionsData.length === 0) {
          console.log("No sections found, adding default sections including a challenge");
          
          // Create default sections including a challenge section
          const defaultSections: LessonSection[] = [
            {
              id: `${lessonId}-section-1`,
              lesson_id: lessonId,
              type: "video",
              order_number: 1,
              content: {
                video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                description: "Introduction to the lesson"
              }
            },
            {
              id: `${lessonId}-section-2`,
              lesson_id: lessonId,
              type: "interactive",
              order_number: 2,
              content: {
                game_type: "matching",
                description: "Match the concepts"
              }
            },
            {
              id: `${lessonId}-section-3`,
              lesson_id: lessonId,
              type: "challenge",
              order_number: 3,
              content: {
                description: "Test your knowledge"
              }
            }
          ];
          
          setSections(defaultSections);
          console.log("Set default sections:", defaultSections);
        } else {
          console.log("Processing existing sections");
          
          // Cast the section types to match our LessonSection interface
          const typedSections = sectionsData.map(section => {
            // Ensure type is one of our allowed types
            let sectionType = section.type as "video" | "interactive" | "challenge" | "quiz";
            
            // Validate that the type is actually one of our allowed types
            const validTypes = ["video", "interactive", "challenge", "quiz"];
            if (!validTypes.includes(section.type)) {
              console.warn(`Invalid section type found: ${section.type}. Defaulting to "interactive"`);
              sectionType = "interactive";
            }
            
            return {
              ...section,
              type: sectionType
            } as LessonSection;
          });
          
          console.log("Typed sections:", typedSections);
          
          // Check if we already have a challenge section
          let hasChallenge = typedSections.some(section => section.type === "challenge");
          console.log("Has challenge section:", hasChallenge);
          
          if (!hasChallenge) {
            // Add a challenge section if one doesn't exist
            console.log("Adding a challenge section because none exists");
            const challengeSection: LessonSection = {
              id: `${lessonId}-challenge`,
              lesson_id: lessonId,
              type: "challenge",
              order_number: typedSections.length + 1,
              content: {
                description: "Test your knowledge"
              }
            };
            
            // Append the challenge section
            const newSections = [...typedSections, challengeSection];
            console.log("Final sections with challenge:", newSections);
            setSections(newSections);
          } else {
            console.log("Challenge section already exists, using original sections");
            setSections(typedSections);
          }
        }
      } catch (error) {
        console.error("Error in useLessonData:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchLesson();
  }, [lessonId, toast]);

  return {
    lesson,
    sections
  };
};
