
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useCurrentStudent } from "@/hooks/useCurrentStudent";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import { useLessonData } from "@/hooks/useLessonData";
import { LessonContent } from "@/components/lesson/LessonContent";

const Lesson = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { selectedStudentId, studentName } = useCurrentStudent();
  const { hasPlayedWelcome } = useWelcomeMessage(studentName);
  const { lesson, sections } = useLessonData(lessonId);

  const {
    completedSections,
    currentSectionIndex,
    setCurrentSectionIndex,
    handleSectionComplete,
    getProgress
  } = useLessonProgress(selectedStudentId, lessonId, sections, lesson?.points || 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {lesson && (
            <LessonContent 
              lesson={lesson}
              sections={sections}
              completedSections={completedSections}
              currentSectionIndex={currentSectionIndex}
              setCurrentSectionIndex={setCurrentSectionIndex}
              handleSectionComplete={handleSectionComplete}
              getProgress={getProgress}
              lessonId={lessonId}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Lesson;
