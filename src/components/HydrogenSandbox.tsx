/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ruler, Sparkles, Scale, Minimize2, Search } from 'lucide-react';
import { PRESET_DISTANCES, COSMIC_STEP_M, CHRON_UNIT_S } from '../utils.ts';
import { DistanceItem } from '../types.ts';

export default function HydrogenSandbox() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'micro' | 'human' | 'planetary' | 'cosmic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<DistanceItem>(
    PRESET_DISTANCES.find(d => d.id === 'cosmicstep') || PRESET_DISTANCES[5]
  );

  const categories = [
    { value: 'all', label: 'All Dimensions' },
    { value: 'micro', label: 'Microscopic (Sub-atomic/Cellular)' },
    { value: 'human', label: 'Anthropocene (Human/Local)' },
    { value: 'planetary', label: 'Geophysical (Orbital/Planetary)' },
    { value: 'cosmic', label: 'Astrophysical (Interstellar)' },
  ];

  // Filtering list
  const filteredItems = PRESET_DISTANCES.filter(item => {
    const categoryMatches = selectedCategory === 'all' || item.category === selectedCategory;
    const searchMatches = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatches && searchMatches;
  });

  // Calculate Conversions
  const distanceStepsCount = selectedItem.meters / COSMIC_STEP_M;
  const standardTravelTimeS = selectedItem.meters / 299792458; // actual light travel seconds

  // Format Scientific Notation nicely
  const formatScientific = (num: number, limit: number = 3) => {
    if (num >= 0.001 && num < 10000) {
      return num.toLocaleString(undefined, { maximumFractionDigits: limit });
    }
    return num.toExponential(limit);
  };

  // Human-readable standard seconds wrapper
  const formatSubdivisionSeconds = (secs: number) => {
    if (secs < 1e-9) return `${(secs * 1e12).toFixed(2)} ps (picoseconds)`;
    if (secs < 1e-6) return `${(secs * 1e9).toFixed(2)} ns (nanoseconds)`;
    if (secs < 1e-3) return `${(secs * 1e6).toFixed(2)} μs (microseconds)`;
    if (secs < 1) return `${(secs * 1000).toFixed(2)} ms (milliseconds)`;
    if (secs < 3600) return `${secs.toFixed(2)} seconds`;
    if (secs < 86400) return `${(secs / 3600).toFixed(2)} hours`;
    return `${(secs / 86400).toFixed(2)} days`;
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="hydrogen-sandbox-dock">
      {/* Dimension database and search left */}
      <div className="lg:col-span-5 hardware-border bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-light text-zinc-100 uppercase tracking-tight mb-2 flex items-center gap-1.5">
            <Ruler size={18} className="text-cyan-400" />
            Astrophysical Distance Database
          </h3>
          <p className="text-xs text-zinc-450 mb-4 leading-relaxed font-light">
            Select standard objects and celestial markers to measure their scales in universal **Cosmic Steps** (Hydrogen Wavelengths).
          </p>

          {/* Search bar */}
          <div className="relative mb-3.5">
            <Search size={13} className="text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cosmic markers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8.5 pr-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-550/80 text-zinc-100 font-mono"
              id="inp-sandbox-search"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as any)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors border uppercase tracking-wider font-mono ${
                  selectedCategory === cat.value
                    ? 'bg-cyan-500 border-cyan-400 text-zinc-950 font-bold'
                    : 'bg-zinc-950 border-zinc-855 text-zinc-450 hover:bg-zinc-900/80 hover:text-zinc-300'
                }`}
                id={`btn-cat-${cat.value}`}
              >
                {cat.label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Table list */}
          <div className="border border-zinc-900/70 rounded-xl overflow-hidden max-h-[290px] overflow-y-auto bg-zinc-950/20">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-550">
                No matched astronomical markers found.
              </div>
            ) : (
              <div className="divide-y divide-zinc-900 text-xs text-left">
                {filteredItems.map(item => {
                  const isSelected = selectedItem.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left px-3.5 py-2.5 flex justify-between items-center transition-colors ${
                        isSelected 
                          ? 'bg-cyan-950/20 border-l-2 border-cyan-550 text-[#f4f4f5]' 
                          : 'hover:bg-zinc-900/40 text-zinc-400'
                      }`}
                      id={`btn-item-${item.id}`}
                    >
                      <div>
                        <span className="font-semibold block text-xs text-zinc-200">{item.name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wide font-mono">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400 text-right">
                        {formatScientific(item.meters)} m
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="text-[9px] text-zinc-500 font-mono mt-4 font-light leading-normal">
          *1 Cosmic Step = 21.10611405 cm. Exactly 1.00 Cosmic Step takes exactly 1.00 Chron-Unit to propagate.
        </div>
      </div>

      {/* Conversion details & Physics visualizer right */}
      <div className="lg:col-span-7 hardware-border bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4 border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#22d3ee] block">
                Relative Dimensional Analysis
              </span>
              <h2 className="text-xl font-light text-zinc-150 uppercase mt-1 tracking-wide font-sans">
                {selectedItem.name}
              </h2>
            </div>
            
            <div className="bg-cyan-950/20 border border-cyan-900/40 px-3 py-1 text-center rounded-lg">
              <span className="text-[9px] uppercase font-mono text-cyan-400 block font-semibold">Unit Class</span>
              <span className="text-xs font-bold font-mono text-cyan-300 capitalize">{selectedItem.category}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* The Metric Conversion Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-zinc-500 mb-1.5 font-mono">
                  <Scale size={14} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Absolute Metric Scale</span>
                </div>
                <div className="font-mono">
                  <span className="text-lg font-bold text-zinc-200">{formatScientific(selectedItem.meters, 6)}</span>
                  <span className="text-xs text-zinc-500 ml-1 font-semibold">meters</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 font-light">
                  In traditional, Earth-centric geographic meters.
                </p>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-3 translate-x-3 text-cyan-950 pointer-events-none">
                  <Sparkles size={110} />
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 mb-1.5 font-mono">
                  <Sparkles size={14} className="text-cyan-400" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Universal Cosmic Steps</span>
                </div>
                <div className="font-mono">
                  <span className="text-lg font-bold text-cyan-400 glow-cyan">
                    {formatScientific(distanceStepsCount, 6)}
                  </span>
                  <span className="text-xs text-cyan-300 ml-1 font-semibold">Steps</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 font-light">
                  Relative to Hydrogen Vacuum wavelengths.
                </p>
              </div>
            </div>

            {/* Scientific Mapping Notice */}
            <div className="bg-zinc-900/35 border border-zinc-900/80 p-4 rounded-xl">
              <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5 uppercase font-mono tracking-wider">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                Exact 1:1 Light Velocity Principle
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3 font-light">
                Since <strong className="text-emerald-300">1 Chron-Unit (cu)</strong> is the exact physical duration required for photons to propagate <strong className="text-emerald-300">1 Cosmic Step</strong>, light takes precisely:
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-950 border border-zinc-850 p-3 rounded-lg">
                <div className="font-mono text-left">
                  <span className="text-base font-bold text-emerald-400 block glow-cyan-sm">
                    {formatScientific(distanceStepsCount, 6)} cu
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                    Universal Time
                  </span>
                </div>
                <div className="text-zinc-650 text-xs font-mono font-bold">&harr;</div>
                <div className="font-mono text-left">
                  <span className="text-xs font-bold text-zinc-350 block">
                    {formatSubdivisionSeconds(standardTravelTimeS)}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                    Standard Earth Time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual scale gauge */}
        <div className="pt-4 border-t border-zinc-900 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-cyan-400 border border-cyan-600 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse"></div>
            <span className="text-xs font-mono text-zinc-500">Atomic Ground State</span>
            <div className="w-2.5 h-[#2px] bg-cyan-400/30 rounded-full ml-2"></div>
            <span className="text-xs font-mono text-zinc-550 ml-1">Excitation Wave</span>
          </div>
          
          <div className="text-xs text-zinc-505 font-light">
            Hydrogen emission &bull; Exact Vacuum Density
          </div>
        </div>
      </div>
    </div>
  );
}
