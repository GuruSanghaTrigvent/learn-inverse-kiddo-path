
import { useEffect, useState } from "react";

export const useWelcomeMessage = (studentName: string) => {
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  useEffect(() => {
    const playWelcomeMessage = async () => {
      if (studentName && !hasPlayedWelcome) {
        try {
          const response = await fetch('/api/text-to-speech', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: `Hi ${studentName}! Are you ready to start learning together?`,
              voice: 'Lily',
            }),
          });

          if (!response.ok) throw new Error('Failed to generate speech');

          const { audioContent } = await response.json();
          const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
          await audio.play();
          setHasPlayedWelcome(true);
        } catch (error) {
          console.error('Error playing welcome message:', error);
        }
      }
    };

    playWelcomeMessage();
  }, [studentName, hasPlayedWelcome]);

  return {
    hasPlayedWelcome,
    setHasPlayedWelcome
  };
};
