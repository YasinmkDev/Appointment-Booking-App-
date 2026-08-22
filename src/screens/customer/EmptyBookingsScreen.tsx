import React from 'react';
import { Ticket, ArrowRight, BookOpen, Compass } from 'lucide-react';

interface EmptyBookingsScreenProps {
  onBrowseProviders: () => void;
}

export const EmptyBookingsScreen: React.FC<EmptyBookingsScreenProps> = ({
  onBrowseProviders,
}) => {
  return (
    <div className="p-4 pb-28 max-w-md mx-auto min-h-[calc(100vh-140px)] flex flex-col justify-center items-center text-center space-y-6">
      {/* Warm Tactile Illustration Container */}
      <div className="relative w-40 h-40 bg-[#FDF9F2] rounded-full border-2 border-dashed border-[#CEC4CB] flex items-center justify-center p-4 shadow-inner">
        <div className="w-28 h-36 bg-[#F7F3EC] border border-[#CEC4CB] rounded ticket-notch-x flex flex-col items-center justify-between p-3 transform -rotate-3 shadow-xs">
          <div className="w-full flex justify-between items-center border-b border-dashed border-[#CEC4CB] pb-1">
            <span className="font-mono text-[8px] text-[#6B6570]">TICKET #---</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
          </div>
          <div className="py-2">
            <Ticket className="w-8 h-8 text-[#CEC4CB]" />
          </div>
          <div className="w-full bg-[#E6E2DB]/50 h-1.5 rounded" />
        </div>

        {/* Secondary tilted stamp */}
        <div className="absolute -bottom-2 -right-2 bg-[#FEB64E] text-[#2B1B2E] font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-[#2B1B2E]/20 rotate-12 shadow-xs">
          OPEN LEDGER
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2 max-w-xs">
        <h2 className="font-serif text-2xl font-bold text-[#2B1B2E]">
          Nothing booked yet
        </h2>
        <p className="font-sans text-xs text-[#6B6570] leading-relaxed">
          Find a provider to get started and stamp your first appointment into your ledger.
        </p>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-xs pt-2">
        <button
          onClick={onBrowseProviders}
          className="w-full bg-[#2B1B2E] hover:bg-[#FEB64E] hover:text-[#2B1B2E] text-[#F7F3EC] font-sans font-semibold text-sm py-3.5 px-6 rounded flex items-center justify-center gap-2 ticket-press transition-all shadow-xs"
        >
          <Compass className="w-4 h-4" />
          <span>Browse Providers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="font-mono text-[11px] text-[#6B6570] pt-4">
        <span>Curated Studios & Artisanal Wellness</span>
      </div>
    </div>
  );
};
