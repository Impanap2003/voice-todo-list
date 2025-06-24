import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon, RefreshCw } from 'lucide-react';
import { getRandomQuote } from '../data/quotes';
import type { Quote } from '../types';

export const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState<Quote>(() => getRandomQuote());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshQuote = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Animation delay
    setQuote(getRandomQuote());
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Set daily quote based on date
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('quote-date');
    
    if (savedDate !== today) {
      localStorage.setItem('quote-date', today);
      setQuote(getRandomQuote());
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-xl p-6 mb-8 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <QuoteIcon size={20} className="mr-2" />
            <span className="text-sm font-medium opacity-90">Daily Motivation</span>
          </div>
          <blockquote className="text-lg md:text-xl font-medium leading-relaxed mb-2">
            "{quote.text}"
          </blockquote>
          <cite className="text-sm opacity-75">— {quote.author}</cite>
        </div>
        <button
          onClick={refreshQuote}
          disabled={isRefreshing}
          className="ml-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 disabled:opacity-50"
          title="Get new quote"
        >
          <RefreshCw 
            size={18} 
            className={`transition-transform duration-500 ${isRefreshing ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>
    </div>
  );
};