import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw, Play, Volume2, Sparkles, Music } from "lucide-react";
import { useAudioSpeech } from "@/hooks/useAudioSpeech";

interface MatchingGameProps {
  onComplete: () => void;
}

interface Job {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { speakText, isLoading } = useAudioSpeech();
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "doctor",
      title: "Doctor",
      description: "Helps people get better when they are sick or injured",
      image: "/images/doctor-helping.jpg"
    },
    {
      id: "builder",
      title: "Builder",
      description: "Helps people by building safe homes and buildings",
      image: "/images/builder-working.jpg"
    },
    {
      id: "baker",
      title: "Baker",
      description: "Helps people by making delicious bread and treats",
      image: "/images/baker-baking.jpg"
    },
    {
      id: "teacher",
      title: "Teacher",
      description: "Helps people learn new things and develop skills",
      image: "/placeholders/sad-friend.jpg" // Using placeholder as we don't have a teacher image
    }
  ]);

  const [shuffledDescriptions, setShuffledDescriptions] = useState<string[]>([]);
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasNotifiedCompletion, setHasNotifiedCompletion] = useState<boolean>(false);

  const instructionText = "Ok! Next step! Match each job with how they help people!";

  useEffect(() => {
    const descriptions = [...jobs.map(job => job.description)];
    for (let i = descriptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [descriptions[i], descriptions[j]] = [descriptions[j], descriptions[i]];
    }
    setShuffledDescriptions(descriptions);
  }, [jobs]);

  // Add effect to call onComplete when game is completed
  useEffect(() => {
    if (isCompleted && !hasNotifiedCompletion) {
      // Set a flag to prevent multiple calls
      setHasNotifiedCompletion(true);
      
      // Give a short delay for the confetti and toast to be visible
      const timer = setTimeout(() => {
        console.log("Calling onComplete from MatchingGame");
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isCompleted, hasNotifiedCompletion, onComplete]);

  const checkAllMatches = () => {
    if (Object.keys(matches).length !== jobs.length) {
      toast({
        title: "Not quite there yet!",
        description: "Make sure to match all jobs with how they help people.",
        variant: "default",
      });
      return;
    }

    const allCorrect = jobs.every(job => 
      matches[job.id] === job.description
    );

    if (allCorrect) {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Great job! 🎉",
        description: "You've matched all jobs correctly!",
        variant: "default",
      });
      
      // We're removing this direct call as it will be handled by the useEffect
      // onComplete();
    } else {
      toast({
        title: "Try again!",
        description: "Some matches aren't quite right. Review your choices.",
        variant: "destructive",
      });
    }
  };

  const handleJobClick = (jobId: string) => {
    setSelectedJob(jobId === selectedJob ? null : jobId);
  };

  const handleDescriptionClick = (description: string) => {
    if (selectedJob) {
      setMatches({
        ...matches,
        [selectedJob]: description
      });
      setSelectedJob(null);
    }
  };

  const handleReset = () => {
    setMatches({});
    setSelectedJob(null);
  };

  const handlePlayInstructions = (e: React.MouseEvent) => {
    e.preventDefault();
    speakText(instructionText, undefined, "instructions", e);
  };

  const handlePlayJobContent = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    speakText(job.title, undefined, job.id, e);
  };

  const handlePlayDescription = (e: React.MouseEvent, description: string, index: number) => {
    e.stopPropagation();
    speakText(description, undefined, `description-${index}`, e);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Matching Game</h2>
        <Button 
          onClick={handlePlayInstructions}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-kid-purple to-kid-pink-light text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 animate-pulse-slow shadow-md border-2 border-white"
          disabled={isLoading !== null}
        >
          {isLoading === "instructions" ? (
            <span className="animate-pulse">Speaking...</span>
          ) : (
            <>
              <Music className="mr-1 h-5 w-5 animate-spin-slow" /> 
              <span>Listen!</span>
              <Sparkles className="h-5 w-5 text-yellow-200 animate-spin-slow" />
            </>
          )}
        </Button>
      </div>
      
      <p className="text-center mb-8">
        Match each job with how they help people. Click on a job, then click on the matching description.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center mb-2">Jobs</h3>
          {jobs.map((job) => (
            <Card 
              key={job.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md 
                ${selectedJob === job.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                ${matches[job.id] ? 'bg-green-50' : ''}`}
              onClick={() => handleJobClick(job.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={job.image} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-lg">{job.title}</h4>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => handlePlayJobContent(e, job)}
                      disabled={isLoading === job.id}
                    >
                      {isLoading === job.id ? (
                        <span className="animate-pulse">•••</span>
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {matches[job.id] && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Check className="w-4 h-4 mr-1" /> Matched
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center mb-2">How They Help</h3>
          {shuffledDescriptions.map((description, index) => {
            const isMatched = Object.values(matches).includes(description);
            
            return (
              <Card 
                key={index}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md
                  ${isMatched ? 'bg-green-50 opacity-75' : ''}`}
                onClick={() => !isMatched && handleDescriptionClick(description)}
              >
                <div className="flex justify-between items-center">
                  <p className={`${isMatched ? 'text-green-700' : ''} flex-1`}>
                    {description}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 ml-2"
                    onClick={(e) => handlePlayDescription(e, description, index)}
                    disabled={isLoading === `description-${index}` || isMatched}
                  >
                    {isLoading === `description-${index}` ? (
                      <span className="animate-pulse">•••</span>
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 flex justify-center space-x-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Reset
        </Button>
        
        <Button 
          onClick={checkAllMatches}
          className="bg-kid-green hover:bg-kid-green-dark"
          disabled={Object.keys(matches).length !== jobs.length}
        >
          Check Answers
        </Button>
      </div>
      
      {isCompleted && (
        <div className="mt-8 text-center">
          <p className="text-xl font-semibold text-green-700 animate-bounce">
            Great job! You've completed the matching game!
          </p>
        </div>
      )}
    </div>
  );
};
