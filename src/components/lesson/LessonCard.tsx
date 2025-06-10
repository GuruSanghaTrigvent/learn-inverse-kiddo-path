
import React from "react";
import { Trophy, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LessonSection } from "./LessonSection";

interface LessonCardProps {
  section: {
    id: string;
    type: "video" | "interactive" | "challenge" | "quiz";
    content: any;
    order_number: number;
  };
  index: number;
  totalSections: number;
  isCompleted: boolean;
  isCurrentSection: boolean;
  canProceed: boolean;
  onComplete: () => void;
  onSelectSection: () => void;
  lessonId?: string;
}

export const LessonCard = ({
  section,
  index,
  totalSections,
  isCompleted,
  isCurrentSection,
  canProceed,
  onComplete,
  onSelectSection,
  lessonId
}: LessonCardProps) => {
  return (
    <div className="relative mb-16" onClick={onSelectSection}>
      <Card className={`
        transition-all duration-300 
        ${canProceed ? 'opacity-100 transform-none' : 'opacity-50 pointer-events-none'}
        ${isCurrentSection ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        cursor-pointer hover:scale-[1.01]
      `}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Section {index + 1}: {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
            </h3>
            {isCompleted && (
              <Trophy className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <Progress 
            value={isCompleted ? 100 : 0} 
            className={`h-2 ${isCompleted ? 'bg-yellow-500/20' : ''}`}
          />
        </CardHeader>
        <CardContent>
          {canProceed && (
            <LessonSection
              type={section.type}
              content={section.content}
              isCompleted={isCompleted}
              onComplete={onComplete}
              lessonId={lessonId}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {isCompleted ? 'Completed' : 'In Progress'}
            </span>
            <Progress 
              value={isCompleted ? 100 : 0}
              className={`w-20 ${isCompleted ? 'bg-yellow-500/20' : ''}`}
            />
          </div>
        </CardFooter>
      </Card>
      
      {index < totalSections - 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
            <ChevronDown className="h-6 w-6 text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};
