import React from 'react';

interface TicketSlotProps {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
}

export const TicketSlot: React.FC<TicketSlotProps> = ({
  time,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  id,
}) => {
  if (disabled) {
    return (
      <button
        id={id}
        disabled
        className={`relative flex-shrink-0 px-5 py-3 border border-dashed border-[#CEC4CB] rounded bg-[#E6E2DB]/50 text-[#6B6570] opacity-50 cursor-not-allowed ticket-notch-x font-mono text-sm line-through ${className}`}
      >
        <span>{time}</span>
      </button>
    );
  }

  if (selected) {
    return (
      <button
        id={id}
        onClick={onClick}
        className={`relative flex-shrink-0 px-5 py-3 bg-[#E8A33D] text-[#2B1B2E] font-mono text-sm font-bold rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] ticket-notch-x ticket-press transform translate-y-[1px] border border-[#2B1B2E]/20 transition-all ${className}`}
      >
        <span>{time}</span>
      </button>
    );
  }

  return (
    <button
      id={id}
      onClick={onClick}
      className={`relative flex-shrink-0 px-5 py-3 bg-[#FDF9F2] hover:bg-[#F7F3EC] text-[#2B1B2E] font-mono text-sm border border-dashed border-[#CEC4CB] hover:border-[#2B1B2E] rounded ticket-notch-x ticket-press transition-all ${className}`}
    >
      <span>{time}</span>
    </button>
  );
};

interface PerforatedDividerProps {
  orientation?: 'horizontal' | 'vertical';
  withNotches?: boolean;
  className?: string;
}

export const PerforatedDivider: React.FC<PerforatedDividerProps> = ({
  orientation = 'horizontal',
  withNotches = true,
  className = '',
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        {withNotches && (
          <div className="absolute -top-3 w-6 h-6 rounded-full bg-[#F7F3EC] border-b border-[#CEC4CB] z-10" />
        )}
        <div className="perforated-line-v h-full" />
        {withNotches && (
          <div className="absolute -bottom-3 w-6 h-6 rounded-full bg-[#F7F3EC] border-t border-[#CEC4CB] z-10" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center w-full my-2 ${className}`}>
      {withNotches && (
        <div
          className="absolute -left-4 w-6 h-6 rounded-full bg-[#F7F3EC] border-r border-[#CEC4CB] z-10"
          style={{ clipPath: 'inset(0 0 0 50%)' }}
        />
      )}
      <div className="perforated-line-h w-full" />
      {withNotches && (
        <div
          className="absolute -right-4 w-6 h-6 rounded-full bg-[#F7F3EC] border-l border-[#CEC4CB] z-10"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      )}
    </div>
  );
};

interface StatusPillProps {
  status: 'confirmed' | 'pending' | 'completed' | 'canceled' | 'arrived' | 'upcoming';
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full bg-[#C2ECDA] text-[#284E41] font-mono text-xs font-medium border border-[#5C8374]/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#5C8374] mr-1.5" />
          Confirmed
        </span>
      );
    case 'arrived':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded bg-[#E6E2DB] text-[#2B1B2E] font-mono text-[11px] uppercase tracking-wider border border-[#CEC4CB] ${className}`}
        >
          Arrived
        </span>
      );
    case 'upcoming':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded bg-[#FEB64E]/20 text-[#835400] font-mono text-[11px] uppercase tracking-wider border border-[#FEB64E] ${className}`}
        >
          Upcoming
        </span>
      );
    case 'pending':
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full bg-[#EBE8E1] text-[#6B6570] font-mono text-xs border border-[#CEC4CB] ${className}`}
        >
          Pending
        </span>
      );
    case 'canceled':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded bg-[#FFDAD6] text-[#93000A] font-mono text-[11px] uppercase tracking-wider border border-[#C97B84] ${className}`}
        >
          Canceled
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full bg-[#E6E2DB] text-[#6B6570] font-mono text-xs border border-[#CEC4CB] ${className}`}
        >
          Completed
        </span>
      );
    default:
      return null;
  }
};
