
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import CourseBanner from "@/components/course/CourseBanner";
import LessonCard from "@/components/course/LessonCard";
import { useStudentData } from "@/hooks/useStudentData";
import { useAudioSpeech } from "@/hooks/useAudioSpeech";
import { useCourseData } from "@/hooks/useCourseData";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const Course = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { selectedStudentId } = useStudentData();
  const { speakText, isLoading: isAudioLoading } = useAudioSpeech();
  const { course, lessons, getLessonProgress, isLoading } = useCourseData(courseId, selectedStudentId);

  // For debugging
  console.log("Current course:", course);
  console.log("Available lessons:", lessons);

  // Redirect to dashboard if there's an error with the course ID
  useEffect(() => {
    if (!isLoading && !course) {
      console.error("Course not found, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [isLoading, course, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white">
      <div className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="px-2 sm:px-4 text-xl font-poppins"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-6 w-6" /> Go Back
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-16">
              <div className="animate-pulse">
                <Skeleton className="h-48 w-full rounded-3xl bg-white/5" />
              </div>
              <div className="grid grid-cols-1 gap-16">
                <Skeleton className="h-64 w-full rounded-3xl bg-white/5" />
                <Skeleton className="h-64 w-full rounded-3xl bg-white/5" />
              </div>
            </div>
          ) : course ? (
            <div className="space-y-16 animate-fade-in">
              <CourseBanner
                title={course.title}
                description={course.description}
                category={course.category}
                points={course.points}
                speakText={(text, elementId, e) => speakText(text, course.description, elementId, e)}
                isLoading={isAudioLoading}
              />

              <div className="grid grid-cols-1 gap-16">
                {lessons.length === 0 ? (
                  <div className="text-center p-8 bg-white/5 rounded-3xl">
                    <p className="text-xl text-gray-300">No lessons available yet for this course. Check back soon!</p>
                  </div>
                ) : (
                  lessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      index={index}
                      progress={getLessonProgress(lesson.id)}
                      speakText={(text, elementId, e) => speakText(text, lesson.description, elementId, e)}
                      isLoading={isAudioLoading}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-white/5 rounded-3xl">
              <p className="text-xl text-gray-300">Course not found. Please try again or select a different course.</p>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="mt-4"
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Course;
