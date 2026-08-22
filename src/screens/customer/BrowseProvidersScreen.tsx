import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, Calendar, Heart } from 'lucide-react';
import { Provider } from '../../types';

interface BrowseProvidersScreenProps {
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
}

export const BrowseProvidersScreen: React.FC<BrowseProvidersScreenProps> = ({
  providers,
  onSelectProvider,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ 'wren-co': true });

  const categories = ['All', 'Wellness', 'Hair & Artistry', 'Fitness'];

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Wellness') return matchesSearch && p.category.includes('Wellness');
    if (selectedCategory === 'Hair & Artistry') return matchesSearch && p.category.includes('Hair');
    if (selectedCategory === 'Fitness') return matchesSearch && p.category.includes('Fitness');
    return matchesSearch;
  });

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto space-y-5">
      {/* Search Bar with Ledger Underline */}
      <div className="relative flex items-center border-b border-[#2B1B2E] pb-1.5 pt-1">
        <Search className="w-4 h-4 text-[#6B6570] mr-2 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search providers or services..."
          className="w-full bg-transparent border-none text-[#2B1B2E] placeholder-[#6B6570]/70 font-sans text-sm focus:outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-mono text-[#6B6570] px-1 hover:text-[#2B1B2E]"
          >
            Clear
          </button>
        )}
        <button
          className="p-1 rounded-full text-[#2B1B2E] hover:bg-[#EBE8E1] ml-1 transition-colors"
          title="Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-sans text-xs whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#2B1B2E] text-[#F7F3EC] font-semibold shadow-xs'
                  : 'bg-[#FDF9F2] text-[#6B6570] border border-[#CEC4CB] hover:border-[#2B1B2E]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          );
        })}
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <article
            key={provider.id}
            onClick={() => onSelectProvider(provider)}
            className="group bg-[#FDF9F2] border border-[#CEC4CB] rounded-sm overflow-hidden hover:border-[#2B1B2E] transition-all cursor-pointer shadow-xs"
          >
            {/* Image Header with Rating Tag */}
            <div className="w-full h-44 relative overflow-hidden bg-[#E6E2DB]">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              {/* Rating Stamp */}
              <div className="absolute top-3 left-3 bg-[#FDF9F2]/95 backdrop-blur-xs px-2 py-0.5 rounded border border-[#CEC4CB] flex items-center gap-1 shadow-xs">
                <Star className="w-3.5 h-3.5 text-[#E8A33D] fill-[#E8A33D]" />
                <span className="font-mono text-xs font-bold text-[#2B1B2E]">{provider.rating}</span>
                <span className="text-[10px] text-[#6B6570] font-mono">({provider.reviewCount})</span>
              </div>

              {/* Distance Tag */}
              <div className="absolute top-3 right-3 bg-[#2B1B2E]/80 backdrop-blur-xs text-[#F7F3EC] font-mono text-[10px] px-2 py-0.5 rounded">
                {provider.distance}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono text-[11px] text-[#6B6570] uppercase tracking-wider">
                  {provider.category}
                </span>
                <button
                  onClick={(e) => toggleFavorite(e, provider.id)}
                  className="text-[#CEC4CB] hover:text-[#C97B84] transition-colors p-1"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites[provider.id] ? 'fill-[#C97B84] text-[#C97B84]' : ''
                    }`}
                  />
                </button>
              </div>

              <h2 className="font-serif text-lg font-bold text-[#2B1B2E] mb-1 leading-snug group-hover:text-[#835400] transition-colors">
                {provider.name}
              </h2>

              <p className="font-sans text-xs text-[#6B6570] line-clamp-2 mb-3 leading-relaxed">
                {provider.bio}
              </p>

              {/* Ticket Tear Line & Next Available Footer */}
              <div className="border-t border-dashed border-[#CEC4CB] pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#2B1B2E]">
                  <Calendar className="w-4 h-4 text-[#5C8374]" />
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#6B6570] block leading-none">
                      Next Available
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#2B1B2E]">
                      {provider.nextAvailable}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProvider(provider);
                  }}
                  className="bg-[#2B1B2E] hover:bg-[#FEB64E] hover:text-[#2B1B2E] text-[#F7F3EC] font-sans font-semibold text-xs px-4 py-2 rounded-xs transition-colors shadow-xs"
                >
                  Book
                </button>
              </div>
            </div>
          </article>
        ))}

        {filteredProviders.length === 0 && (
          <div className="p-8 text-center bg-[#FDF9F2] border border-dashed border-[#CEC4CB] rounded">
            <p className="font-serif text-base text-[#2B1B2E] mb-1">No providers found</p>
            <p className="font-sans text-xs text-[#6B6570]">
              Try searching for "hair", "massage", or reset the category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
