import React, { useState, useEffect } from 'react';

export const Navbar = ({ onOpenChat, onOpen3D }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'border-b border-stone-200/90 bg-white/90 shadow-md backdrop-blur-xl py-3.5' 
        : 'border-b border-stone-200/40 bg-white/60 backdrop-blur-md py-5'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Brand Identity */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-700 text-white shadow-md shadow-stone-900/10 group-hover:scale-105 transition-transform duration-300">
            <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-wider text-stone-950 uppercase font-serif-luxury">
              AETHEL <span className="text-amber-700 font-sans font-light">ARCHITECTS</span>
            </span>
            <span className="text-[9px] font-mono-tech tracking-widest text-stone-500 uppercase font-semibold">
              Engineering Meets Art • Bespoke Estates
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-stone-700">
          <a href="#estates" className="transition-colors hover:text-amber-700">Estates</a>
          <a href="#3d-studio" className="transition-colors hover:text-amber-700 flex items-center gap-1.5">
            <span>3D Studio</span>
            <span className="rounded-full bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 font-mono">WebGL</span>
          </a>
          <a href="#material-lab" className="transition-colors hover:text-amber-700">Material Lab</a>
          <a href="#capabilities" className="transition-colors hover:text-amber-700">Engineering</a>
          <a href="#ai-architect" className="transition-colors hover:text-amber-700">AI Consultant</a>
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={onOpen3D}
            className="rounded-xl border border-stone-300 bg-stone-100/80 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-200 transition-all"
          >
            📐 3D BIM Viewer
          </button>
          <button
            onClick={onOpenChat}
            className="group relative inline-flex items-center space-x-2 overflow-hidden rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-stone-900/10 transition-all duration-300 hover:bg-amber-600 hover:shadow-amber-600/20"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Consult AI Architect</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-stone-800 hover:text-amber-700 p-2"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white/95 px-6 py-6 space-y-4 shadow-xl backdrop-blur-2xl">
          <a
            href="#estates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-amber-700"
          >
            Estates Portfolio
          </a>
          <a
            href="#3d-studio"
            onClick={() => { setMobileMenuOpen(false); onOpen3D(); }}
            className="block text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-amber-700"
          >
            3D Structural Studio
          </a>
          <a
            href="#material-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-amber-700"
          >
            Material Resonance Lab
          </a>
          <a
            href="#ai-architect"
            onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}
            className="block text-xs font-bold uppercase tracking-wider text-amber-700 font-mono"
          >
            Consult AI Principal Architect →
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
