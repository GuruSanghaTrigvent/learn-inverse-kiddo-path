
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { useAudioSpeech } from "@/hooks/useAudioSpeech";

interface JobMatchingGameProps {
  onComplete: () => void;
}

interface Job {
  job: string;
  help: string;
  image: string;
  voiceIntro: string;
  voiceMatch: string;
}

export const JobMatchingGame: React.FC<JobMatchingGameProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { speakText, isLoading } = useAudioSpeech();
  
  // Three jobs and how they help people
  const jobData: Job[] = [
    {
      job: "Doctor",
      help: "Helps people feel better when they are sick",
      image: "doctor",
      voiceIntro: "I'm a doctor. I help people feel better when they are sick. I check your health and give medicine to make you well again.",
      voiceMatch: "Great job! Doctors help people feel better when they are sick."
    },
    {
      job: "Firefighter",
      help: "Keeps people safe by putting out fires",
      image: "firefighter",
      voiceIntro: "I'm a firefighter. I keep people safe by putting out fires. I also help in emergencies and rescue people who are in danger.",
      voiceMatch: "Excellent! Firefighters keep people safe by putting out fires."
    },
    {
      job: "Teacher",
      help: "Helps children learn new things",
      image: "teacher",
      voiceIntro: "I'm a teacher. I help children learn new things. I teach reading, math, science, and many other subjects to help you grow smart.",
      voiceMatch: "Wonderful! Teachers help children learn new things."
    }
  ];

  // Game states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [helps, setHelps] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [selectedHelp, setSelectedHelp] = useState<number | null>(null);
  const [matches, setMatches] = useState<{jobIndex: number, helpIndex: number}[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [gameComplete, setGameComplete] = useState(false);
  const [hasNotifiedCompletion, setHasNotifiedCompletion] = useState(false);

  // Initialize game and speech synthesis
  useEffect(() => {
    // Shuffle the jobs and helps arrays
    const shuffledJobs = [...jobData].sort(() => Math.random() - 0.5);
    const shuffledHelps = [...jobData].sort(() => Math.random() - 0.5);
    
    setJobs(shuffledJobs);
    setHelps(shuffledHelps);
    
    // Auto-play welcome message after a slight delay
    setTimeout(() => {
      speakText("Welcome to the Job Helpers Matching Game! Click on a job to learn about it, then match it with how they help people.", undefined, "welcome", new Event('init'));
    }, 1000);
    
  }, []);

  // Effect to call onComplete when game is completed
  useEffect(() => {
    if (gameComplete && !hasNotifiedCompletion) {
      // Set a flag to prevent multiple calls
      setHasNotifiedCompletion(true);
      
      // Give a short delay for the confetti and toast to be visible
      const timer = setTimeout(() => {
        console.log("Calling onComplete from JobMatchingGame");
        onComplete();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [gameComplete, hasNotifiedCompletion, onComplete]);

  const handleJobClick = (index: number) => {
    if (matches.some(match => match.jobIndex === index)) return;
    
    setSelectedJob(index);
    
    // Play the job introduction
    speakText(jobs[index].voiceIntro, undefined, `job-${index}`, new Event('click'));
    
    if (selectedHelp !== null) {
      checkMatch(index, selectedHelp);
    }
  };

  const handleHelpClick = (index: number) => {
    if (matches.some(match => match.helpIndex === index)) return;
    
    setSelectedHelp(index);
    if (selectedJob !== null) {
      checkMatch(selectedJob, index);
    }
  };

  const checkMatch = async (jobIndex: number, helpIndex: number) => {
    const jobItem = jobs[jobIndex];
    const helpItem = helps[helpIndex];
    
    if (jobItem.job === helpItem.job) {
      // Correct match
      setMatches([...matches, { jobIndex, helpIndex }]);
      const message = `Great job! A ${jobItem.job} ${jobItem.help.toLowerCase()}`;
      setFeedbackMessage(message);
      setShowFeedback(true);
      
      // Play the success audio after a short delay
      setTimeout(() => {
        speakText(jobItem.voiceMatch, undefined, `match-${jobIndex}`, new Event('match'));
      }, 500);
      
      // Check if game is complete
      if (matches.length === 2) {
        setGameComplete(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Play completion message after matched job voiceover finishes
        setTimeout(() => {
          speakText("Congratulations! You've matched all the jobs with how they help people! Great learning!", undefined, "complete", new Event('complete'));
        }, 4000);
        
        toast({
          title: "Great job! 🎉",
          description: "You've matched all the jobs with how they help people!",
          variant: "default",
        });
      }
    } else {
      // Incorrect match
      const message = `Try again! That's not what a ${jobItem.job} does.`;
      setFeedbackMessage(message);
      setShowFeedback(true);
      
      // Play the try again audio
      speakText("Oops! That's not quite right. Try matching this job with a different way of helping people.", undefined, "tryagain", new Event('incorrect'));
    }
    
    // Reset selections after a short delay
    setTimeout(() => {
      setSelectedJob(null);
      setSelectedHelp(null);
      setShowFeedback(false);
    }, 2000);
  };

  const resetGame = () => {
    // Shuffle the jobs and helps arrays
    const shuffledJobs = [...jobData].sort(() => Math.random() - 0.5);
    const shuffledHelps = [...jobData].sort(() => Math.random() - 0.5);
    
    setJobs(shuffledJobs);
    setHelps(shuffledHelps);
    setSelectedJob(null);
    setSelectedHelp(null);
    setMatches([]);
    setShowFeedback(false);
    setFeedbackMessage("");
    setGameComplete(false);
    setHasNotifiedCompletion(false);
  };

  // Helper function to check if a job is selected
  const isJobSelected = (index: number) => {
    return selectedJob === index;
  };

  // Helper function to check if a help is selected
  const isHelpSelected = (index: number) => {
    return selectedHelp === index;
  };

  // Helper function to check if a job is matched
  const isJobMatched = (index: number) => {
    return matches.some(match => match.jobIndex === index);
  };

  // Helper function to check if a help is matched
  const isHelpMatched = (index: number) => {
    return matches.some(match => match.helpIndex === index);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Job Helpers Matching Game</h1>
      <p className="text-lg text-gray-700 mb-6">Match each job with how they help people!</p>
      
      {/* Audio status indicator */}
      <div className={`mb-4 flex items-center ${isLoading ? 'visible' : 'invisible'}`}>
        {isLoading ? (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
            <span>Speaking...</span>
          </div>
        ) : null}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Jobs column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-blue-600">Jobs</h2>
          {jobs.map((job, index) => (
            <div 
              key={`job-${index}`}
              className={`p-4 rounded-md flex items-center cursor-pointer transition-colors ${
                isJobMatched(index)
                  ? "bg-green-200 border-green-500"
                  : isJobSelected(index)
                  ? "bg-yellow-200 border-yellow-500"
                  : "bg-white hover:bg-blue-100"
              } border-2`}
              onClick={() => handleJobClick(index)}
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                {job.image === "doctor" && (
                  <div className="text-3xl">👨‍⚕️</div>
                )}
                {job.image === "firefighter" && (
                  <div className="text-3xl">👨‍🚒</div>
                )}
                {job.image === "teacher" && (
                  <div className="text-3xl">👩‍🏫</div>
                )}
              </div>
              <span className="text-lg font-medium">{job.job}</span>
            </div>
          ))}
        </div>
        
        {/* Helps column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-blue-600">How They Help</h2>
          {helps.map((help, index) => (
            <div 
              key={`help-${index}`}
              className={`p-4 rounded-md cursor-pointer transition-colors ${
                isHelpMatched(index)
                  ? "bg-green-200 border-green-500"
                  : isHelpSelected(index)
                  ? "bg-yellow-200 border-yellow-500"
                  : "bg-white hover:bg-blue-100"
              } border-2`}
              onClick={() => handleHelpClick(index)}
            >
              <span className="text-lg">{help.help}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Feedback message */}
      {showFeedback && (
        <div className={`mt-6 p-4 rounded-md ${feedbackMessage.includes("Great") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {feedbackMessage}
        </div>
      )}
      
      {/* Game complete message */}
      {gameComplete && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Amazing Job!</h2>
          <p className="text-lg text-gray-700 mb-4">You've matched all the jobs with how they help people!</p>
          <div className="flex space-x-4 justify-center">
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={resetGame}
            >
              Play Again
            </button>
            <button 
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              onClick={(e) => speakText("These jobs are important in our community. Doctors help us feel better when we're sick. Firefighters keep us safe from fires. Teachers help us learn new things every day. What job would you like to do when you grow up?", undefined, "learnmore", e)}
              disabled={isLoading !== null}
            >
              <span className="mr-2">🔊</span>
              Learn More
            </button>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-8 p-4 bg-white rounded-md shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">How to Play:</h3>
        <ol className="list-decimal list-inside text-gray-600">
          <li>Click on a job from the left column to hear about what they do</li>
          <li>Click on how that job helps people from the right column</li>
          <li>Listen to the feedback and match all three jobs to win!</li>
        </ol>
      </div>
      
      {/* Start game button with voiceover */}
      <button 
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        onClick={(e) => speakText("Welcome to the Job Helpers Matching Game! Click on a job to learn about it, then match it with how they help people. Let's learn about important jobs in our community!", undefined, "instructions", e)}
        disabled={isLoading !== null}
      >
        <span className="mr-2">🔊</span>
        Start Game with Voice Instructions
      </button>
    </div>
  );
};

