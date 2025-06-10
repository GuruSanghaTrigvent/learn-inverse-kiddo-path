
import React, { ReactNode } from 'react';

interface ThemeBackgroundProps {
  theme: string;
  children: ReactNode;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme, children }) => {
  return (
    <div className={`relative rounded-3xl shadow-xl overflow-hidden ${
      theme === "jungle" ? "bg-gradient-to-b from-kid-green-light to-kid-green" :
      theme === "ocean" ? "bg-gradient-to-b from-kid-blue-light to-kid-blue" :
      theme === "space" ? "bg-gradient-to-b from-kid-purple-light to-kid-purple" :
      "bg-gradient-to-b from-kid-pink-light to-kid-pink"
    }`}>
      {children}
      
      {theme === "jungle" && (
        <>
          <div className="absolute bottom-0 left-5 w-8 h-8 flex items-center justify-center animate-wobble" style={{animationDelay: "0.5s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "1.5rem" }}>🌿</span>
          </div>
          <div className="absolute top-5 right-10 w-6 h-6 flex items-center justify-center animate-float" style={{animationDelay: "1.2s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "1.25rem" }}>🦋</span>
          </div>
        </>
      )}
      
      {theme === "ocean" && (
        <>
          <div className="absolute bottom-5 left-10 w-8 h-8 flex items-center justify-center animate-float" style={{animationDelay: "0.5s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "1.5rem" }}>🐠</span>
          </div>
          <div className="absolute top-10 right-10 w-6 h-6 flex items-center justify-center animate-float" style={{animationDelay: "1.2s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "1.25rem" }}>🐙</span>
          </div>
        </>
      )}
      
      {theme === "space" && (
        <>
          <div className="absolute top-10 left-10 w-5 h-5 flex items-center justify-center animate-ping-slow" style={{animationDelay: "0.3s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "0.875rem" }}>⭐</span>
          </div>
          <div className="absolute bottom-10 right-10 w-5 h-5 flex items-center justify-center animate-ping-slow" style={{animationDelay: "0.7s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "0.875rem" }}>⭐</span>
          </div>
        </>
      )}
      
      {theme === "rainbow" && (
        <>
          <div className="absolute top-10 left-10 w-6 h-6 flex items-center justify-center animate-bounce" style={{animationDelay: "0.3s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "1.25rem" }}>🎈</span>
          </div>
          <div className="absolute bottom-10 right-10 w-6 h-6 flex items-center justify-center animate-bounce" style={{animationDelay: "0.7s"}}>
            <span className="flex items-center justify-center" style={{ fontSize: "1.25rem" }}>🎈</span>
          </div>
        </>
      )}
    </div>
  );
};
