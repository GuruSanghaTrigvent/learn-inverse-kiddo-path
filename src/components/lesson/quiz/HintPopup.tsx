
import React from 'react';

interface HintPopupProps {
  visible: boolean;
  hintText: string;
}

export const HintPopup: React.FC<HintPopupProps> = ({ visible, hintText }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg text-center w-4/5 max-w-xs animate-fade-in border-4 border-kid-yellow z-30">
      <div className="text-md font-medium">{hintText}</div>
      <div className="text-2xl mt-2 flex justify-center">
        <span>💡</span>
      </div>
    </div>
  );
};
