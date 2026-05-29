/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, HelpCircle, Lightbulb, Play, Pause, RefreshCw } from 'lucide-react';
import { 
  COSMIC_STEP_M, 
  CHRON_UNIT_S, 
  SPEED_OF_LIGHT_M_S, 
  decomposeChronUnits 
} from '../utils.ts';

export default function PlaygroundConverter() {
  const [activeTab, setActiveTab] = useState<'e2c' | 'c2e'>('e2c');
  
  // Earth to Cosmic Form
  const [earthDays, setEarthDays] = useState('0');
  const [earthHours, setEarthHours] = useState('0');
  const [earthMinutes, setEarthMinutes] = useState('11');
  const [earthSeconds, setEarthSeconds] = useState('44');
  
  // Cosmic to Earth Form
  const [cosmicSessionsInput, setCosmicSessionsInput] = useState('1');
  const [cosmicEpochsInput, setCosmicEpochsInput] = useState('0');
  const [cosmicGigasInput, setCosmicGigasInput] = useState('0');
  const [cosmicMegasInput, setCosmicMegasInput] = useState('0');

  // Outputs
  const [conversionResult, setConversionResult] = useState('');
  const [toEarthResult, setToEarthResult] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0
  });

  // Photon simulation states
  const [simDistanceSteps, setSimDistanceSteps] = useState(10);
  const [simActive, setSimActive] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);

  // Recalculate Earth to Cosmic
  useEffect(() => {
    const days = parseFloat(earthDays) || 0;
    const hours = parseFloat(earthHours) || 0;
    const mins = parseFloat(earthMinutes) || 0;
    const secs = parseFloat(earthSeconds) || 0;

    const totalSeconds = (days * 86400) + (hours * 3600) + (mins * 60) + secs;
    const totalCu = totalSeconds / CHRON_UNIT_S;

    const decomp = decomposeChronUnits(totalCu);
    
    const pad = (v: number) => Math.floor(v).toString().padStart(2, '0');
    const formatted = `${pad(decomp.epoch)}.${pad(decomp.giga)}.${pad(decomp.mega)}.${pad(decomp.myria)}.${pad(decomp.canto)}.${pad(decomp.chronUnit)}`;
    
    setConversionResult(formatted);
  }, [earthDays, earthHours, earthMinutes, earthSeconds]);

  // Recalculate Cosmic to Earth
  useEffect(() => {
    const sessions = parseFloat(cosmicSessionsInput) || 0;
    const epochs = parseFloat(cosmicEpochsInput) || 0;
    const gigas = parseFloat(cosmicGigasInput) || 0;
    const megas = parseFloat(cosmicMegasInput) || 0;

    // Convert everything to single base: Chron-Unit
    // 1 Session = 10^12 cu
    // 1 Epoch = 10^10 cu
    // 1 Giga  = 10^8 cu
    // 1 Mega  = 10^6 cu
    const totalCuInput = (sessions * 1e12) + (epochs * 1e10) + (gigas * 1e8) + (megas * 1e6);
    const calculatedSecs = totalCuInput * CHRON_UNIT_S;

    setToEarthResult({
      seconds: calculatedSecs % 60,
      minutes: Math.floor(calculatedSecs / 60) % 60,
      hours: Math.floor(calculatedSecs / 3600) % 24,
      days: Math.floor(calculatedSecs / 86400)
    });
  }, [cosmicSessionsInput, cosmicEpochsInput, cosmicGigasInput, cosmicMegasInput]);

  // Photon travel simulation tick
  useEffect(() => {
    let intervalId: any;
    if (simActive) {
      const stepInterval = 40; // 40ms simulation ticks
      const totalEstimatedTravelTimeS = (simDistanceSteps * COSMIC_STEP_M) / SPEED_OF_LIGHT_M_S;
      // Scale visual rate: we make the simulation slow enough to be visually interesting
      // Travel speed is 50% relative visual scale per second
      intervalId = setInterval(() => {
        setSimProgress(prev => {
          const next = prev + 3;
          if (next >= 100) {
            setSimActive(false);
            setSimCompleted(true);
            return 100;
          }
          return next;
        });
      }, stepInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [simActive, simDistanceSteps]);

  const handleStartSim = () => {
    setSimProgress(0);
    setSimCompleted(false);
    setSimActive(true);
  };

  const handleResetSim = () => {
    setSimProgress(0);
    setSimCompleted(false);
    setSimActive(false);
  };

  // Convert distance metrics for simulation
  const simDistanceMeters = simDistanceSteps * COSMIC_STEP_M;
  const simTravelTimeCu = simDistanceSteps; // since 1 Step travel = 1 cu
  const simTravelTimeNs = simTravelTimeCu * (CHRON_UNIT_S * 1e9);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="playground-converter-dock">
      {/* Mathematical Converter */}
      <div className="hardware-border bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <h3 className="text-base font-light text-zinc-100 uppercase tracking-tight mb-2 flex items-center gap-2">
          <ArrowLeftRight size={18} className="text-cyan-400" />
          Astrophysical Time Converter
        </h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed font-light">
          Convert standard Earth units (based on planetary axial rotation and solar orbits) into pure base-100 universal light-speed scale representations and back.
        </p>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-900 mb-5">
          <button
            onClick={() => setActiveTab('e2c')}
            className={`pb-2.5 px-4 text-xs font-medium uppercase font-mono tracking-wider transition-colors relative ${
              activeTab === 'e2c' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-350'
            }`}
            id="tab-e2c"
          >
            Earth &rarr; Cosmic Time
            {activeTab === 'e2c' && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('c2e')}
            className={`pb-2.5 px-4 text-xs font-medium uppercase font-mono tracking-wider transition-colors relative ${
              activeTab === 'c2e' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-350'
            }`}
            id="tab-c2e"
          >
            Cosmic &rarr; Earth Time
            {activeTab === 'c2e' && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            )}
          </button>
        </div>

        {/* Conversions Forms */}
        {activeTab === 'e2c' ? (
          <div className="space-y-4" id="form-e2c">
            <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
              1. Input Standard Duration
            </h4>
            
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Days</label>
                <input
                  type="number"
                  min="0"
                  value={earthDays}
                  onChange={e => setEarthDays(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2.5 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-550/80 text-zinc-100"
                  id="inp-days"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={earthHours}
                  onChange={e => setEarthHours(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2.5 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-550/80 text-zinc-100"
                  id="inp-hours"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={earthMinutes}
                  onChange={e => setEarthMinutes(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2.5 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-550/80 text-zinc-100"
                  id="inp-minutes"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={earthSeconds}
                  onChange={e => setEarthSeconds(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2.5 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-550/80 text-zinc-100"
                  id="inp-seconds"
                />
              </div>
            </div>

            <div className="radial-gradient-bg p-4 border border-zinc-800/80 rounded-xl relative overflow-hidden mt-6">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-zinc-500 block mb-1">
                Output Base-100 Time Array
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-[#22d3ee] block glow-cyan">
                {conversionResult}
              </span>
              <span className="text-[10px] text-zinc-650 font-mono block mt-2 text-zinc-500">
                Format: [Epoch] . [Giga] . [Mega] . [Myria] . [Canto] . [cu]
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4" id="form-c2e">
            <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
              1. Input Cosmic Time Vectors
            </h4>

            <div className="grid grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1 font-mono" title="Cosmic Sessions (~11.73 mins)">
                  Sessions
                </label>
                <input
                  type="number"
                  min="0"
                  value={cosmicSessionsInput}
                  onChange={e => setCosmicSessionsInput(Math.max(0, parseFloat(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-550/80"
                  id="inp-c-sessions"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1 font-mono" title="Epochs (~7.04 seconds)">
                  Epochs
                </label>
                <input
                  type="number"
                  min="0"
                  value={cosmicEpochsInput}
                  onChange={e => setCosmicEpochsInput(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-550/80"
                  id="inp-c-epochs"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1 font-mono" title="Giga-Chrons (0.0704 seconds)">
                  Gigas
                </label>
                <input
                  type="number"
                  min="0"
                  value={cosmicGigasInput}
                  onChange={e => setCosmicGigasInput(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-550/80"
                  id="inp-c-gigas"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1 font-mono" title="Mega-Chrons (704 microseconds)">
                  Megas
                </label>
                <input
                  type="number"
                  min="0"
                  value={cosmicMegasInput}
                  onChange={e => setCosmicMegasInput(Math.max(0, parseInt(e.target.value) || 0).toString())}
                  className="w-full text-xs px-2 py-2 font-mono bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-550/80"
                  id="inp-c-megas"
                />
              </div>
            </div>

            {/* Earth Equivalent display */}
            <div className="bg-zinc-900/30 border border-zinc-900/80 p-4 rounded-xl mt-6">
              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-500 block mb-3">
                Converted Earth Equivalent
              </span>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="bg-zinc-950 border border-zinc-850/80 rounded-lg px-2.5 py-1 text-center font-mono">
                  <span className="text-xs font-bold text-zinc-350">{toEarthResult.days}</span>
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-wide">Days</span>
                </div>
                <span className="text-zinc-750 font-bold">:</span>
                <div className="bg-zinc-950 border border-zinc-850/80 rounded-lg px-2.5 py-1 text-center font-mono">
                  <span className="text-xs font-bold text-zinc-350">{toEarthResult.hours.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-wide">Hrs</span>
                </div>
                <span className="text-zinc-750 font-bold">:</span>
                <div className="bg-zinc-950 border border-zinc-850/80 rounded-lg px-2.5 py-1 text-center font-mono">
                  <span className="text-xs font-bold text-zinc-350">{toEarthResult.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-wide">Mins</span>
                </div>
                <span className="text-zinc-750 font-bold">:</span>
                <div className="bg-zinc-950 border border-zinc-850/80 rounded-lg px-2.5 py-1 text-center font-mono font-bold">
                  <span className="text-xs font-bold text-[#22d3ee] glow-cyan-sm">{toEarthResult.seconds.toFixed(4)}</span>
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-wide">Secs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Speed of Light Propagation Laboratory */}
      <div className="hardware-border bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <h3 className="text-base font-light text-zinc-100 uppercase tracking-tight mb-2 flex items-center gap-1.5">
          <Lightbulb size={18} className="text-cyan-400 animate-pulse" />
          Photon Propagation Chamber
        </h3>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-light">
          The baseline definition of our clock is the time light takes to travel **1 Cosmic Step** (exactly **{COSMIC_STEP_M.toFixed(4)} meters**). Simulate a photon transit across clean vacuum grids.
        </p>

        <div className="space-y-4 overflow-hidden">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-zinc-350">Chamber Distance (Cosmic Steps)</span>
              <span className="text-xs font-mono font-bold text-cyan-455 bg-cyan-950/40 border border-cyan-950 rounded px-2 py-0.5 glow-cyan-sm">
                {simDistanceSteps} Steps
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="100"
              value={simDistanceSteps}
              onChange={e => {
                setSimDistanceSteps(parseInt(e.target.value));
                handleResetSim();
              }}
              className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded-lg cursor-pointer"
              id="rng-sim-distance"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs border border-zinc-900 p-3 rounded-xl bg-zinc-950/40">
            <div>
              <span className="text-[9px] uppercase font-mono text-zinc-550 block tracking-wider">Meters Spanned:</span>
              <span className="font-mono font-semibold text-zinc-300">{simDistanceMeters.toFixed(4)} m</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono text-zinc-550 block tracking-wider">Propagation Time (cu):</span>
              <span className="font-mono font-bold text-emerald-400">{simTravelTimeCu.toLocaleString()} cu</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-zinc-900">
              <span className="text-[9px] uppercase font-mono text-zinc-550 block tracking-wider">Standard Earth Seconds:</span>
              <span className="font-mono text-zinc-300">{simTravelTimeNs.toFixed(6)} ns (nanoseconds)</span>
            </div>
          </div>

          {/* Visual Chamber Track */}
          <div className="relative h-12 bg-zinc-950 rounded-xl flex items-center px-4 overflow-hidden border border-zinc-850/80">
            
            {/* Grid markings */}
            <div className="absolute inset-0 flex justify-between px-4 opacity-[0.03] pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-px h-full bg-white"></div>
              ))}
            </div>

            {/* Photon visual node */}
            <div 
              className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee] transition-all duration-75 relative z-10"
              style={{ left: `calc(${simProgress}% - 6px)` }}
            >
              {simActive && (
                <span className="absolute -inset-1.5 rounded-full bg-cyan-400/30 animate-ping"></span>
              )}
            </div>

            {/* Path glow vector */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-cyan-500 to-indigo-500 rounded pointer-events-none"
              style={{ width: `${simProgress}%` }}
            ></div>

            {/* Left and Right mirrors */}
            <div className="absolute left-0 top-0 h-full w-2 bg-zinc-850 border-r border-zinc-800 rounded-l-xl"></div>
            <div className="absolute right-0 top-0 h-full w-2 bg-zinc-850 border-l border-zinc-800 rounded-r-xl"></div>

            {/* Text Overlay */}
            {!simActive && !simCompleted && (
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono tracking-widest text-zinc-600 uppercase select-none">
                Chamber Stable &bull; Ready for transit
              </span>
            )}
            {simActive && (
              <span className="absolute inset-y-0 right-4 flex items-center text-[9px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse select-none">
                Photon traveling...
              </span>
            )}
            {simCompleted && (
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono tracking-widest text-[#22d3ee] uppercase select-none glow-cyan-sm">
                C-Transit complete — {simTravelTimeCu} cu elapsed
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleStartSim}
              disabled={simActive}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex justify-center items-center gap-1 px-3 transition-colors ${
                simActive 
                  ? 'bg-zinc-900 border border-zinc-850 text-zinc-550 cursor-not-allowed' 
                  : 'bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold'
              }`}
              id="btn-trigger-transit"
            >
              <Play size={12} fill="currentColor" />
              <span>Laser Launch ({simDistanceSteps} cu)</span>
            </button>

            <button
              onClick={handleResetSim}
              className="py-2 px-3 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-900 text-zinc-400 rounded-xl text-xs bg-zinc-950 transition-colors"
              id="btn-reset-sim"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
