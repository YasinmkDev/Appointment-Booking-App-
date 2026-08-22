import React, { useState } from 'react';
import { Save, Info, X, Plus, Check } from 'lucide-react';
import { DaySchedule } from '../../types';
import { INITIAL_SCHEDULE } from '../../data/mockData';

export const AvailabilityManagerScreen: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDay = (dayName: string) => {
    setSchedule((prev) =>
      prev.map((d) => (d.day === dayName ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const removeSlot = (dayName: string, slotIndex: number) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== dayName) return d;
        const newSlots = d.slots.filter((_, idx) => idx !== slotIndex);
        return {
          ...d,
          slots: newSlots,
          enabled: newSlots.length > 0 ? d.enabled : false,
        };
      })
    );
  };

  const addSlot = (dayName: string) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== dayName) return d;
        return {
          ...d,
          enabled: true,
          slots: [...d.slots, { start: '09:00 AM', end: '05:00 PM' }],
        };
      })
    );
  };

  const activeDaysCount = schedule.filter((d) => d.enabled && d.slots.length > 0).length;
  // Estimate total hours for summary
  const totalHoursCount = activeDaysCount * 7.5;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDiscard = () => {
    setSchedule(INITIAL_SCHEDULE);
  };

  return (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-6">
      {/* Title & Framing */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2B1B2E] mb-1">
          Weekly Schedule
        </h1>
        <p className="font-sans text-xs text-[#6B6570] leading-relaxed">
          Define your standard working hours. These slots will be available for clients to book in your ledger.
        </p>
      </div>

      {/* Schedule Container */}
      <div className="bg-[#FDF9F2] border border-[#CEC4CB] rounded-sm p-4 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-[#CEC4CB] pb-2">
          <h2 className="font-serif text-base font-bold text-[#2B1B2E]">Standard Hours</h2>
          <span className="font-mono text-xs text-[#6B6570]">EST (UTC-5)</span>
        </div>

        <div className="divide-y divide-[#CEC4CB]/60">
          {schedule.map((d) => (
            <div key={d.day} className="py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold text-[#2B1B2E] w-24">
                  {d.day}
                </span>

                {/* Custom Sage Teal Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={d.enabled}
                    onChange={() => toggleDay(d.day)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E6E2DB] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CEC4CB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5C8374]" />
                </label>
              </div>

              {/* Slot Inputs */}
              {d.enabled && d.slots.length > 0 ? (
                <div className="space-y-1.5 pl-1 pt-1">
                  {d.slots.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 bg-[#F7F3EC] p-1.5 rounded border border-dashed border-[#CEC4CB]">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#2B1B2E]">
                        <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#CEC4CB]">
                          {slot.start}
                        </span>
                        <span className="text-[#6B6570]">-</span>
                        <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#CEC4CB]">
                          {slot.end}
                        </span>
                      </div>

                      <button
                        onClick={() => removeSlot(d.day, idx)}
                        className="p-1 text-[#6B6570] hover:text-[#C97B84] transition-colors"
                        title="Remove slot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addSlot(d.day)}
                    className="text-[11px] font-mono text-[#5C8374] hover:text-[#284E41] flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" /> Add split shift
                  </button>
                </div>
              ) : (
                <span className="font-mono text-xs text-[#6B6570]/70 italic pl-1">
                  Unavailable
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[#FDF9F2] border border-[#2B1B2E] rounded-sm p-4 space-y-3 shadow-xs">
        <h3 className="font-serif text-base font-bold text-[#2B1B2E] border-b border-[#CEC4CB] pb-1.5">
          Summary
        </h3>

        <div className="space-y-1.5 font-mono text-xs text-[#2B1B2E]">
          <div className="flex justify-between">
            <span className="text-[#6B6570]">Active Days:</span>
            <span className="font-bold">{activeDaysCount} / 7</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6570]">Total Hours:</span>
            <span className="font-bold">{totalHoursCount} hrs</span>
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-[#CEC4CB] space-y-2">
          <button
            onClick={handleSave}
            className="w-full bg-[#FEB64E] hover:bg-[#E8A33D] text-[#2B1B2E] font-sans font-semibold text-xs py-3 px-4 rounded border border-[#835400] flex items-center justify-center gap-2 ticket-press transition-all shadow-xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#2B1B2E]" />
                <span>Schedule Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#2B1B2E]" />
                <span>Save Changes</span>
              </>
            )}
          </button>

          <button
            onClick={handleDiscard}
            className="w-full bg-transparent hover:bg-[#EBE8E1] text-[#2B1B2E] font-sans font-semibold text-xs py-2.5 px-4 rounded border border-[#2B1B2E] ticket-press transition-colors"
          >
            Discard
          </button>
        </div>
      </div>

      {/* Overrides Tip Box */}
      <div className="bg-[#F7F3EC] border border-dashed border-[#CEC4CB] rounded p-3.5 flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-[#5C8374] flex-shrink-0 mt-0.5" />
        <p className="font-sans text-xs text-[#6B6570] leading-relaxed">
          Need to take a specific day off? Use Date Overrides to block out time without altering your standard weekly ledger.
        </p>
      </div>
    </div>
  );
};
