
import React, { useEffect } from "react";
import { LessonCard } from "./LessonCard";
import { LessonHeader } from "./LessonHeader";
import { Lesson, LessonSection } from "@/hooks/useLessonData";

interface LessonContentProps {
  lesson: Lesson;
  sections: LessonSection[];
  completedSections: string[];
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  handleSectionComplete: (sectionId: string) => void;
  getProgress: () => number;
  lessonId?: string;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  sections,
  completedSections,
  currentSectionIndex,
  setCurrentSectionIndex,
  handleSectionComplete,
  getProgress,
  lessonId
}) => {
  const canProceedToNext = (sectionIndex: number) => {
    if (sectionIndex === 0) return true;
    const previousSection = sections[sectionIndex - 1];
    return previousSection && completedSections.includes(previousSection.id);
  };

  useEffect(() => {
    console.log("LessonContent rendering with lessonId:", lessonId);
    console.log("Current sections:", sections);
    console.log("Section types:", sections.map(s => s.type));
    console.log("Has challenge section:", sections.some(s => s.type === "challenge"));
    console.log("Completed sections:", completedSections);
    console.log("Current section index:", currentSectionIndex);
  }, [sections, lessonId, completedSections, currentSectionIndex]);

  // Make sure we have sections to render
  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Loading lesson content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LessonHeader
        title={lesson.title}
        description={lesson.description}
        points={lesson.points}
        progress={getProgress()}
      />

      <div className="space-y-12">
        {sections.map((section, index) => (
          <LessonCard
            key={section.id}
            section={section}
            index={index}
            totalSections={sections.length}
            isCompleted={completedSections.includes(section.id)}
            isCurrentSection={index === currentSectionIndex}
            canProceed={canProceedToNext(index)}
            onComplete={() => handleSectionComplete(section.id)}
            onSelectSection={() => setCurrentSectionIndex(index)}
            lessonId={lessonId}
          />
        ))}
      </div>
    </div>
  );
};
