
export interface HelpingQuizGameProps {
  onComplete: () => void;
}

export interface Scenario {
  question: string;
  situation: string;
  options: {
    text: string;
    isHelping: boolean;
  }[];
  feedback: {
    correct: string;
    incorrect: string;
  };
  hint: string;
  imageUrl?: string; // Optional image URL for the scenario
}

export interface ThemeBackgrounds {
  [key: string]: string;
}

export type CharacterState = "neutral" | "excited" | "thinking";
