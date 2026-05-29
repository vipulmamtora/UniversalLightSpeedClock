/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Compass, Scaling, Atom, Lightbulb, Activity, ChevronRight } from 'lucide-react';
import { COSMIC_STEP_M, SPEED_OF_LIGHT_M_S, CHRON_UNIT_S } from '../utils.ts';

interface CosmicDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'theory' | 'math' | 'hierarchy';

export default function CosmicDocumentationModal({ isOpen, onClose }: CosmicDocumentationModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('theory');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          id="doc-modal-backdrop"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.12)] overflow-hidden flex flex-col z-10"
          id="cosmic-docs-panel"
        >
          {/* Top header border line glow */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Modal Header */}
          <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-950/50 text-cyan-400 border border-cyan-900/30 rounded-xl shadow-inner">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 uppercase font-sans">
                  Astrophysical Chronometer Documentation
                </h2>
                <p className="text-xs text-zinc-400 font-light font-mono">
                  Standard Calibration protocol &bull; Hydrogen Base-100 metric system
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-zinc-900 bg-zinc-900/30 text-zinc-400 hover:text-zinc-105 hover:bg-zinc-900/80 transition-colors"
              id="doc-modal-close-btn"
              title="Close Documentation"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 border-b border-zinc-900 bg-zinc-950/40 flex gap-2 shrink-0 overflow-x-auto scrollbar-none py-2">
            {[
              { id: 'theory', label: '1. Relativistic Theory', icon: Compass },
              { id: 'math', label: '2. Chron Calculation (cu)', icon: Atom },
              { id: 'hierarchy', label: '3. Base-100 Hierarchy', icon: Scaling }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-all border whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-400 font-bold shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                  id={`doc-tab-${tab.id}`}
                >
                  <TabIcon size={14} className={isActive ? 'text-cyan-400' : 'text-zinc-500'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Content - Scrollable area */}
          <div className="p-6 overflow-y-auto max-h-full space-y-6 text-zinc-300 font-light text-sm" id="doc-modal-body">
            {activeTab === 'theory' && (
              <motion.div
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Motivation section */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
                    <Lightbulb size={13} /> The Geocentric Problem
                  </h3>
                  <p className="leading-relaxed text-zinc-400">
                    On Earth, timekeeping is inherently <span className="text-zinc-100 font-normal">geocentric and arbitrary</span>. 
                    The SI second is derived conceptually from historical subdivisions (1/86,400th of an Earth rotation cycle), 
                    while years represent a local orbit around a standard G-type main-sequence star.
                  </p>
                  <p className="leading-relaxed text-zinc-400">
                    To spacefaring civilizations or scientific systems operating independently of Earth, these dimensions carry no physical alignment. 
                    Furthermore, planetary rotations vary slightly over time due to tidal braking, and orbital definitions break down completely 
                    outside our Solar System.
                  </p>
                </div>

                {/* Hydrogen spin-flip */}
                <div className="bg-zinc-900/35 border border-zinc-900 p-4 rounded-xl space-y-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-[#fbbf24] font-semibold flex items-center gap-1.5">
                    <Activity size={13} /> The Neutral Hydrogen Solution
                  </h3>
                  <p className="leading-relaxed text-zinc-400">
                    The most plentiful constituent in our universe is **Hydrogen**, comprising over 74% of ordinary baryonic mass. 
                    In deep space, neutral hydrogen atoms in cold clouds undergo a highly stable hyperfine interaction: 
                    the **spin-flip transition**. 
                  </p>
                  <p className="leading-relaxed text-zinc-300 font-normal">
                    When the electron in a ground-state hydrogen atom flips its magnetic spin direction from parallel to antiparallel relative to the proton, 
                    it releases an exact packet of electromagnetic energy.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-2 border-t border-zinc-900/60">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-zinc-500 font-semibold block">Wavelength of Emitted Photon (λ)</span>
                      <span className="text-base font-bold font-mono text-zinc-200 block">
                        {COSMIC_STEP_M.toFixed(8)} meters
                      </span>
                      <span className="text-xs text-zinc-450 block font-light">Often colloquially simplified as the &quot;21.1 cm Hydrogen Line&quot;.</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-zinc-500 font-semibold block">Vacuum Propagation Velocity (c)</span>
                      <span className="text-base font-bold font-mono text-zinc-200 block">
                        {SPEED_OF_LIGHT_M_S.toLocaleString()} m/s
                      </span>
                      <span className="text-xs text-zinc-450 block font-light">The fundamental constant speed of light in space.</span>
                    </div>
                  </div>
                </div>

                {/* Operational Philosophy */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
                    Absolute Relativistic Synchrony
                  </h3>
                  <p className="leading-relaxed text-zinc-400">
                    By binding our base time interval to the exact duration light takes to travel **one single wavelength of neutral Hydrogen**, 
                    we construct a clock rooted purely in the physical fabric of space. 
                    Any crew in the universe, equipped with an radio receiver to pick up Hydrogen emission ripples and measuring spatial vectors, 
                    can reconstruct and calibrate this exact metric chronometer scale identically.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'math' && (
              <motion.div
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Mathematical Formulation */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
                    Deriving 1 Chron-Unit (cu)
                  </h3>
                  <p className="leading-relaxed text-zinc-400">
                    A single **Chron-Unit (cu)** is defined as the exact time delay experienced by light propagating across exactly $1$ Hydrogen wavelength in a vacuum:
                  </p>

                  <div className="bg-zinc-950 border border-zinc-900/80 p-5 rounded-xl my-4 text-center font-mono">
                    <div className="text-xs text-cyan-400/85 mb-2 font-bold uppercase tracking-wider">The Chron Formula</div>
                    <div className="text-xl sm:text-2xl text-zinc-100 font-semibold my-3 select-all">
                      t<sub>cu</sub> = &lambda;<sub>H</sub> / c
                    </div>
                    <div className="text-xs text-zinc-550 pt-2 border-t border-zinc-900/60 flex flex-col gap-1 items-center justify-center max-w-sm mx-auto">
                      <span>&lambda;<sub>H</sub> = 0.211061140541 m (Standard Wavelength)</span>
                      <span>c = 299,792,458 m/s (Vacuum Light Speed)</span>
                    </div>
                  </div>

                  <p className="leading-relaxed text-zinc-400 mt-2">
                    Executing this relativistic calculation produces our absolute atomic unit:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-center pt-2">
                    <div className="bg-cyan-950/20 border border-cyan-900/40 p-4 rounded-xl text-center flex-1">
                      <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">Exact Duration in Seconds</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-zinc-150 block mt-1">
                        {CHRON_UNIT_S.toFixed(17)} s
                      </span>
                    </div>
                    <div className="bg-cyan-950/20 border border-cyan-900/40 p-4 rounded-xl text-center flex-1">
                      <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">Scientific Notation Base</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-zinc-150 block mt-1">
                        &approx; 7.04014838 &times; 10<sup>-10</sup> seconds
                      </span>
                    </div>
                  </div>
                </div>

                {/* Relativistic Calibration Origin */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-[#fbbf24] font-semibold">
                    Absolute Anchor: Supernova 1987A (SN 1987A)
                  </h3>
                  <p className="leading-relaxed text-zinc-400">
                    To compute elapsed time across centuries, the system adopts a high-energy astrophysical beacon: the **Supernova 1987A event**. 
                    On exactly <span className="text-zinc-105 font-medium">February 23, 1987, at 07:35:41 UTC</span>, the first wavefront of photons and neutrinos from the core-collapse supernova in the Large Magellanic Cloud arrived at planetary sensors.
                  </p>
                  <p className="leading-relaxed text-zinc-400">
                    By defining this unambiguous cosmological shockwave as a universal coordinate synchrony anchor, all system terminals align relative 
                    to the expanding photon front—independent of terrestrial orbital variations.
                  </p>
                </div>

                {/* Practical conversions */}
                <div className="p-4 bg-zinc-900/20 rounded-xl border border-zinc-900 space-y-2">
                  <h4 className="text-xs uppercase font-mono font-bold text-zinc-200">Earth Conversion Reference:</h4>
                  <ul className="space-y-1.5 text-xs font-mono text-zinc-400">
                    <li className="flex justify-between border-b border-zinc-900/60 pb-1">
                      <span>1 Millisecond (ms)</span>
                      <span className="text-zinc-200 font-bold">&approx; 1,420,405.75 cu</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-900/60 pb-1">
                      <span>1 Standard Human Second</span>
                      <span className="text-zinc-200 font-bold">&approx; 1,420,405,751.77 cu</span>
                    </li>
                    <li className="flex justify-between">
                      <span>1 standard Earth Day (86,400s)</span>
                      <span className="text-zinc-200 font-bold">&approx; 122,723,056,952,787.20 cu</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'hierarchy' && (
              <motion.div
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Positional notation logic */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
                    The Metric Positional Division
                  </h3>
                  <p className="leading-relaxed text-zinc-400">
                    Rather than combining arbitrary divisions like minutes (60s), hours (60m), and days (24h), the cosmic clock operates on a 
                    <span className="text-zinc-100 font-normal"> pure scale of 100</span>. 
                    Positional parameters cascade neatly from micro-period frequencies to interstellar cycles using standard decimal offsets.
                  </p>
                </div>

                {/* Hierarchy Comparison Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-850/65 shadow-md bg-zinc-950">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-900/80 text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider border-b border-zinc-800">
                        <th className="py-2.5 px-3">Positional Segment</th>
                        <th className="py-2.5 px-3 text-right">CU Multiplier</th>
                        <th className="py-2.5 px-3 text-right">Observer Duration</th>
                        <th className="py-2.5 px-4 text-right">Light Wave Distance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50 text-zinc-300">
                      <tr>
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          Chron-Unit (cu)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>0</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-[#22d3ee] font-bold">0.704 ns</td>
                        <td className="py-2.5 px-4 text-right text-zinc-400">0.211 meters (1 λ)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          Canto-Chron (Ca)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>2</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-zinc-200">70.40 ns</td>
                        <td className="py-2.5 px-4 text-right text-zinc-400">21.1 meters</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          Myria-Chron (My)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>4</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-zinc-200">7.04 &mu;s</td>
                        <td className="py-2.5 px-4 text-right text-zinc-400">2.11 kilometers</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          Mega-Chron (Me)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>6</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-zinc-200">704.01 &mu;s</td>
                        <td className="py-2.5 px-4 text-right text-zinc-400">211.06 kilometers</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          Giga-Chron (Gi)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>8</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-zinc-200">70.40 ms</td>
                        <td className="py-2.5 px-4 text-right text-zinc-400">21,106.11 kilometers</td>
                      </tr>
                      <tr className="bg-cyan-500/[0.015]">
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          Epoch-Chron (E)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>10</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-amber-400 font-bold">7.04 seconds</td>
                        <td className="py-2.5 px-4 text-right text-zinc-300">2,110,611 km (5.5x Moon)</td>
                      </tr>
                      <tr className="bg-emerald-500/[0.015]">
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Cosmic Session (Se)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>12</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">11.73 minutes</td>
                        <td className="py-2.5 px-4 text-right text-zinc-300">1.41 Astronomical Units (AU)</td>
                      </tr>
                      <tr className="bg-cyan-500/[0.02]">
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-cyan-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.5)]"></span>
                          Cosmic Shift (S)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>14</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">19.56 hours</td>
                        <td className="py-2.5 px-4 text-right text-zinc-200">141.0 Astronomical Units (AU)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                          Centum Month (C)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>16</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-zinc-200">81.48 days</td>
                        <td className="py-2.5 px-4 text-right text-zinc-405">~0.223 Light Year</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-zinc-102">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                          Cosmic Vector (V)
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-500">10<sup>17</sup> cu</td>
                        <td className="py-2.5 px-3 text-right text-zinc-250 font-semibold">2.23 Years</td>
                        <td className="py-2.5 px-4 text-right text-zinc-405">~2.23 Light Years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Practical Example */}
                <div className="text-zinc-450 text-[11px] leading-relaxed font-mono flex items-start gap-2 pt-2">
                  <span className="text-cyan-400 text-xs mt-0.5">&bull;</span>
                  <span>
                    When reading a timestamp in complete space coordinates like <span className="text-zinc-105 font-bold">V12.C3.S04.Se56 : E12.Gi89</span>, 
                    you are looking at a chronological location resolved with nanosecond-level accuracy, readable simply as a continuous integer value in high-precision base systems.
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-zinc-950 text-right border-t border-zinc-900 shrink-0">
            <button
              onClick={onClose}
              className="text-xs uppercase font-mono font-bold tracking-wider px-5 py-2.5 bg-cyan-950/30 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900/30 hover:border-cyan-500/70 transition-all rounded-xl"
              id="doc-modal-bottom-close-btn"
            >
              System Read Completed &bull; Close Page
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
