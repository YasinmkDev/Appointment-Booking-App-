import React, { useState } from 'react';
import { Booking } from '../../types';
import { StatusPill } from '../../components/TicketStub';
import { Ticket, Calendar, Clock, ChevronRight } from 'lucide-react';

interface MyBookingsScreenProps {
  bookings: Booking[];
  onSelectBooking?: (booking: Booking) => void;
  onBrowseProviders: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  bookings,
  onSelectBooking,
  onBrowseProviders,
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'past'>('all');

  const upcomingBookings = bookings.filter((b) => !b.isPast && b.status !== 'completed');
  const pastBookings = bookings.filter((b) => b.isPast || b.status === 'completed');

  const displayUpcoming = selectedTab === 'all' || selectedTab === 'upcoming';
  const displayPast = selectedTab === 'all' || selectedTab === 'past';

  return (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-5">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2B1B2E] mb-1">
          My Bookings
        </h1>
        <p className="font-sans text-xs text-[#6B6570]">
          Review your upcoming appointments and past reservations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#CEC4CB] pb-2">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-3 py-1 font-mono text-xs rounded-full transition-all ${
            selectedTab === 'all'
              ? 'bg-[#2B1B2E] text-white font-medium'
              : 'text-[#6B6570] hover:text-[#2B1B2E]'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setSelectedTab('upcoming')}
          className={`px-3 py-1 font-mono text-xs rounded-full transition-all ${
            selectedTab === 'upcoming'
              ? 'bg-[#2B1B2E] text-white font-medium'
              : 'text-[#6B6570] hover:text-[#2B1B2E]'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setSelectedTab('past')}
          className={`px-3 py-1 font-mono text-xs rounded-full transition-all ${
            selectedTab === 'past'
              ? 'bg-[#2B1B2E] text-white font-medium'
              : 'text-[#6B6570] hover:text-[#2B1B2E]'
          }`}
        >
          Past ({pastBookings.length})
        </button>
      </div>

      {/* Upcoming Section */}
      {displayUpcoming && upcomingBookings.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-[#6B6570]">
            Upcoming
          </h2>

          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => onSelectBooking && onSelectBooking(booking)}
                className="bg-[#FDF9F2] rounded border border-[#2B1B2E] ticket-notch-x relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xs cursor-pointer"
              >
                {/* Left Marigold Stamp Border */}
                <div className="w-1.5 bg-[#FEB64E] absolute left-0 top-0 bottom-0" />

                <div className="p-4 pl-5 flex flex-col justify-between space-y-3">
                  {/* Top row: Date & Time in Mono */}
                  <div className="flex items-center justify-between border-b border-dashed border-[#CEC4CB] pb-2">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2B1B2E]">
                      <Calendar className="w-3.5 h-3.5 text-[#835400]" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs text-[#6B6570]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{booking.time}</span>
                    </div>
                  </div>

                  {/* Body: Service & Provider */}
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2B1B2E] leading-snug">
                      {booking.serviceName}
                    </h3>
                    <p className="font-sans text-xs text-[#6B6570] mt-0.5">
                      {booking.providerName}
                    </p>
                  </div>

                  {/* Footer: Ref Code, Status, Details Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[10px] text-[#6B6570]">
                      {booking.refCode}
                    </span>

                    <div className="flex items-center gap-2">
                      <StatusPill status={booking.status} />
                      <button className="bg-[#2B1B2E] hover:bg-[#FEB64E] hover:text-[#2B1B2E] text-[#F7F3EC] font-sans font-semibold text-xs px-3 py-1.5 rounded-xs transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Section */}
      {displayPast && pastBookings.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-[#6B6570] whitespace-nowrap">
              Past Bookings
            </h2>
            <div className="perforated-line-h w-full" />
          </div>

          <div className="space-y-3 opacity-75">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#F7F3EC] rounded border border-[#CEC4CB] ticket-notch-x p-4 space-y-2.5 grayscale-[30%]"
              >
                <div className="flex items-center justify-between border-b border-dashed border-[#CEC4CB] pb-2 text-xs font-mono text-[#6B6570]">
                  <span>{booking.date}</span>
                  <span>{booking.time}</span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-[#6B6570]">
                      {booking.serviceName}
                    </h3>
                    <p className="font-sans text-xs text-[#6B6570]">
                      {booking.providerName}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#6B6570]">
                    ${booking.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <StatusPill status="completed" />
                  <button
                    onClick={onBrowseProviders}
                    className="font-sans text-xs font-semibold text-[#2B1B2E] border border-[#CEC4CB] hover:border-[#2B1B2E] px-3 py-1 rounded bg-[#FDF9F2] transition-colors"
                  >
                    Rebook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
