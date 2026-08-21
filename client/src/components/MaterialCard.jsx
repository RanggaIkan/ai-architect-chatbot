import React from 'react';

/**
 * Enterprise Architectural Material Card Component (Light Luxury Theme)
 * High-end alabaster & brushed gold styling showcasing structural physics, durability, and style fit.
 */
export const MaterialCard = ({ material }) => {
  if (!material) return null;

  const { name, physics, durability, styleFit } = material;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/80 p-5 shadow-sm transition-all duration-300 hover:border-amber-600/50 hover:bg-white hover:shadow-md">
      {/* Top Accent Gradient Line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-600/20 via-amber-600 to-amber-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header / Material Name */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold tracking-widest text-amber-800 uppercase">
          Material Spec
        </span>
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
      </div>

      <h4 className="text-sm font-extrabold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors font-serif-luxury">
        {name || 'Architectural Material'}
      </h4>

      {/* Specification Grid */}
      <div className="mt-3.5 space-y-2 text-xs leading-relaxed text-stone-700">
        {physics && (
          <div className="rounded-xl bg-white p-3 border border-stone-200 shadow-2xs">
            <span className="block font-mono text-[9px] font-bold tracking-wider text-stone-500 uppercase mb-0.5">
              Structural Physics & Load Profile
            </span>
            <p className="text-stone-800 font-light">{physics}</p>
          </div>
        )}

        {durability && (
          <div className="rounded-xl bg-white p-3 border border-stone-200 shadow-2xs">
            <span className="block font-mono text-[9px] font-bold tracking-wider text-stone-500 uppercase mb-0.5">
              Durability & Lifecycle Analysis
            </span>
            <p className="text-stone-800 font-light">{durability}</p>
          </div>
        )}

        {styleFit && (
          <div className="rounded-xl bg-white p-3 border border-stone-200 shadow-2xs">
            <span className="block font-mono text-[9px] font-bold tracking-wider text-amber-800 uppercase mb-0.5">
              Aesthetic & Style Integration
            </span>
            <p className="text-stone-800 font-light">{styleFit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;
