import React from 'react';
import { STUDIO_CAPABILITIES } from '../data/estatesData';

export const ServicesSection = () => {
  return (
    <section id="capabilities" className="py-24 bg-white border-b border-stone-200 relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
            Full-Spectrum Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 mt-1.5 tracking-tight font-serif-luxury">
            Engineering Rigor Meets High Art
          </h2>
          <p className="mt-2.5 text-sm text-stone-600 font-light">
            We integrate computational architectural geometry, finite element structural analysis, rare material provenance, and conversational AI consulting into every commission.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STUDIO_CAPABILITIES.map((cap, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl border border-stone-200/90 bg-stone-50/70 p-8 shadow-sm hover:shadow-xl hover:shadow-stone-200/60 hover:border-amber-600/50 hover:bg-white transition-all duration-300"
            >
              {/* Subtle top accent bar */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-600/0 via-amber-600 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-stone-200 text-2xl mb-6 shadow-sm group-hover:border-amber-600/40 group-hover:scale-110 transition-all">
                {cap.icon}
              </div>

              <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors font-serif-luxury">
                {cap.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
