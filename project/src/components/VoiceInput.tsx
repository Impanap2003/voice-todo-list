import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  error?: string | null;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  isListening,
  onStart,
  onStop,
  error
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={isListening ? onStop : onStart}
        className={`p-2 rounded-full transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-purple-500 hover:bg-purple-600 text-white'
        }`}
        title={isListening ? 'Stop voice input' : 'Start voice input'}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      
      {isListening && (
        <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
          <Volume2 size={16} className="mr-1 animate-pulse" />
          Listening...
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};