
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLessonProgress = (
  selectedStudentId: string | null,
  lessonId: string | undefined,
  sections: any[],
  lessonPoints: number
) => {
  const { toast } = useToast();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!selectedStudentId || !lessonId) return;

      const { data: progressData, error: progressError } = await supabase
        .from("student_progress")
        .select("*")
        .eq("student_id", selectedStudentId)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (progressError) {
        console.error("Error fetching progress:", progressError);
        toast({
          title: "Error",
          description: "Failed to fetch progress",
          variant: "destructive",
        });
        return;
      }

      if (progressData) {
        setCompletedSections(progressData.completed_sections);
        const lastCompletedIndex = sections.findIndex(
          section => progressData.completed_sections.includes(section.id)
        );
        setCurrentSectionIndex(
          lastCompletedIndex === sections.length - 1 
            ? lastCompletedIndex 
            : Math.max(0, lastCompletedIndex + 1)
        );
      }
    };

    fetchProgress();
  }, [selectedStudentId, lessonId, sections, toast]);

  const updateCourseProgress = async (courseId: string) => {
    try {
      console.log("Updating course progress for course:", courseId);
      
      // Get all lessons for this course
      const { data: lessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", courseId);

      if (lessonsError) throw lessonsError;

      // Get progress for all lessons
      const { data: progress, error: progressError } = await supabase
        .from("student_progress")
        .select("*")
        .eq("student_id", selectedStudentId)
        .in("lesson_id", lessons.map(l => l.id));

      if (progressError) throw progressError;

      // Calculate total progress percentage based on completed lessons
      const totalLessons = lessons.length;
      const completedLessons = progress.filter(p => p.completed_at).length;
      
      // Calculate the exact percentage of progress
      const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;
      
      console.log("Progress calculation:", {
        totalLessons,
        completedLessons,
        progressPercentage,
        exactPercentage: (completedLessons / Math.max(1, totalLessons)) * 100
      });

      // Get the course category
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("category")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      console.log("Course category:", courseData.category);

      // Get current student progress
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("course_progress")
        .eq("id", selectedStudentId)
        .single();

      if (studentError) throw studentError;

      console.log("Current course progress:", student.course_progress);

      // Update the progress for this specific category
      const updatedProgress = {
        ...student.course_progress,
        [courseData.category]: progressPercentage
      };

      console.log("Updated course progress:", updatedProgress);

      // Update the student's course progress
      const { error: updateError } = await supabase
        .from("students")
        .update({ course_progress: updatedProgress })
        .eq("id", selectedStudentId);

      if (updateError) throw updateError;

      console.log("Successfully updated course progress");

    } catch (error) {
      console.error("Error updating course progress:", error);
      toast({
        title: "Error",
        description: "Failed to update course progress",
        variant: "destructive",
      });
    }
  };

  const handleSectionComplete = async (sectionId: string) => {
    if (!selectedStudentId || !lessonId) return;

    if (completedSections.includes(sectionId)) {
      return;
    }

    const newCompletedSections = [...completedSections, sectionId];
    const isLessonCompleted = newCompletedSections.length === sections.length;

    try {
      console.log("Starting section completion...");
      console.log("Current completed sections:", completedSections);
      console.log("New completed sections:", newCompletedSections);
      console.log("Is lesson completed?", isLessonCompleted);

      const { data: existingProgress, error: fetchError } = await supabase
        .from("student_progress")
        .select("*")
        .eq("student_id", selectedStudentId)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Get the course ID for this lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .select("course_id")
        .eq("id", lessonId)
        .single();

      if (lessonError) throw lessonError;

      if (existingProgress) {
        const { error: updateError } = await supabase
          .from("student_progress")
          .update({
            completed_sections: newCompletedSections,
            completed_at: isLessonCompleted ? new Date().toISOString() : null,
          })
          .eq("student_id", selectedStudentId)
          .eq("lesson_id", lessonId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("student_progress")
          .insert({
            student_id: selectedStudentId,
            lesson_id: lessonId,
            completed_sections: newCompletedSections,
            completed_at: isLessonCompleted ? new Date().toISOString() : null,
          });

        if (insertError) throw insertError;
      }

      setCompletedSections(newCompletedSections);

      // Always update course progress when a section is completed
      await updateCourseProgress(lessonData.course_id);

      if (isLessonCompleted) {
        console.log("Awarding points:", lessonPoints);
        const { data: pointsData, error: pointsError } = await supabase.rpc('increment_points', {
          student_id: selectedStudentId,
          points_to_add: lessonPoints
        });

        if (pointsError) {
          console.error("Error awarding points:", pointsError);
          throw pointsError;
        }

        console.log("Points awarded successfully:", pointsData);

        toast({
          title: "Congratulations! 🎉",
          description: `You've completed the lesson and earned ${lessonPoints} coins!`,
        });
      } else {
        toast({
          title: "Great job! 🌟",
          description: "You've completed this section!",
        });
      }
    } catch (error) {
      console.error("Error in handleSectionComplete:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    completedSections,
    currentSectionIndex,
    setCurrentSectionIndex,
    handleSectionComplete,
    getProgress: () => (sections.length > 0 ? (completedSections.length / sections.length) * 100 : 0)
  };
};
