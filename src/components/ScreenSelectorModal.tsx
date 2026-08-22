import React from 'react';
import { X, Sparkles, User, Store, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Screen, UserRole } from '../types';

interface ScreenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: Screen;
  onSelectScreen: (screen: Screen, role: UserRole) => void;
}

export const ScreenSelectorModal: React.FC<ScreenSelectorModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onSelectScreen,
}) => {
  if (!isOpen) return null;

  const customerScreens: { id: Screen; name: string; desc: string; number: string }[] = [
    {
      id: 'welcome',
      name: '1. Onboarding / Welcome',
      desc: 'Warm hero photo, Fraunces serif title, "Find your next appointment" CTA',
      number: '01',
    },
    {
      id: 'browse',
      name: '2. Browse Providers',
      desc: 'Provider cards with photos, ratings, category chips, next available teaser',
      number: '02',
    },
    {
      id: 'provider_profile',
      name: '3. Provider Profile (Wren & Co.)',
      desc: 'Studio photo banner, bio, services with IBM Plex Mono price and duration',
      number: '03',
    },
    {
      id: 'service_date',
      name: '4. Service & Date Selection',
      desc: 'Calendar week-strip with ticket-notch date buttons & service summary',
      number: '04',
    },
    {
      id: 'time_slot',
      name: '5. Time Slot (Ticket Ribbon)',
      desc: 'Scrollable ticket stubs grouped by Morning/Afternoon/Evening, Marigold fill',
      number: '05',
    },
    {
      id: 'confirmation',
      name: '6. Booking Confirmation',
      desc: 'Large ticket stub with perforated tear-line, BKE-7892X ref code, Sage Teal status',
      number: '06',
    },
    {
      id: 'my_bookings',
      name: '7. My Bookings',
      desc: 'Upcoming ticket cards with Marigold accent, past desaturated entries',
      number: '07',
    },
    {
      id: 'empty_bookings',
      name: '8. Empty State',
      desc: 'Tactile empty ledger illustration with plain-language invite',
      number: '08',
    },
  ];

  const providerScreens: { id: Screen; name: string; desc: string; number: string }[] = [
    {
      id: 'dashboard',
      name: "9. Provider Dashboard",
      desc: "Ink Plum dark hero, Mono stats (8 today, 42 week), today's agenda ticket rows",
      number: '09',
    },
    {
      id: 'availability',
      name: '10. Availability Manager',
      desc: 'Weekly schedule grid with Sage Teal toggle switches, working hours inputs',
      number: '10',
    },
    {
      id: 'requests',
      name: '11. Booking Requests',
      desc: 'Pending request ticket cards with Accept (Sage Teal) / Decline (Dusty Rose)',
      number: '11',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1B2E]/60 backdrop-blur-xs">
      <div className="bg-[#FDF9F2] border border-[#CEC4CB] w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#CEC4CB] flex items-center justify-between bg-[#F7F3EC]">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B6570]">BookEase Architecture</span>
            <h2 className="font-serif text-lg font-bold text-[#2B1B2E]">All 11 Screens Navigator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EBE8E1] text-[#2B1B2E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {/* Customer Screens Section */}
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-dashed border-[#CEC4CB]">
              <User className="w-4 h-4 text-[#E8A33D]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#2B1B2E]">
                Customer Flow (Screens 1 - 8)
              </h3>
            </div>
            <div className="space-y-1.5">
              {customerScreens.map((s) => {
                const isSelected = currentScreen === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectScreen(s.id, 'customer');
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded transition-all border flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#E8A33D]/15 border-[#E8A33D] text-[#2B1B2E]'
                        : 'bg-[#FDF9F2] border-[#CEC4CB]/60 hover:border-[#2B1B2E] text-[#2B1B2E]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-[#6B6570] pt-0.5">{s.number}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-semibold">{s.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E8A33D] flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-[#6B6570] font-sans mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Screens Section */}
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-dashed border-[#CEC4CB]">
              <Store className="w-4 h-4 text-[#5C8374]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#2B1B2E]">
                Provider Flow (Screens 9 - 11)
              </h3>
            </div>
            <div className="space-y-1.5">
              {providerScreens.map((s) => {
                const isSelected = currentScreen === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectScreen(s.id, 'provider');
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded transition-all border flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#5C8374]/15 border-[#5C8374] text-[#2B1B2E]'
                        : 'bg-[#FDF9F2] border-[#CEC4CB]/60 hover:border-[#2B1B2E] text-[#2B1B2E]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-[#6B6570] pt-0.5">{s.number}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-semibold">{s.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#5C8374] flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-[#6B6570] font-sans mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F7F3EC] border-t border-[#CEC4CB] text-center">
          <p className="font-mono text-[11px] text-[#6B6570]">
            Aesthetic: Warm Alabaster • Ink Plum • Marigold • Sage Teal • Dusty Rose
          </p>
        </div>
      </div>
    </div>
  );
};
