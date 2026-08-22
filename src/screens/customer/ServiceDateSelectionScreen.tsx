import React, { useState } from 'react';
import { Provider, Service } from '../../types';

interface ServiceDateSelectionScreenProps {
  provider: Provider;
  service: Service;
  onSelectDate: (dateString: string) => void;
}

export const ServiceDateSelectionScreen: React.FC<ServiceDateSelectionScreenProps> = ({
  provider,
  service,
  onSelectDate,
}) => {
  const dates = [
    { day: 'Mon', num: '12', full: 'Monday, Oct 12', available: true },
    { day: 'Tue', num: '13', full: 'Tuesday, Oct 13', available: true },
    { day: 'Wed', num: '14', full: 'Wednesday, Oct 14', available: true },
    { day: 'Thu', num: '15', full: 'Thursday, Oct 15', available: true },
    { day: 'Fri', num: '16', full: 'Friday, Oct 16', available: true },
    { day: 'Sat', num: '17', full: 'Saturday, Oct 17', available: false },
    { day: 'Sun', num: '18', full: 'Sunday, Oct 18', available: false },
  ];

  const [selectedDate, setSelectedDate] = useState(dates[1]); // Default to Tue 13

  return (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-6">
      {/* Service Summary Ticket Card */}
      <section className="bg-[#FDF9F2] border border-[#2B1B2E] rounded-lg overflow-hidden shadow-xs relative">
        <div className="p-5 border-b border-dashed border-[#CEC4CB] bg-[#FFFFFF]">
          <h2 className="font-serif text-xl font-bold text-[#2B1B2E] mb-1">
            {service.name}
          </h2>
          <p className="font-sans text-xs text-[#6B6570] leading-relaxed">
            {service.description} Approx {service.durationMinutes} mins.
          </p>
        </div>

        <div className="p-5 bg-[#FDF9F2] flex justify-between items-end">
          <div>
            <span className="font-mono text-[10px] text-[#6B6570] uppercase tracking-wider block mb-1">
              Service Total
            </span>
            <span className="font-mono text-lg font-bold text-[#2B1B2E]">
              ${service.price.toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] text-[#6B6570] uppercase tracking-wider block mb-1">
              Provider
            </span>
            <span className="font-sans text-sm font-semibold text-[#2B1B2E]">
              {provider.name}
            </span>
          </div>
        </div>
      </section>

      {/* Select Date Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-baseline">
          <h3 className="font-serif text-lg font-bold text-[#2B1B2E]">Select Date</h3>
          <span className="font-mono text-xs text-[#6B6570]">October 2024</span>
        </div>

        {/* Calendar Week Strip */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
          {dates.map((d) => {
            const isSelected = selectedDate.num === d.num;
            if (!d.available) {
              return (
                <button
                  key={d.num}
                  disabled
                  className="flex-shrink-0 w-16 py-3.5 border border-dashed border-[#CEC4CB] rounded bg-[#E6E2DB]/40 flex flex-col items-center justify-center opacity-40 cursor-not-allowed ticket-notch-x"
                >
                  <span className="font-mono text-xs text-[#6B6570]">{d.day}</span>
                  <span className="font-serif text-base font-bold text-[#6B6570] mt-0.5">{d.num}</span>
                </button>
              );
            }

            if (isSelected) {
              return (
                <button
                  key={d.num}
                  onClick={() => setSelectedDate(d)}
                  className="flex-shrink-0 w-16 py-3.5 bg-[#FEB64E] text-[#2B1B2E] border border-[#2B1B2E]/20 rounded flex flex-col items-center justify-center ticket-notch-x shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] transform translate-y-[1px] transition-all"
                >
                  <span className="font-mono text-xs font-semibold text-[#2B1B2E]">{d.day}</span>
                  <span className="font-serif text-lg font-bold text-[#2B1B2E] mt-0.5">{d.num}</span>
                </button>
              );
            }

            return (
              <button
                key={d.num}
                onClick={() => setSelectedDate(d)}
                className="flex-shrink-0 w-16 py-3.5 border border-dashed border-[#CEC4CB] hover:border-[#2B1B2E] rounded bg-[#FDF9F2] hover:bg-[#F7F3EC] flex flex-col items-center justify-center ticket-notch-x ticket-press transition-all"
              >
                <span className="font-mono text-xs text-[#6B6570]">{d.day}</span>
                <span className="font-serif text-base font-bold text-[#2B1B2E] mt-0.5">{d.num}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Fixed Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FDF9F2] border-t border-[#CEC4CB] p-4 z-40 max-w-md mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] text-[#6B6570] uppercase block">Selected Date</span>
            <span className="font-sans text-xs font-bold text-[#2B1B2E]">
              {selectedDate.full}
            </span>
          </div>

          <button
            onClick={() => onSelectDate(selectedDate.full)}
            className="flex-1 bg-[#2B1B2E] hover:bg-[#FEB64E] hover:text-[#2B1B2E] text-[#F7F3EC] font-sans font-semibold text-sm py-3 px-5 rounded ticket-press transition-colors shadow-xs"
          >
            Continue to Times
          </button>
        </div>
      </div>
    </div>
  );
};
