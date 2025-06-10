
import React from 'react';
import { ThemeBackground } from './ThemeBackground';

interface IllustrationBoxProps {
  theme: string;
  currentScenario: number;
  spilled: boolean;
  celebrate: boolean;
}

export const IllustrationBox: React.FC<IllustrationBoxProps> = ({ 
  theme, 
  currentScenario, 
  spilled, 
  celebrate 
}) => {
  // This component is now empty since we've removed the emoji container
  return null;
};
