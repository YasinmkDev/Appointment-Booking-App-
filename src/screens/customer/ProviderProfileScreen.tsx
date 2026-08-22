import React from 'react';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Provider, Service } from '../../types';

interface ProviderProfileScreenProps {
  provider: Provider;
  onSelectService: (service: Service) => void;
}

export const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({
  provider,
  onSelectService,
}) => {
  return (
    <div className="p-4 pb-24 max-w-md mx-auto space-y-5">
      {/* Large Header Card */}
      <article className="bg-[#FDF9F2] border border-[#2B1B2E] rounded-lg overflow-hidden shadow-xs">
        <div className="w-full h-48 relative bg-[#E6E2DB]">
          <img
            src={provider.image}
            alt={provider.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B2E]/40 to-transparent" />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] text-[#835400] font-semibold uppercase tracking-widest">
              {provider.category}
            </span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#2B1B2E] mb-2 leading-tight">
            {provider.name}
          </h1>

          <div className="flex items-center gap-3 text-xs text-[#6B6570] font-sans mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#E8A33D] fill-[#E8A33D]" />
              <span className="font-bold text-[#2B1B2E] font-mono">{provider.rating}</span>
              <span className="font-mono">({provider.reviewCount} reviews)</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#CEC4CB]" />
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#5C8374]" />
              <span>{provider.distance}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-dashed border-[#CEC4CB]">
            <p className="font-sans text-xs text-[#6B6570] leading-relaxed">
              {provider.bio}
            </p>
          </div>
        </div>
      </article>

      {/* Services List Section */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b-2 border-[#2B1B2E] pb-1">
          <h2 className="font-serif text-lg font-bold text-[#2B1B2E]">Services</h2>
          <span className="font-mono text-xs text-[#6B6570]">
            {provider.services.length} offerings
          </span>
        </div>

        <div className="space-y-3">
          {provider.services.map((service) => (
            <div
              key={service.id}
              className="bg-[#FDF9F2] border border-[#CEC4CB] hover:border-[#2B1B2E] rounded p-4 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-sm text-[#2B1B2E] group-hover:text-[#835400] transition-colors">
                    {service.name}
                  </h3>
                </div>
                <p className="font-sans text-xs text-[#6B6570] mb-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-2 border-t border-dashed border-[#CEC4CB] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 font-mono text-xs text-[#2B1B2E]">
                    <DollarSign className="w-3.5 h-3.5 text-[#5C8374]" />
                    <span className="font-bold">${service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs text-[#6B6570]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.durationMinutes}m</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectService(service)}
                  className="bg-[#2B1B2E] hover:bg-[#FEB64E] hover:text-[#2B1B2E] text-[#F7F3EC] font-sans font-semibold text-xs py-1.5 px-4 rounded-xs ticket-press transition-all shadow-xs"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
