/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Link2, Settings, ArrowRight, Zap, RefreshCw, Calendar, Volume2, VolumeX } from 'lucide-react';
import { CalibrationAnchor, CosmicTimeDecomposition } from '../types.ts';
import { 
  decomposeChronUnits, 
  msToChronUnits, 
  RECENT_CALIBRATIONS, 
  COSMIC_STEP_M, 
  CHRON_UNIT_S,
  MS_IN_CHRON_UNITS,
  cosmicSessionsToSeconds,
  cosmicShiftsToSeconds,
  OFFSET_CU,
  SN1987A_TIMESTAMP
} from '../utils.ts';
import { motion, AnimatePresence } from 'motion/react';

const SYSTEM_LAUNCH_TIMESTAMP = 1780012800000; // May 29, 2026 00:00 UTC

interface OdometerClockProps {
  accumulatedCu: number;
  setAccumulatedCu: React.Dispatch<React.SetStateAction<number>>;
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export default function OdometerClock({
  accumulatedCu,
  setAccumulatedCu,
  speedMultiplier,
  setSpeedMultiplier,
  isPaused,
  setIsPaused
}: OdometerClockProps) {
  const [activeAnchor, setActiveAnchor] = useState<CalibrationAnchor>({
    id: 'supernova-1987a',
    name: 'Supernova 1987A Baseline',
    description: 'Primary astrophysical anchor mapped to the SN 1987A core collapse event.',
    timestamp: SN1987A_TIMESTAMP, // Feb 23, 1987, 07:35:41 UTC
    isFixed: true,
  });

  const [calibrations, setCalibrations] = useState<CalibrationAnchor[]>([
    {
      id: 'system-activation',
      name: 'System Launch Anchor',
      description: 'Tracks continuous light-speed propagation starting from May 29, 2026 00:00 UTC.',
      timestamp: SYSTEM_LAUNCH_TIMESTAMP,
      isFixed: true,
    },
    ...RECENT_CALIBRATIONS
  ]);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [copied, setCopied] = useState(false);

  // Animation frame reference
  const lastTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize accumulators
  useEffect(() => {
    lastTimeRef.current = Date.now();
  }, []);

  // Simple clean tick synth sound to mark Cosmic Moments when active
  const playClickSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio permission limits in browser frames
    }
  };

  // Tracking the values of Canto and Epoch for subtle tick auditory response
  const lastCantoVal = useRef<number>(0);

  // Physics flow integration loop (variable speed clock)
  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!isPaused) {
        // Delta CU based on actual elapsed physical MS and current relative rate multiplier
        const deltaCu = deltaMs * MS_IN_CHRON_UNITS * speedMultiplier;
        setAccumulatedCu(prev => {
          const next = prev + deltaCu;
          
          // Audio feedback on major units rollover
          const prevDecomp = decomposeChronUnits(prev);
          const nextDecomp = decomposeChronUnits(next);
          if (nextDecomp.canto !== prevDecomp.canto) {
            // Tick sound (moderate pitch) for Canto-Chron unit rollovers
            playClickSound(1200, 0.05);
          }
          if (nextDecomp.mega !== prevDecomp.mega) {
            // Deeper resonant gong for Mega-Chron ticks
            playClickSound(440, 0.25);
          }
          return next;
        });
      }
      requestRef.current = requestAnimationFrame(updateTime);
    };

    lastTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPaused, speedMultiplier, soundEnabled]);

  const decomposed = decomposeChronUnits(accumulatedCu);

  // Format 2-digit pad
  const formatPad = (num: number) => {
    return Math.floor(num).toString().padStart(2, '0');
  };

  const odometerString = `${decomposed.vector}.${decomposed.centum}.${formatPad(decomposed.shift)}.${formatPad(decomposed.totalSessions % 100)} : ${formatPad(decomposed.epoch)}.${formatPad(decomposed.giga)}.${formatPad(decomposed.mega)}.${formatPad(decomposed.myria)}.${formatPad(decomposed.canto)}.${formatPad(decomposed.chronUnit)}`;

  const copyOdometerString = () => {
    navigator.clipboard.writeText(odometerString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAnchor = (anchor: CalibrationAnchor) => {
    setActiveAnchor(anchor);
    // Align current continuous CU to match anchor delta accurately
    if (anchor.id === 'system-activation') {
      const elapsedMsSinceLaunch = Date.now() - SYSTEM_LAUNCH_TIMESTAMP;
      setAccumulatedCu(msToChronUnits(elapsedMsSinceLaunch > 0 ? elapsedMsSinceLaunch : 0));
    } else {
      const elapsedMsSince1987 = Date.now() - SN1987A_TIMESTAMP;
      setAccumulatedCu(OFFSET_CU + msToChronUnits(elapsedMsSince1987));
    }
    lastTimeRef.current = Date.now();
  };

  const handleAddCustomAnchor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDate || !customName) return;
    const targetMs = new Date(customDate).getTime();
    if (isNaN(targetMs)) return;

    const newAnchor: CalibrationAnchor = {
      id: `custom-${Date.now()}`,
      name: customName,
      description: 'User configured astrophysical sync coordinate.',
      timestamp: targetMs,
      isFixed: false,
    };

    setCalibrations(prev => [newAnchor, ...prev]);
    setActiveAnchor(newAnchor);
    const elapsedMsSince1987 = Date.now() - SN1987A_TIMESTAMP;
    setAccumulatedCu(OFFSET_CU + msToChronUnits(elapsedMsSince1987));
    setCustomDate('');
    setCustomName('');
    setShowCustomConfig(false);
  };

  const handleResetActivation = () => {
    // Reset launch anchor to its fixed global timestamp
    const updatedCalibrations = calibrations.map(c => {
      if (c.id === 'system-activation') {
        return { ...c, timestamp: SYSTEM_LAUNCH_TIMESTAMP };
      }
      return c;
    });
    setCalibrations(updatedCalibrations);
    
    const activeSysLaunch = updatedCalibrations.find(c => c.id === 'system-activation')!;
    setActiveAnchor(activeSysLaunch);
    const elapsedMsSinceLaunch = Date.now() - SYSTEM_LAUNCH_TIMESTAMP;
    setAccumulatedCu(msToChronUnits(elapsedMsSinceLaunch > 0 ? elapsedMsSinceLaunch : 0));
    lastTimeRef.current = Date.now();
  };

  // Multiplier selections
  const presetSpeeds = [
    { label: '0.1x (Slow-Mo)', value: 0.1 },
    { label: '1x (Physical Light Speed)', value: 1 },
    { label: '10x', value: 10 },
    { label: '100x', value: 100 },
    { label: '10,000x', value: 10000 },
    { label: '1,000,000x (Warp Cosmic Sessions)', value: 1000000 },
  ];

  return (
    <div className="flex flex-col gap-8 w-full" id="chron-engine-dock">
      {/* Central Interactive Odometer Section */}
      <div className="w-full flex flex-col justify-between hardware-border bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-5 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                <span className="text-xs font-semibold tracking-widest text-[#22d3ee] uppercase font-mono">
                  Engine active &bull; Vacuum Propagation
                </span>
              </div>
              <h1 className="text-2xl font-light tracking-tight text-zinc-100 mt-1 uppercase">
                Cosmic Time Matrix
              </h1>
            </div>

            {/* Micro Audio Feedback and Utility buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg border transition-all ${
                  soundEnabled 
                    ? 'bg-cyan-950/50 border-cyan-700/60 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-350 hover:bg-zinc-800'
                }`}
                title={soundEnabled ? 'Disable sonic pulse cues' : 'Enable sonic pulse cues'}
                id="btn-sonic-pulse"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={copyOdometerString}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/85 hover:bg-zinc-800 text-xs font-mono font-medium text-zinc-350 transition-colors"
                title="Copy physical odometer coordinates string"
                id="btn-copy-coordinate"
              >
                <Link2 size={13} />
                {copied ? 'Copied' : odometerString}
              </button>
            </div>
          </div>

          {/* PHYSICAL BASE-100 ODOMETER */}
          <div className="radial-gradient-bg hardware-border rounded-xl p-5 sm:p-7 shadow-2xl relative overflow-hidden my-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-550 via-cyan-400 to-indigo-700"></div>
            
            {/* Odometer Glass-reflection effect */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
              {/* Digital numerical block - Col span 12 */}
              <div className="lg:col-span-12 flex flex-col justify-between w-full h-full">
                {/* Base-100 Cosmic Calendar Header */}
                <div className="mb-4 pb-3 border-b border-zinc-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
                  <div className="w-full sm:w-auto">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                      Macro Base-100 Cosmic Calendar
                    </span>
                    <span className="text-xs text-zinc-400 font-light mt-0.5 block">
                      All Chronological units listed in tabular sequence above the 10&times;10 shift grid
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Grid Layout: Cosmic Unit Table and Shift Calendar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full mt-2">
                  {/* Cosmic Coordinate Matrix Table Column */}
                  <div className="overflow-hidden rounded-xl border border-zinc-850/60 bg-zinc-950/45 shadow-lg h-full flex flex-col justify-between">
                    <table className="w-full text-left font-mono border-collapse h-full">
                      <thead>
                        <tr className="border-b border-zinc-900/80 bg-zinc-950/90 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          <th className="py-2 px-4">Cosmic Dimension Unit</th>
                          <th className="py-2 px-4 text-right">Coordinate Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/40 text-xs text-zinc-300">
                        <tr className="hover:bg-zinc-900/25 transition-colors">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.5)]"></span>
                            <span className="font-semibold text-zinc-100">Vector (V)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Planetary Year Cycle</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-zinc-100 text-sm">
                            {decomposed.vector}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            <span className="font-semibold text-zinc-100">Centum (C)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Solar Month Decant</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-zinc-150 text-sm">
                            {decomposed.centum}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors bg-cyan-500/[0.02]">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            <span className="font-semibold text-zinc-150">Shift (S)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Diurnal Shift Coordinate</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-cyan-400 text-sm glow-cyan-sm">
                            {formatPad(decomposed.shift)}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="font-semibold text-zinc-100">Session (Se)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Relational Event Interval</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-emerald-400 text-sm shadow-sm">
                            {formatPad(decomposed.totalSessions % 100)}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="font-semibold text-zinc-100">Epoch (E)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Major Chronological Block</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-zinc-100 text-sm">
                            {formatPad(decomposed.epoch)}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                            <span className="font-semibold text-zinc-100">Giga (Gi)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; 100-Epoch Megablock</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-zinc-200 text-sm">
                            {formatPad(decomposed.giga)}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors bg-[#fbbf24]/[0.01]">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span className="font-semibold text-zinc-100">Mega (Me)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; 10,000-Epoch Hyperblock</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-zinc-200 text-sm">
                            {formatPad(decomposed.mega)}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                            <span className="font-semibold text-zinc-100">Myria (My)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Decamillennial Progression</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-zinc-300 text-sm">
                            {formatPad(decomposed.myria)}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                            <span className="font-semibold text-zinc-100">Canto (Ca)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Micro-period Beat</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-cyan-400 text-sm glow-cyan-sm">
                            {formatPad(decomposed.canto)}
                          </td>
                        </tr>
                        <tr className="hover:bg-zinc-900/25 transition-colors bg-amber-500/[0.02]">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            <span className="font-semibold text-zinc-100">Chron (cu)</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden sm:inline">&bull; Base Light-travel Time Coordinate</span>
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-amber-400 text-sm glow-cyan-sm">
                            {formatPad(decomposed.chronUnit)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 10x10 Traditional Calendar Month Matrix Column */}
                  <div className="p-3 sm:p-4 bg-zinc-950/70 rounded-xl border border-zinc-850/60 w-full relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2.5 px-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-cyan-400" />
                        <span className="text-[9.5px] font-mono uppercase tracking-[0.15em] text-zinc-100 font-semibold block">
                          Centum {decomposed.centum} Month grid
                        </span>
                      </div>
                      <span className="text-[9.5px] font-mono text-zinc-550 block">
                        Vector V{decomposed.vector} &bull; Cyclic Shift 00-99
                      </span>
                    </div>

                    <div className="grid grid-cols-11 gap-1 text-center font-mono">
                      {/* Corner header */}
                      <div className="text-[8px] font-bold text-zinc-650 flex items-center justify-center uppercase pb-1 border-b border-zinc-900/80">
                        Row
                      </div>
                      {/* Column Headers 0-9 */}
                      {Array.from({ length: 10 }).map((_, colIdx) => (
                        <div key={`col-hdr-${colIdx}`} className="text-[8px] sm:text-[9.5px] font-black text-cyan-400/80 pb-1 border-b border-zinc-900/80 flex items-center justify-center">
                          +{colIdx}
                        </div>
                      ))}

                      {/* 10 Rows of Shifts */}
                      {Array.from({ length: 10 }).map((_, rowIdx) => {
                        const baseShift = rowIdx * 10;
                        return (
                          <React.Fragment key={`row-${rowIdx}`}>
                            {/* Left Row Header indicates tens position (00, 10, 20... 90) */}
                            <div className="text-[8px] sm:text-[9.5px] font-bold text-zinc-500/85 flex items-center justify-center border-r border-zinc-900 pr-1 py-[1.5px]">
                              {rowIdx}0
                            </div>
                            {/* 10 cells representing individual shifts in centum month */}
                            {Array.from({ length: 10 }).map((_, colIdx) => {
                              const shiftVal = baseShift + colIdx;
                              const isCurrent = shiftVal === decomposed.shift;
                              const isPast = shiftVal < decomposed.shift;
                              return (
                                <div
                                  key={`shift-${shiftVal}`}
                                  className={`aspect-square flex flex-col items-center justify-center rounded-md border text-[8px] sm:text-[10px] font-semibold transition-all relative ${
                                    isCurrent
                                      ? 'bg-gradient-to-tr from-cyan-500/90 to-[#22d3ee] text-zinc-950 font-extrabold border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)] scale-105 z-10'
                                      : isPast
                                        ? 'bg-zinc-900/25 border-zinc-900 text-zinc-550 hover:bg-zinc-900 hover:text-zinc-350 cursor-pointer'
                                        : 'bg-zinc-950/15 border-zinc-900/40 text-zinc-700/80 hover:bg-zinc-900/40 hover:text-zinc-450 cursor-pointer'
                                  }`}
                                  title={`Shift ${formatPad(shiftVal)} of Centum ${decomposed.centum}`}
                                >
                                  <span>{formatPad(shiftVal)}</span>
                                  {isCurrent && (
                                    <span className="absolute bottom-0.5 w-1 h-1 bg-zinc-950 rounded-full animate-ping"></span>
                                  )}
                                </div>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Play/Pause/Reset Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-md ${
                  isPaused 
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold' 
                    : 'bg-zinc-800 hover:bg-zinc-750 text-[#f4f4f5] border border-zinc-750'
                }`}
                title={isPaused ? 'Resume live light-speed flow' : 'Pause time stream propagation'}
                id="btn-play-pause"
              >
                {isPaused ? (
                  <>
                    <Play size={16} fill="currentColor" />
                    <span>Propagate Stream</span>
                  </>
                ) : (
                  <>
                    <Pause size={16} fill="currentColor" />
                    <span>Freeze Propagation</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleResetActivation}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-900 text-sm font-medium text-zinc-400 transition-colors"
                title="Reset continuous odometer to 0 relative to right now"
                id="btn-reset-odometer"
              >
                <RotateCcw size={15} />
                <span>Zero Stream</span>
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase tracking-wider">
                Relative Accumulation
              </span>
              <span className="text-sm font-mono font-bold text-cyan-400 block glow-cyan-sm mt-1">
                {Math.floor(accumulatedCu).toLocaleString()} cu
              </span>
            </div>
          </div>
        </div>

        {/* Informational Calibration Sync Box */}
        <div className="bg-zinc-900/20 border border-zinc-900/65 rounded-xl p-4 sm:p-5 mt-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-950/40 border border-cyan-900/30 text-cyan-400 rounded-lg mt-0.5">
              <Calendar size={16} />
            </div>
            <div>
              <h4 className="text-sm font-light text-zinc-100">
                Current Anchor Alignment: <span className="text-cyan-400 font-mono font-bold text-xs">{activeAnchor.name}</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-light">
                {activeAnchor.description} Physical origin date: <span className="font-mono text-zinc-300 font-medium">{new Date(activeAnchor.timestamp).toUTCString()}</span>.
              </p>
              <div className="flex flex-wrap items-center mt-3 gap-y-2 gap-x-4">
                <div className="text-xs text-zinc-500">
                  <strong className="text-cyan-400/85">1 Session:</strong> &approx; 11.733 min ({decomposed.totalSessions.toLocaleString()} elapsed)
                </div>
                <div className="text-xs text-zinc-500">
                  <strong className="text-cyan-400/85">1 Shift:</strong> &approx; 19.556 hours ({decomposed.totalShifts.toLocaleString()} elapsed)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Station & Anchor Configuration (Bottom panels) */}
      <div className="flex flex-col gap-8 w-full" id="chron-anchors-config">
        {/* Speed flow regulator */}
        <div className="hardware-border bg-zinc-950/70 p-6 rounded-2xl relative shadow-2xl w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-zinc-200 font-mono flex items-center gap-1.5">
                <Zap size={14} className="text-cyan-400" /> Time-Flow Regulator
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-4xl font-light">
                Adjust the velocity of cosmic propagation. Multipliers offset sub-unit accumulation intervals relative to human observer scales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full animate-fade-in">
            {presetSpeeds.map(preset => (
              <button
                key={preset.value}
                onClick={() => setSpeedMultiplier(preset.value)}
                className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                  speedMultiplier === preset.value
                    ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 font-bold shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                }`}
                id={`btn-speed-${preset.value}`}
              >
                <span>{preset.label}</span>
                {speedMultiplier === preset.value && (
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_#22d3ee]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Anchors and Calibrations panel */}
        <div className="hardware-border bg-zinc-950/70 p-6 rounded-2xl relative shadow-2xl w-full">
          <div className="flex justify-between items-center mb-2 border-b border-zinc-900 pb-3">
            <div>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-zinc-200 font-mono flex items-center gap-1.5">
                <RefreshCw size={14} className="text-cyan-400 animate-spin-slow" /> Sync Anchors
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-4xl font-light">
                Coordinate standard cosmic clocks onto Earth historical epochs or precise planetary astronomical moments.
              </p>
            </div>
            
            <button
              onClick={() => setShowCustomConfig(!showCustomConfig)}
              className="text-xs bg-cyan-950/60 border border-cyan-800/45 text-cyan-400 px-3 py-1.5 rounded-xl font-bold hover:bg-cyan-900/60 hover:text-cyan-300 transition-colors shadow-sm whitespace-nowrap"
              id="btn-toggle-custom-align"
            >
              {showCustomConfig ? 'Cancel' : '+ Custom'}
            </button>
          </div>

          {showCustomConfig ? (
            <form onSubmit={handleAddCustomAnchor} className="bg-zinc-900/60 border border-zinc-805/80 p-4 rounded-xl space-y-3 mb-4 max-w-xl">
              <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase">
                Calibrate Coordinate Zero
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">
                    Anchor Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JWST First Deep Field"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/80 text-zinc-105"
                    id="inp-custom-anchor-name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">
                    Solar Event Timestamp
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={customDate}
                    onChange={e => setCustomDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/80 text-zinc-105 font-mono"
                    id="inp-custom-anchor-time"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                id="btn-submit-custom-anchor"
              >
                Sync Custom Zero Anchor
              </button>
            </form>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
            {calibrations.map(anchor => {
              const isActive = activeAnchor.id === anchor.id;
              return (
                <div
                  key={anchor.id}
                  onClick={() => handleSelectAnchor(anchor)}
                  className={`border rounded-xl p-3 cursor-pointer text-left transition-all ${
                    isActive 
                      ? 'bg-zinc-900/80 border-cyan-500/45 text-white shadow-[0_0_15px_rgba(34,211,238,0.05)]' 
                      : 'border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/30 hover:border-zinc-850 text-zinc-400'
                  }`}
                  id={`btn-anchor-${anchor.id}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs block">{anchor.name}</span>
                    {isActive && (
                      <span className="text-[10px] bg-cyan-950 border border-cyan-500 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                        Sync
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] mb-1.5 leading-tight font-light ${isActive ? 'text-zinc-350' : 'text-zinc-505'}`}>
                    {anchor.description}
                  </p>
                  <span className="font-mono text-[9px] block text-zinc-650">
                    {anchor.timestamp === 0 
                      ? '1970-01-01 00:00:00 UTC' 
                      : new Date(anchor.timestamp).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
