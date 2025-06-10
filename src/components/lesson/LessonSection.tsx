import React, { useEffect } from "react";
import { HelpingQuizGame } from "./HelpingQuizGame";
import MoneyLessonGame from "./MoneyLessonGame";
import { MatchingGame } from "./MatchingGame";
import { JobMatchingGame } from "./JobMatchingGame";
import { BasicChallenge } from "./BasicChallenge";
import { LessonSection as LessonSectionType } from "@/hooks/useLessonData";

interface LessonSectionProps {
  type: LessonSectionType["type"];
  content: any;
  isCompleted: boolean;
  onComplete: () => void;
  lessonId?: string;
}

export const LessonSection: React.FC<LessonSectionProps> = ({
  type,
  content,
  isCompleted,
  onComplete,
  lessonId
}) => {
  useEffect(() => {
    console.log(`LessonSection rendering with type: "${type}", lessonId: "${lessonId}"`);
    console.log("Content:", content);
  }, [type, content, lessonId]);

  // Determine which component to render based on the section type
  const renderSectionContent = () => {
    console.log(`Rendering section content for type: "${type}"`);
    
    switch (type) {
      case "quiz":
        if (content?.quiz_type === "helping") {
          return <HelpingQuizGame onComplete={onComplete} />;
        } else if (content?.quiz_type === "money") {
          return <MoneyLessonGame onComplete={onComplete} lessonId={lessonId || ""} />;
        }
        // Default money quiz if no specific type is specified
        return <MoneyLessonGame onComplete={onComplete} lessonId={lessonId || ""} />;
      
      case "video":
        return (
          <div className="aspect-video">
            {content?.video_url ? (
              <iframe
                className="w-full h-full rounded-lg"
                src={content.video_url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg p-6">
                <div className="text-center space-y-4">
                  <p className="text-xl font-bold">Trading Before Money</p>
                  <p className="text-gray-700">Before money existed, people had to trade things they had for things they wanted!</p>
                  <div className="flex justify-center items-center space-x-4">
                    <div className="text-center">
                      <span className="text-4xl">🐓</span>
                      <p>Chickens</p>
                    </div>
                    <span className="text-2xl">↔️</span>
                    <div className="text-center">
                      <span className="text-4xl">🍎</span>
                      <p>Apples</p>
                    </div>
                  </div>
                  <p className="text-gray-700">Imagine trading 10 apples for 1 chicken! That would be hard to carry around!</p>
                  <button 
                    onClick={onComplete} 
                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                  >
                    I understand! Money makes trading easier!
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case "interactive":
        console.log("Interactive content type:", content?.type);
        // Check if this is a helping-quiz, jobs-matching, or regular matching game
        if (content?.type === "helping-quiz") {
          return <HelpingQuizGame onComplete={onComplete} />;
        } else if (content?.type === "job-matching" || content?.game_type === "job-matching") {
          return <JobMatchingGame onComplete={onComplete} />;
        }
        // Default to "Match the Money" game
        return <MatchingGame onComplete={onComplete} />;
      
      case "challenge":
        console.log("Rendering challenge section with content:", content);
        return (
          <div className="w-full bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold mb-4">Real-Life Challenge 🏆</h3>
            {content?.title && (
              <h4 className="text-lg font-medium mb-2">{content.title}</h4>
            )}
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              {content?.description ? (
                <p className="text-lg font-medium">{content.description}</p>
              ) : (
                <p className="text-lg font-medium">Ask your parents what they do to earn money!</p>
              )}
              {content?.tasks && Array.isArray(content.tasks) && (
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {content.tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              )}
              {!content?.tasks && (
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>What kind of work do they do?</li>
                  <li>How does their work help other people?</li>
                  <li>What do they like most about their job?</li>
                </ul>
              )}
            </div>
            <p className="text-gray-600 mb-6">
              After you talk with your parents, click the button below to mark this challenge complete!
            </p>
            <button 
              onClick={onComplete}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition font-bold"
            >
              I completed this challenge! ✅
            </button>
          </div>
        );
      
      default:
        console.log(`Unknown section type: "${type}"`);
        return (
          <div className="p-8 text-center">
            <p className="text-lg">Content type not recognized: {type}</p>
            <p className="text-sm text-gray-500 mt-2">This might be a type mismatch or unknown section format.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderSectionContent()}
    </div>
  );
};
