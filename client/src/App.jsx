import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Architectural3DViewer from './components/Architectural3DViewer';
import MaterialResonanceLab from './components/MaterialResonanceLab';
import EstateGrid from './components/EstateGrid';
import ServicesSection from './components/ServicesSection';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const [activePrompt, setActivePrompt] = useState(null);
  const chatSectionRef = useRef(null);
  const studio3DRef = useRef(null);

  const scrollToChat = (prompt = null) => {
    if (prompt) {
      setActivePrompt(prompt);
    }
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo3D = () => {
    studio3DRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConsultEstate = (estate) => {
    scrollToChat(estate.promptSeed);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-600 selection:text-white">
      {/* 1. Sticky Navigation */}
      <Navbar
        onOpenChat={() => scrollToChat()}
        onOpen3D={scrollTo3D}
      />

      {/* 2. Hero Section */}
      <Hero
        onExplore={() => document.getElementById('estates')?.scrollIntoView({ behavior: 'smooth' })}
        onOpen3D={scrollTo3D}
        onConsult={() => scrollToChat()}
      />

      {/* 3. Interactive 3D WebGL Structural BIM Studio (NEW) */}
      <section id="3d-studio" ref={studio3DRef} className="py-24 bg-stone-100/50 border-b border-stone-200 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
              Interactive 3D WebGL Engine
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 mt-1.5 tracking-tight font-serif-luxury">
              Real-Time 3D Structural Physics Inspector
            </h2>
            <p className="mt-2 text-sm text-stone-600 font-light">
              Rotate, zoom, and inspect finite element stress heatmaps, long-span cantilevers, and wind deflection behavior directly in your browser.
            </p>
          </div>

          <Architectural3DViewer onSendToAI={(prompt) => scrollToChat(prompt)} />
        </div>
      </section>

      {/* 4. Interactive Material Resonance Lab (NEW) */}
      <MaterialResonanceLab onConsultMaterial={(prompt) => scrollToChat(prompt)} />

      {/* 5. Curated Architectural Estates Showcase */}
      <EstateGrid
        onConsultEstate={handleConsultEstate}
        onOpen3DWithEstate={() => scrollTo3D()}
      />

      {/* 6. Engineering Capabilities & Services */}
      <ServicesSection />

      {/* 7. Design Philosophy & Architectural Manifesto */}
      <section id="philosophy" className="py-24 bg-white border-b border-stone-200 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
                Studio Manifesto
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 mt-2 tracking-tight font-serif-luxury">
                "Form follows physics, elevated into sculpture."
              </h2>
              <p className="mt-6 text-sm text-stone-600 leading-relaxed font-light">
                At AETHEL, we reject decorative superficiality. Every cantilever, shear plane, and curve emerges from rigorous computational stress modeling, thermal optimization, and direct material resonance.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-stone-200 pt-6">
                <div>
                  <span className="block text-2xl font-black text-stone-900 font-mono">100%</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">Carbon Provenance Sourced</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-amber-700 font-mono">&lt; 0.2s</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">Groq AI Inference Latency</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 p-2 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
                alt="Architectural Blueprint and Model"
                className="rounded-2xl object-cover w-full h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 border border-stone-200 shadow-md backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block mb-0.5">Computational Model</span>
                <p className="text-xs text-stone-800">Finite Element Mesh (FEM) simulation showing stress distribution across composite glulam arches.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI Structural Studio Section */}
      <section id="ai-architect" ref={chatSectionRef} className="py-24 bg-stone-100/70 relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-amber-500/10 blur-[150px]" />

        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
          <div className="text-center max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
              Interactive Design Intelligence
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 mt-1.5 tracking-tight font-serif-luxury">
              Studio AI Structural Consultant
            </h2>
            <p className="mt-2.5 text-sm text-stone-600 font-light">
              Chat directly with our AI Principal Architect powered by Groq LLaMA-3.1. Inquire about load-bearing mechanics, seismic mitigation, or request tailored luxury material specifications in real time.
            </p>
          </div>

          {/* Interactive Chat Window */}
          <ChatWindow initialPrompt={activePrompt} />
        </div>
      </section>

      {/* 9. Floating Quick Action Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
        <button
          onClick={scrollTo3D}
          className="flex items-center space-x-1.5 rounded-2xl border border-stone-300 bg-white/95 px-4 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-stone-800 shadow-xl backdrop-blur-md hover:bg-stone-100 transition-all hover:scale-105 active:scale-95"
        >
          <span>📐 3D Studio</span>
        </button>

        <button
          onClick={() => scrollToChat()}
          className="flex items-center space-x-2 rounded-2xl bg-stone-900 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-stone-900/20 transition-all hover:bg-amber-600 hover:scale-105 active:scale-95"
        >
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span>Ask AI Architect</span>
        </button>
      </div>

      {/* 10. Footer */}
      <footer className="border-t border-stone-200 bg-white py-12 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-extrabold text-stone-900 uppercase tracking-wider font-serif-luxury text-sm">
            AETHEL <span className="text-amber-700 font-sans font-light">STUDIO</span>
          </span>
          <p>© 2026 AETHEL ARCHITECTURE & REAL ESTATE. All rights reserved.</p>
          <span className="font-mono text-[11px] text-stone-400">Powered by Groq LLaMA-3.1 Engine</span>
        </div>
      </footer>
    </div>
  );
}
