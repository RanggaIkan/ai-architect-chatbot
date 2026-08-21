import React, { useState } from 'react';

const MATERIALS_DATABASE = [
  {
    id: "uhpc",
    name: "Ultra-High-Performance Concrete (UHPC)",
    category: "Composite Cementitious",
    compressiveStrength: "150 - 220 MPa",
    tensileStrength: "15 - 25 MPa",
    density: "2,500 kg/m³",
    carbonIndex: "B+ (Low Clinker Slag)",
    baseLifespan: 120, // years
    thermalCoeff: 11.5, // 10^-6 / K
    seismicDuctility: "High (Steel Fiber Reinforced)",
    idealUsage: "Long-span cantilever soffits, marine cliff edge anchors"
  },
  {
    id: "glulam",
    name: "Cross-Laminated Structural Timber (CLT / Glulam)",
    category: "Bio-Composite Mass Timber",
    compressiveStrength: "45 - 60 MPa",
    tensileStrength: "30 - 45 MPa",
    density: "520 kg/m³",
    carbonIndex: "A+ (Carbon Negative Sequestering)",
    baseLifespan: 90,
    thermalCoeff: 5.0,
    seismicDuctility: "Superior (Elastic Joint Damping)",
    idealUsage: "High-altitude highland retreats, biophilic atrium trusses"
  },
  {
    id: "titanium",
    name: "Marine-Grade Anodized Titanium Alloy",
    category: "Aerospace Structural Cladding",
    compressiveStrength: "880 MPa",
    tensileStrength: "950 MPa",
    density: "4,500 kg/m³",
    carbonIndex: "B (100% Infinite Recyclability)",
    baseLifespan: 200,
    thermalCoeff: 8.6,
    seismicDuctility: "Extreme Ductility",
    idealUsage: "Coastal storm surge envelopes, kinetic shading facades"
  },
  {
    id: "rammed_earth",
    name: "Hydraulically Stabilized Rammed Earth",
    category: "Geo-Earthen Monolith",
    compressiveStrength: "8 - 14 MPa",
    tensileStrength: "1.2 - 2.5 MPa",
    density: "2,100 kg/m³",
    carbonIndex: "A++ (Zero Embodied Carbon)",
    baseLifespan: 80,
    thermalCoeff: 6.2,
    seismicDuctility: "Moderate (Requires Bond Beams)",
    idealUsage: "Subterranean desert sanctuaries, massive thermal inertia walls"
  }
];

