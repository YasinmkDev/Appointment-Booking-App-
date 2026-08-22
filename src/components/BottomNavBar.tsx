import React from 'react';
import { Search, Ticket, User, CalendarDays, Clock, Inbox } from 'lucide-react';
import { UserRole, Screen } from '../types';

interface BottomNavBarProps {
  role: UserRole;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  pendingRequestsCount?: number;
  activeBookingsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  role,
  currentScreen,
  onNavigate,
  pendingRequestsCount = 4,
  activeBookingsCount = 2,
}) => {
  // Hide bottom nav on linear checkout/booking confirmation or welcome screens if desired
  if (currentScreen === 'welcome') {
    return null;
  }

  if (role === 'customer') {
    const isBrowse = currentScreen === 'browse' || currentScreen === 'provider_profile' || currentScreen === 'service_date' || currentScreen === 'time_slot';
    const isBookings = currentScreen === 'my_bookings' || currentScreen === 'confirmation' || currentScreen === 'empty_bookings';

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDF9F2] border-t border-dashed border-[#CEC4CB] px-4 py-2 flex justify-around items-center max-w-md mx-auto">
        {/* Browse */}
        <button
          onClick={() => onNavigate('browse')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all ${
            isBrowse
              ? 'bg-[#E8A33D] text-[#2B1B2E] font-bold shadow-xs translate-y-[-1px]'
              : 'text-[#6B6570] hover:text-[#2B1B2E]'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Browse</span>
        </button>

        {/* Bookings */}
        <button
          onClick={() => onNavigate('my_bookings')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all relative ${
            isBookings
              ? 'bg-[#E8A33D] text-[#2B1B2E] font-bold shadow-xs translate-y-[-1px]'
              : 'text-[#6B6570] hover:text-[#2B1B2E]'
          }`}
        >
          <Ticket className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Bookings</span>
          {activeBookingsCount > 0 && !isBookings && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-[#E8A33D] rounded-full" />
          )}
        </button>

        {/* Empty state shortcut / toggle */}
        <button
          onClick={() => onNavigate('empty_bookings')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all ${
            currentScreen === 'empty_bookings'
              ? 'bg-[#E8A33D] text-[#2B1B2E] font-bold shadow-xs translate-y-[-1px]'
              : 'text-[#6B6570] hover:text-[#2B1B2E]'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Empty State</span>
        </button>
      </nav>
    );
  }

  // Provider mode navigation
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDF9F2] border-t border-dashed border-[#CEC4CB] px-4 py-2 flex justify-around items-center max-w-md mx-auto">
      {/* Agenda */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all ${
          currentScreen === 'dashboard'
            ? 'bg-[#E8A33D] text-[#2B1B2E] font-bold shadow-xs translate-y-[-1px]'
            : 'text-[#6B6570] hover:text-[#2B1B2E]'
        }`}
      >
        <CalendarDays className="w-4 h-4 mb-0.5" />
        <span className="font-mono text-[10px] uppercase tracking-wider">Agenda</span>
      </button>

      {/* Availability */}
      <button
        onClick={() => onNavigate('availability')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all ${
          currentScreen === 'availability'
            ? 'bg-[#E8A33D] text-[#2B1B2E] font-bold shadow-xs translate-y-[-1px]'
            : 'text-[#6B6570] hover:text-[#2B1B2E]'
        }`}
      >
        <Clock className="w-4 h-4 mb-0.5" />
        <span className="font-mono text-[10px] uppercase tracking-wider">Hours</span>
      </button>

      {/* Requests */}
      <button
        onClick={() => onNavigate('requests')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all relative ${
          currentScreen === 'requests'
            ? 'bg-[#E8A33D] text-[#2B1B2E] font-bold shadow-xs translate-y-[-1px]'
            : 'text-[#6B6570] hover:text-[#2B1B2E]'
        }`}
      >
        <Inbox className="w-4 h-4 mb-0.5" />
        <span className="font-mono text-[10px] uppercase tracking-wider">Requests</span>
        {pendingRequestsCount > 0 && currentScreen !== 'requests' && (
          <span className="absolute top-0 right-3 w-2 h-2 bg-[#C97B84] rounded-full" />
        )}
      </button>
    </nav>
  );
};
