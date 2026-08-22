import React, { useState } from 'react';
import { CheckCircle, CalendarPlus, ArrowLeft, Check, QrCode } from 'lucide-react';
import { Booking } from '../../types';
import { PerforatedDivider } from '../../components/TicketStub';

interface BookingConfirmationScreenProps {
  booking: Booking;
  onBackToBrowse: () => void;
  onViewMyBookings: () => void;
}

export const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  booking,
  onBackToBrowse,
  onViewMyBookings,
}) => {
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const handleAddCalendar = () => {
    setAddedToCalendar(true);
    setTimeout(() => setAddedToCalendar(false), 3000);
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto flex flex-col items-center space-y-6">
      {/* Celebration Header */}
      <div className="text-center flex flex-col items-center pt-2">
        <div className="w-14 h-14 bg-[#FFDDB5] text-[#835400] rounded-full flex items-center justify-center mb-3 shadow-xs border border-[#FEB64E]">
          <CheckCircle className="w-7 h-7 text-[#835400] fill-[#FEB64E]/40" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#2B1B2E] mb-1">
          Booking Confirmed
        </h1>
        <p className="font-sans text-xs text-[#6B6570] max-w-xs leading-relaxed">
          Your appointment has been successfully secured and stamped in the ledger.
        </p>
      </div>

      {/* Signature Element: Large Ticket Card */}
      <div className="w-full bg-[#FDF9F2] border border-[#2B1B2E] rounded-lg shadow-md relative overflow-hidden">
        {/* Top Details Section */}
        <div className="p-5 pt-6 pb-4 bg-[#FFFFFF]">
          <p className="font-mono text-[10px] text-[#6B6570] uppercase tracking-wider mb-2">
            Appointment Details
          </p>
          <h2 className="font-serif text-xl font-bold text-[#2B1B2E] mb-0.5">
            {booking.serviceName}
          </h2>
          <p className="font-sans text-xs text-[#6B6570] mb-4">
            at {booking.providerName}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-[#CEC4CB]">
            <div>
              <p className="font-mono text-[10px] text-[#6B6570] uppercase mb-0.5">Date</p>
              <p className="font-sans text-xs font-semibold text-[#2B1B2E]">{booking.date}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#6B6570] uppercase mb-0.5">Time</p>
              <p className="font-mono text-xs font-bold text-[#2B1B2E]">{booking.time}</p>
            </div>
          </div>
        </div>

        {/* Perforated Tear Line with Circular Notches */}
        <PerforatedDivider orientation="horizontal" withNotches={true} />

        {/* Bottom Section: The Ticket Stub */}
        <div className="p-5 pt-3 pb-6 bg-[#F7F3EC] space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-mono text-[10px] text-[#6B6570] uppercase mb-1">Ref Code</p>
              <p className="font-mono text-xs font-bold tracking-wider bg-[#FDF9F2] text-[#2B1B2E] px-2 py-1 rounded border border-[#CEC4CB] inline-block shadow-2xs">
                {booking.refCode}
              </p>
            </div>

            <div className="text-right">
              <p className="font-mono text-[10px] text-[#6B6570] uppercase mb-1">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#C2ECDA] text-[#284E41] font-mono text-[11px] font-medium border border-[#5C8374]/30 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5C8374] mr-1.5" />
                Confirmed
              </span>
            </div>
          </div>

          {/* Decorative Stub Barcode & Stamp */}
          <div className="flex items-center justify-between py-2 px-3 bg-[#FDF9F2] rounded border border-dashed border-[#CEC4CB]">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-[#2B1B2E]/70" />
              <div className="font-mono text-[9px] text-[#6B6570]">
                <p>PASS #{booking.refCode}</p>
                <p>PRESENT AT CHECK-IN</p>
              </div>
            </div>
            <div className="font-mono text-xs text-[#2B1B2E] font-bold">
              ${booking.price.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleAddCalendar}
              className="w-full bg-[#2B1B2E] hover:bg-[#2B1B2E]/90 text-[#F7F3EC] font-sans font-semibold text-xs py-3 px-4 rounded border border-[#2B1B2E] flex items-center justify-center gap-2 ticket-press transition-all shadow-xs"
            >
              {addedToCalendar ? (
                <>
                  <Check className="w-4 h-4 text-[#FEB64E]" />
                  <span>Added to Device Calendar</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4 text-[#FEB64E]" />
                  <span>Add to Calendar</span>
                </>
              )}
            </button>

            <button
              onClick={onViewMyBookings}
              className="w-full bg-transparent hover:bg-[#EBE8E1] text-[#2B1B2E] font-sans font-semibold text-xs py-3 px-4 rounded border border-[#2B1B2E] ticket-press transition-colors"
            >
              View in My Bookings
            </button>

            <button
              onClick={onBackToBrowse}
              className="w-full text-center text-xs font-mono text-[#6B6570] hover:text-[#2B1B2E] pt-1"
            >
              ← Back to Browse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