export const MaterialResonanceLab = ({ onConsultMaterial }) => {
  const [selectedMatId, setSelectedMatId] = useState("uhpc");
  const [temp, setTemp] = useState(32); // Celsius
  const [seismicPga, setSeismicPga] = useState(0.35); // g
  const [salinity, setSalinity] = useState(75); // %

  const selectedMat = MATERIALS_DATABASE.find((m) => m.id === selectedMatId) || MATERIALS_DATABASE[0];

  // Dynamic calculations based on stressors
  const adjustedLifespan = Math.max(
    30,
    Math.round(selectedMat.baseLifespan - (salinity * 0.15) - (seismicPga * 25))
  );

  const thermalExpansionMm = ((selectedMat.thermalCoeff * (temp - 20) * 12) / 1000).toFixed(3);

  const handleAskAI = () => {
    const prompt = `Run a material science consultation for ${selectedMat.name}. Environmental condition parameters: Ambient Temperature=${temp}°C, Seismic PGA=${seismicPga}g, Coastal Salinity=${salinity}%. Evaluate thermal movement (${thermalExpansionMm}mm/12m span), predicted lifespan (${adjustedLifespan} yrs), and recommend optimal joint sealants or alloy coatings.`;
    if (onConsultMaterial) {
      onConsultMaterial(prompt);
    }
  };

  return (
    <section className="py-24 bg-stone-100/60 border-b border-stone-200 relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
                Material Science & Environmental Physics
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
              Bespoke Material Resonance Lab
            </h2>
            <p className="mt-2 text-sm text-stone-600 font-light max-w-2xl">
              Simulate how ultra-luxury architectural materials react to seismic ground acceleration, extreme thermal swings, and corrosive coastal marine salinity in real time.
            </p>
          </div>

          {/* Material Select Pills */}
          <div className="flex flex-wrap gap-2">
            {MATERIALS_DATABASE.map((mat) => (
              <button
                key={mat.id}
                onClick={() => setSelectedMatId(mat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedMatId === mat.id
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'border border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-stone-900'
                }`}
              >
                {mat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Lab Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Material Profile Spec Card */}
          <div className="lg:col-span-1 rounded-3xl border border-stone-300/80 bg-white p-7 shadow-xl shadow-stone-200/50">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700">
                {selectedMat.category}
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
                {selectedMat.carbonIndex}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-stone-900 mt-4">
              {selectedMat.name}
            </h3>

            <div className="mt-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Compressive Strength</span>
                <span className="font-bold text-stone-900">{selectedMat.compressiveStrength}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Tensile Strength</span>
                <span className="font-bold text-amber-800">{selectedMat.tensileStrength}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Material Density</span>
                <span className="font-bold text-stone-900">{selectedMat.density}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Seismic Ductility</span>
                <span className="font-bold text-emerald-700">{selectedMat.seismicDuctility}</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-stone-50 p-4 border border-stone-200 text-xs">
              <span className="block font-mono text-[10px] uppercase font-bold text-stone-500 mb-1">Optimal Typology</span>
              <p className="text-stone-700 font-light">{selectedMat.idealUsage}</p>
            </div>
          </div>

          {/* Right: Environmental Stressor Controls & Realtime Telemetry */}
          <div className="lg:col-span-2 rounded-3xl border border-stone-300/80 bg-white p-7 shadow-xl shadow-stone-200/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <h4 className="text-base font-extrabold text-stone-900 uppercase font-mono">
                  Environmental Stressor Controls
                </h4>
                <span className="text-xs font-mono text-stone-400">Live Computational Engine</span>
              </div>

              {/* Stressor Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Temperature */}
                <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-stone-700">Ambient Temp</span>
                    <span className="text-sm font-mono font-black text-amber-700">{temp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="50"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <span className="block text-[10px] text-stone-400 font-mono mt-1">Extreme Frost to Desert Heat</span>
                </div>

                {/* 2. Seismic PGA */}
                <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-stone-700">Seismic PGA</span>
                    <span className="text-sm font-mono font-black text-rose-700">{seismicPga}g</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.85"
                    step="0.05"
                    value={seismicPga}
                    onChange={(e) => setSeismicPga(Number(e.target.value))}
                    className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <span className="block text-[10px] text-stone-400 font-mono mt-1">Zone 1 (Low) to Zone 5 (High)</span>
                </div>

                {/* 3. Salinity */}
                <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-stone-700">Marine Salinity</span>
                    <span className="text-sm font-mono font-black text-blue-700">{salinity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={salinity}
                    onChange={(e) => setSalinity(Number(e.target.value))}
                    className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="block text-[10px] text-stone-400 font-mono mt-1">Inland to Direct Oceanfront</span>
                </div>
              </div>

              {/* Stress Results Telemetry Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-stone-900 text-white p-5 shadow-lg">
                  <span className="block text-[10px] font-mono uppercase text-stone-400">Simulated Coastal Lifespan</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-black font-mono text-amber-400">{adjustedLifespan}</span>
                    <span className="text-xs font-mono text-stone-300">Years without structural spalling</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2 font-light">
                    Calculated under combined chloride penetration and cyclical seismic strain.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-900 text-white p-5 shadow-lg">
                  <span className="block text-[10px] font-mono uppercase text-stone-400">Thermal Joint Expansion (12m Span)</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-black font-mono text-emerald-400">{thermalExpansionMm}</span>
                    <span className="text-xs font-mono text-stone-300">mm linear delta</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2 font-light">
                    Expansion joint sizing requirement relative to 20°C baseline datum.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Action CTA */}
            <div className="mt-8 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-stone-500">
                Require specialized alloy coatings or bio-resins?
              </span>
              <button
                onClick={handleAskAI}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-600 transition-colors shadow-md"
              >
                <span>Consult AI On This Material</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaterialResonanceLab;
