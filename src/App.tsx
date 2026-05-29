/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import OdometerClock from './components/OdometerClock.tsx';
import PlaygroundConverter from './components/PlaygroundConverter.tsx';
import HydrogenSandbox from './components/HydrogenSandbox.tsx';
import CosmicAnalogClock from './components/CosmicAnalogClock.tsx';
import CosmicDocumentationModal from './components/CosmicDocumentationModal.tsx';
import { Sparkles, Globe, Sun, ArrowRight, BookOpen, FileText } from 'lucide-react';
import { msToChronUnits, decomposeChronUnits, OFFSET_CU, SN1987A_TIMESTAMP } from './utils.ts';

export default function App() {
  // Top-level shared cosmic clocks states
  const [accumulatedCu, setAccumulatedCu] = useState<number>(() => {
    // Hardcoded absolute baseline calibration accounts for the 168,000 light-year wavefront travel
    return OFFSET_CU + msToChronUnits(Date.now() - SN1987A_TIMESTAMP);
  });
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDocOpen, setIsDocOpen] = useState<boolean>(false);

  const decomposed = decomposeChronUnits(accumulatedCu);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-cyan-950 selection:text-cyan-200 pb-12" id="app-workspace">
      {/* Upper absolute details strip */}
      <div className="bg-black/90 backdrop-blur-md text-zinc-500 py-2 px-4 text-center text-[10px] tracking-widest font-mono uppercase border-b border-zinc-900 flex flex-wrap justify-center items-center gap-x-6 gap-y-1 relative z-50">
        <span>Cosmic Step: 21.10611405 cm</span>
        <span>&bull;</span>
        <span>Chron-Unit: 0.70401484 ns</span>
        <span>&bull;</span>
        <span>Natural Metric Time Standard</span>
      </div>

      {/* Main dashboard container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Main Header */}
        <header className="mb-8 mt-4 relative" id="dashboard-header">
          {/* Top-Right Documentation Button */}
          <div className="md:absolute md:top-0 md:right-0 flex justify-center mb-5 md:mb-0">
            <button 
              onClick={() => setIsDocOpen(true)}
              className="text-xs font-mono font-semibold bg-zinc-950/80 hover:bg-cyan-950/30 border border-zinc-800 hover:border-cyan-500/80 text-zinc-400 hover:text-cyan-400 px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.02)] hover:shadow-[0_0_15px_rgba(34,211,238,0.08)] flex items-center gap-2 cursor-pointer"
              id="top-right-doc-btn"
            >
              <BookOpen size={13} className="text-cyan-400" />
              <span>Theory &amp; Math Docs</span>
            </button>
          </div>

          {/* System Status, Main Title and Sub-header at the top */}
          <div className="flex flex-col items-center text-center gap-2 mb-6">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase font-bold">System Status: Synchronized</span>
            </div>
            <h1 className="text-3xl font-light tracking-tighter text-zinc-100 uppercase">
              Universal Light-Speed Clock <span className="text-zinc-600">/ Base-100</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light mx-auto">
              An absolute cosmological clock operating independently of Earth-centric cycles (no days, years, or seconds). Anchored entirely on the physical wavelength of Hydrogen.
            </p>
          </div>

          {/* Quick Informational side-by-side clocks - Positioned at Center */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center overflow-hidden">
              {/* Earth Time Badge */}
              <div className="bg-zinc-950/60 shadow-inner border border-zinc-900 px-4 py-3 rounded-xl flex items-center gap-3 min-w-[190px]">
                <div className="p-2 bg-amber-950/20 text-amber-500 border border-amber-900/20 rounded-lg">
                  <Sun size={15} />
                </div>
                <div className="text-left font-mono">
                  <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-bold">Earth Observer Time</span>
                  <span className="text-xs font-bold text-zinc-300 block mt-1 leading-none">
                    {new Date().getUTCHours().toString().padStart(2, '0')}:
                    {new Date().getUTCMinutes().toString().padStart(2, '0')}:
                    {new Date().getUTCSeconds().toString().padStart(2, '0')} UTC
                  </span>
                </div>
              </div>

              {/* Cosmic Lightspeed Time Badge */}
              <div className="bg-zinc-950/60 shadow-inner border border-zinc-900 px-4 py-3 rounded-xl flex items-center gap-3 min-w-[215px]">
                <div className="p-2 bg-cyan-950/30 text-cyan-400 border border-cyan-900/20 rounded-lg shadow-[0_0_8px_rgba(34,211,238,0.15)] animate-pulse">
                  <Sparkles size={15} />
                </div>
                <div className="text-left font-mono">
                  <span className="text-[10px] text-cyan-400 block uppercase tracking-wider font-bold">Lightspeed Clock</span>
                  <span className="text-xs font-bold text-cyan-300 block mt-1 leading-none">
                    {decomposed.vector}.{decomposed.centum}.{decomposed.shift.toString().padStart(2, '0')}.{(decomposed.totalSessions % 100).toString().padStart(2, '0')}
                    <span className="text-zinc-650 mx-1">:</span>
                    <span className="text-zinc-350">
                      {decomposed.epoch.toString().padStart(2, '0')}.{decomposed.giga.toString().padStart(2, '0')}.{decomposed.mega.toString().padStart(2, '0')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Large Analog Clock centered above main grid */}
          <div className="flex flex-col items-center text-center border-b border-zinc-900 pb-8 mb-6">
            <CosmicAnalogClock accumulatedCu={accumulatedCu} decomposed={decomposed} />
          </div>
        </header>

        {/* Bento Dashboard Grid */}
        <div className="flex flex-col gap-8">
          
          {/* Bento Slot 1: Hero Odometer Clock Receiver */}
          <section id="module-clock">
            <OdometerClock 
              accumulatedCu={accumulatedCu}
              setAccumulatedCu={setAccumulatedCu}
              speedMultiplier={speedMultiplier}
              setSpeedMultiplier={setSpeedMultiplier}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />
          </section>

          {/* Educational Concept Banner */}
          <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-2xl p-5 flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-cyan-950/60 text-cyan-400 border border-cyan-900/30 rounded-xl mt-0.5 shrink-0 shadow-lg">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">
                  The Physics Principle
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-4xl font-light">
                  Traditional seconds are based on Earth’s arbitrary rotational length divider (1/86,400th of a day). The **Universal Light-Speed Clock** anchors time on a cosmic physical constant: the exact duration light takes to travel **1 Wavelength of Hydrogen** (the universe's primary element) in a vacuum. Scaling this base-unit exclusively in physical powers of 100 provides an absolute metric system suited for interplanetary spaceflight operations.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto justify-end">
              <button 
                onClick={() => setIsDocOpen(true)}
                className="text-xs font-bold bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/50 hover:border-cyan-400/80 text-cyan-400 px-4 py-2 rounded-xl transition-all shadow-[0_0_12px_rgba(34,211,238,0.08)] cursor-pointer flex items-center gap-1.5 font-mono"
                id="btn-open-full-docs"
              >
                <FileText size={13} />
                <span>Theory &amp; Chron Math Docs</span>
              </button>

              <a 
                href="#module-converter" 
                className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 whitespace-nowrap flex items-center gap-1 font-mono transition-colors"
              >
                <span>Test Formulas</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8" id="module-converter">
            {/* Bento Slot 2: Conversion Laboratories and Photon propagation tests */}
            <PlaygroundConverter />
          </div>

          {/* Bento Slot 3: Astrophysical Distance Analyser */}
          <section id="module-sandbox">
            <HydrogenSandbox />
          </section>

        </div>

        {/* Humble Footer */}
        <footer className="text-center text-[10px] font-mono text-zinc-650 tracking-wider text-zinc-500 mt-16 border-t border-zinc-900 pt-6">
          Universal Space Chronometer System &bull; Vacuum Light Density Protocol &bull; Standard Calibration 1.0.0
        </footer>

      </div>

      {/* Interactive Documentation Overlay */}
      <CosmicDocumentationModal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} />
    </div>
  );
}
