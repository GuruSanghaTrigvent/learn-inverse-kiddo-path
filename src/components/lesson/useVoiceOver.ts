
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scenario } from './quiz/QuizTypes';

export const useVoiceOver = (scenarios: Scenario[]) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTimeouts = useRef<number[]>([]);
  const optionAudiosRef = useRef<HTMLAudioElement[]>([]);
  
  // New debug log function to help track voice over state
  const logVoiceOverState = (message: string, data?: any) => {
    console.log(`🔊 VoiceOver: ${message}`, data ? data : '');
  };

  const playVoiceOver = useCallback(async (
    currentScenario: number,
    setIsReading: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveOption: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    logVoiceOverState("Starting voice over for scenario", currentScenario);
    setIsReading(true);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Clear all previous option audios
    optionAudiosRef.current.forEach(audio => {
      if (audio) {
        audio.pause();
        audio.onended = null;
      }
    });
    optionAudiosRef.current = [];
    
    audioTimeouts.current.forEach(timeout => window.clearTimeout(timeout));
    audioTimeouts.current = [];
    
    try {
      const scenario = scenarios[currentScenario];
      
      // Include both question and situation in the text to read
      const textToRead = `${scenario.question}. ${scenario.situation.toLowerCase()}.`;
      
      logVoiceOverState("Invoking text-to-speech with text", textToRead);
      
      // Make request to the API immediately
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textToRead,
          voice: "alloy",
        },
      });
      
      if (error) {
        console.error('Error invoking text-to-speech:', error);
        setIsReading(false);
        return;
      }
      
      logVoiceOverState("Received response from text-to-speech function");
      
      if (data && data.audioContent) {
        logVoiceOverState("Creating audio from base64 data");
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audioRef.current = audio;
        
        // Play audio immediately after creation without waiting for onloadeddata
        audio.play().catch(e => {
          console.error('Error playing audio:', e);
          setIsReading(false);
        });
        
        // After question is read, read each option with minimal delay
        audio.onended = () => {
          logVoiceOverState("Audio ended, reading options immediately");
          // Reduced delay to immediate (no timeout)
          readOptions(scenario, setActiveOption, setIsReading);
        };
      } else {
        console.error('No audio content returned');
        setIsReading(false);
      }
    } catch (error) {
      console.error('Error playing voice over:', error);
      setIsReading(false);
    }
  }, [scenarios]);

  const readOptions = useCallback(async (
    scenario: Scenario,
    setActiveOption: React.Dispatch<React.SetStateAction<number | null>>,
    setIsReading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      // Sequential option reading
      const readOption = async (index: number) => {
        if (index >= scenario.options.length) {
          // All options have been read
          logVoiceOverState("All options have been read");
          setIsReading(false);
          return;
        }
        
        // Set active option for current reading
        setActiveOption(index);
        
        const option = scenario.options[index];
        const optionNumber = index + 1;
        
        // Format the option text with the option number
        const optionText = `Option ${optionNumber}: ${option.text}`;
        logVoiceOverState(`Reading option ${optionNumber}`, optionText);
        
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: {
            text: optionText,
            voice: "alloy",
          },
        });
        
        if (error) {
          console.error('Error invoking text-to-speech for option:', error);
          setActiveOption(null);
          readOption(index + 1); // Continue with next option despite error
          return;
        }
        
        if (data && data.audioContent) {
          const optionAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          optionAudiosRef.current.push(optionAudio);
          
          // Play immediately without waiting for onloadeddata
          optionAudio.play().catch(e => {
            console.error('Error playing option audio:', e);
            setActiveOption(null);
            // Immediate fallback to next option
            readOption(index + 1);
          });
          
          // Move to next option with minimal delay
          optionAudio.onended = () => {
            logVoiceOverState(`Option ${optionNumber} audio finished`);
            setActiveOption(null);
            // Immediately proceed to next option
            readOption(index + 1);
          };
        } else {
          console.error('No audio content returned for option');
          setActiveOption(null);
          readOption(index + 1);
        }
      };
      
      // Start reading the first option
      readOption(0);
      
    } catch (error) {
      console.error('Error reading options:', error);
      setIsReading(false);
    }
  }, []);

  const cleanupAudio = useCallback(() => {
    logVoiceOverState("Cleaning up audio resources");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Clean up all option audios
    optionAudiosRef.current.forEach(audio => {
      if (audio) {
        audio.pause();
        audio.onended = null;
      }
    });
    optionAudiosRef.current = [];
    
    audioTimeouts.current.forEach(timeout => window.clearTimeout(timeout));
  }, []);

  return {
    playVoiceOver,
    cleanupAudio,
    audioRef,
    audioTimeouts
  };
};
