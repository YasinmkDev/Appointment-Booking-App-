import React, { useState } from 'react';
import { Provider, Service, TimeSlot } from '../../types';
import { TicketSlot, PerforatedDivider } from '../../components/TicketStub';
import { TIME_SLOTS } from '../../data/mockData';

interface TimeSlotSelectionScreenProps {
  provider: Provider;
  service: Service;
  selectedDate: string;
  onConfirmBooking: (slot: TimeSlot) => void;
}

export const TimeSlotSelectionScreen: React.FC<TimeSlotSelectionScreenProps> = ({
  provider,
  service,
  selectedDate,
  onConfirmBooking,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('m3'); // Default to 10:30 AM

  const morningSlots = TIME_SLOTS.filter((s) => s.period === 'morning');
  const afternoonSlots = TIME_SLOTS.filter((s) => s.period === 'afternoon');
  const eveningSlots = TIME_SLOTS.filter((s) => s.period === 'evening');

  const selectedSlot = TIME_SLOTS.find((s) => s.id === selectedSlotId) || morningSlots[2];

  return (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2B1B2E] mb-1">
          Select Time
        </h1>
        <p className="font-sans text-xs text-[#6B6570]">
          {selectedDate || 'Wednesday, October 25th'}
        </p>
      </div>

      {/* Signature Element: Ticket Ribbon Groupings */}
      <div className="space-y-6">
        {/* Morning Group */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-[#6B6570] mb-2.5">
            Morning
          </h2>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
            {morningSlots.map((slot) => (
              <TicketSlot
                key={slot.id}
                time={slot.time}
                selected={selectedSlotId === slot.id}
                disabled={!slot.available}
                onClick={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </div>
        </div>

        {/* Afternoon Group */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-[#6B6570] mb-2.5">
            Afternoon
          </h2>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
            {afternoonSlots.map((slot) => (
              <TicketSlot
                key={slot.id}
                time={slot.time}
                selected={selectedSlotId === slot.id}
                disabled={!slot.available}
                onClick={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </div>
        </div>

        {/* Evening Group */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-[#6B6570] mb-2.5">
            Evening
          </h2>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
            {eveningSlots.map((slot) => (
              <TicketSlot
                key={slot.id}
                time={slot.time}
                selected={selectedSlotId === slot.id}
                disabled={!slot.available}
                onClick={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card with Tear Line */}
      <div className="border border-[#2B1B2E] bg-[#FDF9F2] rounded-lg overflow-hidden shadow-xs relative">
        <div className="p-4 flex justify-between items-start bg-[#FFFFFF]">
          <div>
            <h3 className="font-serif text-base font-bold text-[#2B1B2E]">
              {service.name}
            </h3>
            <p className="font-sans text-xs text-[#6B6570] mt-0.5">
              at {provider.name}
            </p>
          </div>
          <span className="font-mono text-xs text-[#6B6570] bg-[#EBE8E1] px-2 py-0.5 rounded">
            {service.durationMinutes} MIN
          </span>
        </div>

        {/* Dashed Tear Line Divider with Notches */}
        <PerforatedDivider orientation="horizontal" withNotches={true} />

        <div className="p-4 bg-[#FDF9F2] space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-mono text-[10px] text-[#6B6570] uppercase block">Slot</span>
              <p className="font-mono text-sm font-bold text-[#2B1B2E]">
                {selectedSlot.time}
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] text-[#6B6570] uppercase block">Total</span>
              <p className="font-mono text-sm font-bold text-[#2B1B2E]">
                ${service.price.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={() => onConfirmBooking(selectedSlot)}
            className="w-full bg-[#2B1B2E] hover:bg-[#FEB64E] hover:text-[#2B1B2E] text-[#F7F3EC] font-sans font-semibold text-sm py-3.5 px-4 rounded ticket-press transition-colors shadow-xs"
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
};
