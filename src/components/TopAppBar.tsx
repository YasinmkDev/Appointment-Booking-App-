import React from 'react';
import { ArrowLeft, Menu, Sparkles, User, Store, Layers } from 'lucide-react';
import { UserRole, Screen } from '../types';

interface TopAppBarProps {
  role: UserRole;
  currentScreen: Screen;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
  onOpenScreenModal?: () => void;
  title?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  role,
  currentScreen,
  onRoleChange,
  onNavigate,
  onBack,
  onOpenScreenModal,
  title = 'BookEase',
}) => {
  const showBack = ['provider_profile', 'service_date', 'time_slot', 'confirmation', 'empty_bookings'].includes(
    currentScreen
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDF9F2] border-b border-[#CEC4CB] px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {showBack && onBack ? (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-[#2B1B2E] hover:bg-[#F7F3EC] active:scale-95 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#2B1B2E]" />
          </button>
        ) : (
          <button
            onClick={onOpenScreenModal}
            className="p-1.5 rounded-full text-[#2B1B2E] hover:bg-[#F7F3EC] active:scale-95 transition-all"
            title="All Screens Navigator"
          >
            <Menu className="w-5 h-5 text-[#2B1B2E]" />
          </button>
        )}

        <button
          onClick={() => onNavigate(role === 'customer' ? 'browse' : 'dashboard')}
          className="text-left"
        >
          <h1 className="font-serif text-xl font-bold tracking-tight text-[#2B1B2E] leading-none">
            {title}
          </h1>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Role Switcher */}
        <div className="flex items-center bg-[#F1EDE6] p-0.5 rounded-full border border-[#CEC4CB]">
          <button
            onClick={() => onRoleChange('customer')}
            className={`px-2.5 py-1 text-xs font-mono rounded-full transition-all flex items-center gap-1 ${
              role === 'customer'
                ? 'bg-[#2B1B2E] text-white font-medium shadow-xs'
                : 'text-[#6B6570] hover:text-[#2B1B2E]'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Customer</span>
          </button>
          <button
            onClick={() => onRoleChange('provider')}
            className={`px-2.5 py-1 text-xs font-mono rounded-full transition-all flex items-center gap-1 ${
              role === 'provider'
                ? 'bg-[#2B1B2E] text-white font-medium shadow-xs'
                : 'text-[#6B6570] hover:text-[#2B1B2E]'
            }`}
          >
            <Store className="w-3 h-3" />
            <span>Provider</span>
          </button>
        </div>

        {/* Screen Switcher Drawer / Modal Trigger */}
        <button
          onClick={onOpenScreenModal}
          className="p-1.5 rounded-full hover:bg-[#F7F3EC] text-[#6B6570] hover:text-[#2B1B2E] transition-colors"
          title="Jump to screen"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
