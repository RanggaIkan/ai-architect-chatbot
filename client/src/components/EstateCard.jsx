import React from 'react';

export const EstateCard = ({ estate, onConsultEstate, onOpen3DWithEstate }) => {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-xl shadow-stone-200/50 transition-all duration-500 hover:border-amber-600/50 hover:shadow-2xl hover:shadow-amber-600/10 hover:-translate-y-1.5">
      {/* Top Media Section */}
      <div>
        <div className="relative h-72 w-full overflow-hidden bg-stone-100">
          <img
            src={estate.image}
            alt={estate.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

          {/* Status & Category Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="rounded-xl bg-white/90 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-800 border border-stone-200 shadow-sm backdrop-blur-md">
              {estate.category}
            </span>
            <span className="rounded-xl bg-stone-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white border border-stone-700 backdrop-blur-md">
              {estate.status}
            </span>
          </div>

          {/* Location & Title */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-widest text-amber-300 font-semibold">
                {estate.location}
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-amber-200 transition-colors font-serif-luxury">
                {estate.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase font-mono text-stone-300">Valuation</span>
              <span className="text-lg font-mono font-black text-amber-300">{estate.price}</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 font-light">
            {estate.description}
          </p>

          {/* Structural Matrix */}
          <div className="space-y-2 rounded-2xl bg-stone-50 p-4 border border-stone-200 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold">Structural System</span>
              <span className="text-[11px] text-stone-800 font-bold truncate max-w-[190px]">{estate.structuralSystem}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold">Seismic Rating</span>
              <span className="text-[11px] text-emerald-700 font-bold">{estate.seismicRating}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold">Footprint / Year</span>
              <span className="text-[11px] text-stone-700 font-bold">{estate.area} • {estate.year}</span>
            </div>
          </div>

          {/* Material Palette Tags */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">
              Curated Material Palette
            </span>
            <div className="flex flex-wrap gap-1.5">
              {estate.primaryMaterials.map((mat, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] text-stone-700 border border-stone-200 font-medium"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onOpen3DWithEstate && onOpen3DWithEstate(estate)}
          className="flex items-center justify-center space-x-1.5 rounded-xl border border-stone-300 bg-stone-100 py-3 text-xs font-mono font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-200 transition-colors"
        >
          <span>📐 3D Model</span>
        </button>

        <button
          onClick={() => onConsultEstate(estate)}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-stone-900 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-600 transition-all shadow-md shadow-stone-900/10"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};

export default EstateCard;
