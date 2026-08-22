import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-60px)] p-5 max-w-md mx-auto text-center relative">
      {/* Decorative ledger lines */}
      <div className="w-full h-1 bg-[#E6E2DB] border-b border-dashed border-[#CEC4CB] mb-4" />

      {/* Hero Image Container with Ticket Notch Aesthetic */}
      <div className="w-full relative bg-[#F7F3EC] border border-[#CEC4CB] p-2 rounded-t-lg shadow-xs">
        <div className="w-full aspect-[4/5] rounded overflow-hidden relative border border-[#CEC4CB]">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
            alt="Warm Serene Studio"
            className="w-full h-full object-cover grayscale-[15%] sepia-[10%] mix-blend-multiply"
          />
          {/* Overlay ticket stamp badge */}
          <div className="absolute top-4 right-4 bg-[#FDF9F2] border border-[#CEC4CB] rounded-full w-14 h-14 flex items-center justify-center shadow-inner transform rotate-12">
            <Star className="w-6 h-6 text-[#E8A33D] fill-[#E8A33D]" />
          </div>

          {/* Minimalist ledger corner tag */}
          <div className="absolute bottom-3 left-3 bg-[#2B1B2E]/90 backdrop-blur-xs text-[#F7F3EC] font-mono text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
            Artisanal Ledger
          </div>
        </div>
      </div>

      {/* Typography & Action Section */}
      <div className="w-full space-y-4 pt-6 border-t border-dashed border-[#CEC4CB]">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2B1B2E] mb-1">
            BookEase
          </h1>
          <p className="font-sans text-[#6B6570] text-base">
            Find your next appointment
          </p>
        </div>

        <div className="pt-2 w-full">
          <button
            onClick={onGetStarted}
            className="w-full bg-[#FEB64E] hover:bg-[#E8A33D] text-[#2B1B2E] font-sans font-semibold text-base py-3.5 px-6 rounded border border-[#2B1B2E]/20 shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] active:shadow-inner cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-[#2B1B2E]" />
          </button>
        </div>

        <div className="font-mono text-xs text-[#6B6570] flex items-center justify-center gap-3 pt-2">
          <span className="h-[1px] w-8 bg-[#CEC4CB]" />
          <span>No. 001</span>
          <span className="h-[1px] w-8 bg-[#CEC4CB]" />
        </div>
      </div>
    </div>
  );
};
