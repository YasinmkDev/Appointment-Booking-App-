import React from 'react';
import { ChevronRight, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { StatusPill } from '../../components/TicketStub';
import { INITIAL_TODAYS_AGENDA } from '../../data/mockData';

interface ProviderDashboardScreenProps {
  onNavigateToRequests: () => void;
  onNavigateToAvailability: () => void;
}

export const ProviderDashboardScreen: React.FC<ProviderDashboardScreenProps> = ({
  onNavigateToRequests,
  onNavigateToAvailability,
}) => {
  return (
    <div className="pb-28 max-w-md mx-auto space-y-5">
      {/* Hero Stats Section: Ink Plum dark surface */}
      <section className="bg-[#2B1B2E] text-white p-5 rounded-b-xl relative overflow-hidden shadow-sm">
        {/* Subtle decorative background noise hint */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEB64E]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div>
            <span className="font-mono text-[11px] text-[#D8BFD8] uppercase tracking-widest block mb-1">
              Provider Overview
            </span>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
              Good Morning, Studio.
            </h1>
          </div>

          {/* Quick Stat Blocks in IBM Plex Mono */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="border border-[#CEC4CB]/25 bg-white/5 rounded p-3.5 flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#D8BFD8] uppercase tracking-wider">
                Bookings Today
              </span>
              <span className="font-mono text-3xl font-bold text-white mt-1">8</span>
            </div>

            <div className="border border-[#CEC4CB]/25 bg-white/5 rounded p-3.5 flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#D8BFD8] uppercase tracking-wider">
                This Week
              </span>
              <span className="font-mono text-3xl font-bold text-white mt-1">42</span>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Content Area */}
      <div className="px-4 space-y-4">
        {/* Section Header with Dashed Tear Line */}
        <div className="flex justify-between items-baseline border-b border-dashed border-[#CEC4CB] pb-2">
          <h2 className="font-serif text-xl font-bold text-[#2B1B2E]">Today's Agenda</h2>
          <span className="font-mono text-xs text-[#6B6570]">Oct 24, 2024</span>
        </div>

        {/* Compact Ticket Rows */}
        <div className="border border-[#CEC4CB] rounded-sm overflow-hidden bg-[#FDF9F2] shadow-xs divide-y divide-dashed divide-[#CEC4CB]">
          {INITIAL_TODAYS_AGENDA.map((item) => {
            const isCanceled = item.statusType === 'canceled';
            const isArrived = item.statusType === 'arrived';

            return (
              <div
                key={item.id}
                className={`p-3.5 flex items-center gap-3 relative transition-colors hover:bg-[#F7F3EC] ${
                  isCanceled ? 'opacity-55' : ''
                }`}
              >
                {/* Active indicator bar for current/arrived client */}
                {item.active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FEB64E]" />
                )}

                {/* Left Time Stub */}
                <div className="w-20 flex-shrink-0 border-r border-dashed border-[#CEC4CB] pr-3 text-left">
                  <span
                    className={`font-mono text-xs block font-bold ${
                      isCanceled
                        ? 'line-through text-[#6B6570]'
                        : isArrived
                        ? 'text-[#835400]'
                        : 'text-[#2B1B2E]'
                    }`}
                  >
                    {item.time}
                  </span>
                  <span className="font-mono text-[10px] text-[#6B6570] block mt-0.5">
                    {item.duration}
                  </span>
                </div>

                {/* Client & Service Info */}
                <div className="flex-1 min-w-0 pr-1">
                  <h3
                    className={`font-sans text-xs font-bold leading-tight truncate ${
                      isCanceled ? 'line-through text-[#6B6570]' : 'text-[#2B1B2E]'
                    }`}
                  >
                    {item.clientName}
                  </h3>
                  <p className="font-sans text-[11px] text-[#6B6570] truncate mt-0.5">
                    {item.service}
                  </p>
                </div>

                {/* Status Badge & Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.statusType === 'upcoming' && <StatusPill status="upcoming" />}
                  {item.statusType === 'arrived' && <StatusPill status="arrived" />}
                  {item.statusType === 'canceled' && <StatusPill status="canceled" />}
                  <ChevronRight className="w-4 h-4 text-[#CEC4CB]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onNavigateToRequests}
            className="p-3 bg-[#FDF9F2] hover:bg-[#F7F3EC] border border-[#CEC4CB] rounded text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="font-mono text-[10px] text-[#C97B84] uppercase block font-bold">
                ● 4 Pending
              </span>
              <span className="font-sans text-xs font-semibold text-[#2B1B2E]">
                Booking Requests
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B6570]" />
          </button>

          <button
            onClick={onNavigateToAvailability}
            className="p-3 bg-[#FDF9F2] hover:bg-[#F7F3EC] border border-[#CEC4CB] rounded text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="font-mono text-[10px] text-[#5C8374] uppercase block font-bold">
                Active 4/7 Days
              </span>
              <span className="font-sans text-xs font-semibold text-[#2B1B2E]">
                Set Working Hours
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B6570]" />
          </button>
        </div>
      </div>
    </div>
  );
};
