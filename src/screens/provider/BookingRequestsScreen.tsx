import React, { useState } from 'react';
import { BookingRequest } from '../../types';
import { INITIAL_PROVIDER_REQUESTS } from '../../data/mockData';
import { CheckCircle2, XCircle } from 'lucide-react';

export const BookingRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<BookingRequest[]>(INITIAL_PROVIDER_REQUESTS);
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'completed'>('pending');
  const [notification, setNotification] = useState<string | null>(null);

  const handleAccept = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' as const } : r))
    );
    setNotification(`Accepted appointment request for ${name}. Stamped in ledger.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDecline = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' as const } : r))
    );
    setNotification(`Declined request for ${name}. Slot reopened.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const pendingList = requests.filter((r) => r.status === 'pending');
  const acceptedList = requests.filter((r) => r.status === 'accepted');

  return (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-5">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2B1B2E] mb-1">
          Booking Requests
        </h1>
        <p className="font-sans text-xs text-[#6B6570]">
          Review and manage your pending appointments.
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-[#C2ECDA] border border-[#5C8374] text-[#284E41] px-3.5 py-2 rounded text-xs font-sans flex items-center gap-2 shadow-xs transition-all">
          <CheckCircle2 className="w-4 h-4 text-[#5C8374] flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-1.5 rounded-full font-sans text-xs whitespace-nowrap transition-all ${
            activeTab === 'pending'
              ? 'bg-[#2B1B2E] text-white font-semibold shadow-xs'
              : 'bg-[#FDF9F2] text-[#6B6570] border border-[#CEC4CB] hover:border-[#2B1B2E]'
          }`}
        >
          Pending ({pendingList.length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-1.5 rounded-full font-sans text-xs whitespace-nowrap transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#2B1B2E] text-white font-semibold shadow-xs'
              : 'bg-[#FDF9F2] text-[#6B6570] border border-[#CEC4CB] hover:border-[#2B1B2E]'
          }`}
        >
          Upcoming ({acceptedList.length + 3})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-1.5 rounded-full font-sans text-xs whitespace-nowrap transition-all ${
            activeTab === 'completed'
              ? 'bg-[#2B1B2E] text-white font-semibold shadow-xs'
              : 'bg-[#FDF9F2] text-[#6B6570] border border-[#CEC4CB] hover:border-[#2B1B2E]'
          }`}
        >
          Completed (12)
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'pending' && (
          <>
            {pendingList.map((req) => (
              <div
                key={req.id}
                className="ticket-notch-x border border-[#2B1B2E] bg-[#FDF9F2] rounded shadow-xs overflow-hidden"
              >
                {/* Top Section */}
                <div className="p-4 border-b border-dashed border-[#CEC4CB] flex justify-between items-start bg-white">
                  <div className="flex items-center gap-3">
                    {req.customerAvatar ? (
                      <img
                        src={req.customerAvatar}
                        alt={req.customerName}
                        className="w-10 h-10 rounded-full object-cover border border-[#CEC4CB]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#E6E2DB] border border-[#CEC4CB] flex items-center justify-center font-serif font-bold text-[#2B1B2E] text-sm">
                        {req.initials || req.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#2B1B2E]">
                        {req.customerName}
                      </h3>
                      <p className="font-sans text-xs text-[#6B6570]">
                        {req.serviceName} • {req.durationMinutes} Min
                      </p>
                    </div>
                  </div>

                  {req.isNew && (
                    <span className="px-2 py-0.5 bg-[#EBE8E1] text-[#6B6570] font-mono text-[10px] uppercase tracking-wider rounded border border-[#CEC4CB]">
                      New
                    </span>
                  )}
                </div>

                {/* Bottom Stub */}
                <div className="p-4 bg-[#FDF9F2] flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div>
                      <span className="font-mono text-[9px] text-[#6B6570] uppercase block">
                        Date
                      </span>
                      <span className="font-mono text-xs font-bold text-[#2B1B2E]">
                        {req.date}
                      </span>
                    </div>

                    <div className="w-px h-6 border-r border-dashed border-[#CEC4CB]" />

                    <div>
                      <span className="font-mono text-[9px] text-[#6B6570] uppercase block">
                        Time
                      </span>
                      <span className="font-mono text-xs font-bold text-[#2B1B2E]">
                        {req.timeRange}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleDecline(req.id, req.customerName)}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 border border-[#C97B84] text-[#C97B84] hover:bg-[#FFDAD6]/50 font-sans font-semibold text-xs rounded ticket-press transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(req.id, req.customerName)}
                      className="flex-1 sm:flex-none px-4 py-1.5 bg-[#2B1B2E] hover:bg-[#FEB64E] hover:text-[#2B1B2E] text-[#F7F3EC] font-sans font-semibold text-xs rounded ticket-press transition-all shadow-xs"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pendingList.length === 0 && (
              <div className="p-8 text-center bg-[#FDF9F2] border border-dashed border-[#CEC4CB] rounded">
                <p className="font-serif text-base text-[#2B1B2E] mb-1">
                  All caught up
                </p>
                <p className="font-sans text-xs text-[#6B6570]">
                  No pending appointment requests in the ledger right now.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-3">
            {acceptedList.map((req) => (
              <div
                key={req.id}
                className="p-3.5 bg-[#FDF9F2] border border-[#5C8374] rounded flex items-center justify-between"
              >
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#2B1B2E]">
                    {req.customerName}
                  </h4>
                  <p className="font-sans text-xs text-[#6B6570]">
                    {req.serviceName} • {req.date} at {req.timeRange}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-[#284E41] bg-[#C2ECDA] px-2.5 py-0.5 rounded-full border border-[#5C8374]/30">
                  Accepted
                </span>
              </div>
            ))}
            <div className="p-3.5 bg-[#FDF9F2] border border-[#CEC4CB] rounded flex items-center justify-between">
              <div>
                <h4 className="font-serif text-sm font-bold text-[#2B1B2E]">
                  Eleanor Vance
                </h4>
                <p className="font-sans text-xs text-[#6B6570]">
                  Signature Studio Consultation • Oct 24, 09:00 AM
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#284E41] bg-[#C2ECDA] px-2.5 py-0.5 rounded-full border border-[#5C8374]/30">
                Confirmed
              </span>
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="p-4 bg-[#F7F3EC] border border-[#CEC4CB] rounded text-center text-xs font-mono text-[#6B6570]">
            12 appointments completed in the previous cycle.
          </div>
        )}
      </div>
    </div>
  );
};
