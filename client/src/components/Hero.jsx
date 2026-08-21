import React from 'react';

export const Hero = ({ onExplore, onOpen3D, onConsult }) => {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32 bg-stone-50 border-b border-stone-200">
      {/* Background Architectural Blueprint Grid & Warm Ambient Glows */}
      <div className="absolute inset-0 bg-grid-stone pointer-events-none" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-amber-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[350px] w-[450px] rounded-full bg-orange-400/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Top Status Pill */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-amber-600/30 bg-amber-50/90 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-amber-800 mb-8 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>
          <span>Bespoke Architecture • 3D BIM Physics • AI Reasoning</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 max-w-5xl mx-auto leading-[1.1] font-serif-luxury">
          Sculpting Space with <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-stone-900 bg-clip-text text-transparent font-sans italic font-black">
            Monumental Physics.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed font-light">
          AETHEL engineers radical bespoke residences and private estates combining extreme cantilever geometry, sustainable carbon-neutral envelopes, and interactive 3D AI structural intelligence.
        </p>

        {/* Action Button Cluster */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 rounded-2xl bg-stone-900 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-stone-900/15 transition-all hover:bg-amber-600 hover:scale-105 active:scale-95"
          >
            <span>Explore Estates Portfolio</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <button
            onClick={onOpen3D}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 rounded-2xl border border-stone-300 bg-white/90 px-8 py-4 text-xs font-bold uppercase tracking-widest text-stone-800 shadow-md shadow-stone-200/50 backdrop-blur-xl transition-all hover:border-amber-600 hover:text-amber-800 hover:bg-amber-50/50"
          >
            <span className="h-2 w-2 rounded-full bg-amber-600" />
            <span>Launch 3D Structural Studio</span>
          </button>

          <button
            onClick={onConsult}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-2xl border border-amber-600/30 bg-amber-100/50 px-6 py-4 text-xs font-mono font-bold uppercase tracking-widest text-amber-900 hover:bg-amber-100 transition-all"
          >
            <span>AI Consultant</span>
            <span className="text-emerald-700">●</span>
          </button>
        </div>

        {/* Engineering Metrics Dashboard Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-10 border-t border-stone-200 text-left">
          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Max Cantilever</span>
              <span className="text-[10px] text-amber-700 font-mono font-bold">14.0m</span>
            </div>
            <span className="block text-2xl font-black text-stone-900">Post-Tensioned</span>
            <span className="text-[11px] text-stone-500">Zero Mid-Span Columns</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Seismic Resilience</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">PGA 0.45g</span>
            </div>
            <span className="block text-2xl font-black text-stone-900">Zone 4 Certified</span>
            <span className="text-[11px] text-stone-500">Base Isolation Dampers</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">3D WebGL Engine</span>
              <span className="text-[10px] text-amber-700 font-mono font-bold">60 FPS</span>
            </div>
            <span className="block text-2xl font-black text-stone-900">Interactive BIM</span>
            <span className="text-[11px] text-stone-500">Real-time FEA Stress View</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">AI Intelligence</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">Live</span>
            </div>
            <span className="block text-2xl font-black text-amber-700">Groq LLaMA-3.1</span>
            <span className="text-[11px] text-stone-500">Material & Physics Engine</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
