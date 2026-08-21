import React, { useState } from 'react';
import { ESTATES_DATA, CATEGORIES } from '../data/estatesData';
import EstateCard from './EstateCard';

export const EstateGrid = ({ onConsultEstate, onOpen3DWithEstate }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Typologies");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEstates = ESTATES_DATA.filter((estate) => {
    const matchesCategory = selectedCategory === "All Typologies" || estate.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      estate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estate.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estate.structuralSystem.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="estates" className="py-24 bg-stone-50 border-b border-stone-200 relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
              Curated Masterpieces
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 mt-1.5 tracking-tight font-serif-luxury">
              Architectural Estates & Landmarks
            </h2>
            <p className="mt-2.5 text-sm text-stone-600 font-light">
              Explore our built portfolio and private commissions. Every estate is modeled for extreme structural resilience, passive bioclimatics, and peerless luxury.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, location, or system..."
                className="w-full sm:w-64 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'border border-stone-300 bg-white text-stone-700 hover:text-stone-950 hover:border-stone-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estates Grid */}
        {filteredEstates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEstates.map((estate) => (
              <EstateCard
                key={estate.id}
                estate={estate}
                onConsultEstate={onConsultEstate}
                onOpen3DWithEstate={onOpen3DWithEstate}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-stone-300 bg-white p-12 text-center shadow-md">
            <p className="text-sm text-stone-500 font-mono">No architectural estates match your search query.</p>
            <button
              onClick={() => { setSelectedCategory("All Typologies"); setSearchQuery(""); }}
              className="mt-4 text-xs font-bold uppercase text-amber-700 underline hover:text-amber-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EstateGrid;
