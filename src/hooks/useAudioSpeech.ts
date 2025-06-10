
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAudioSpeech = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  const lastAudioElement = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, string>>(new Map());

  const speakText = async (text: string, subtext: string | undefined = undefined, elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Combine main text and subtext if available
      const textToSpeak = subtext ? `${text}. ${subtext}` : text;
      
      console.log('Starting speech generation for:', textToSpeak);
      
      if (lastAudioElement.current) {
        console.log('Stopping previous audio');
        lastAudioElement.current.pause();
        lastAudioElement.current = null;
      }

      setIsLoading(elementId);

      const cachedAudioUrl = audioCache.current.get(textToSpeak);
      if (cachedAudioUrl) {
        console.log('Using cached audio for:', textToSpeak);
        const audio = new Audio(cachedAudioUrl);
        lastAudioElement.current = audio;
        await audio.play();
        setIsLoading(null);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textToSpeak,
          voice: "alloy",
        },
      });
      
      if (error) {
        console.error('Error invoking text-to-speech:', error);
        throw new Error('Failed to generate speech');
      }
      
      if (!data || !data.audioContent) {
        throw new Error('No audio content returned');
      }

      console.log('Got audio response, creating blob...');
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      
      audioCache.current.set(textToSpeak, audioUrl);
      
      const audio = new Audio(audioUrl);
      
      audio.oncanplay = () => console.log('Audio ready to play');
      audio.onplay = () => console.log('Audio started playing');
      audio.onended = () => {
        console.log('Audio finished playing');
        lastAudioElement.current = null;
      };
      audio.onerror = (e) => console.error('Audio playback error:', e);

      lastAudioElement.current = audio;
      console.log('Starting audio playback...');
      await audio.play();
    } catch (error) {
      console.error('Error in speakText:', error);
    } finally {
      setIsLoading(null);
    }
  };

  useEffect(() => {
    return () => {
      audioCache.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      audioCache.current.clear();
    };
  }, []);

  return {
    speakText,
    isLoading,
    hasPlayedWelcome,
    setHasPlayedWelcome
  };
};
