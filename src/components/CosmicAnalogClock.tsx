/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CosmicTimeDecomposition } from '../types.ts';

interface CosmicAnalogClockProps {
  accumulatedCu: number;
  decomposed: CosmicTimeDecomposition;
}

export default function CosmicAnalogClock({
  accumulatedCu,
  decomposed,
}: CosmicAnalogClockProps) {
  
  const formatPad = (num: number) => {
    return Math.floor(num).toString().padStart(2, '0');
  };

  const sessionInShift = (decomposed.totalSessions % 100) + (decomposed.epoch / 100) + (decomposed.giga / 10000) + (decomposed.mega / 1000000);
  const sessionAngle = (sessionInShift / 100) * 360;

  const epochInSession = decomposed.epoch + (decomposed.giga / 100) + (decomposed.mega / 10000) + (decomposed.myria / 1000000);
  const epochAngle = (epochInSession / 100) * 360;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Deep background pulsing space glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-550/15 via-transparent to-amber-550/15 rounded-full blur-3xl opacity-80 animate-pulse"></div>
        {/* Outer orbital ring decorative alignment */}
        <div className="absolute -inset-2 rounded-full border border-zinc-800/45 pointer-events-none"></div>
        <div className="absolute -inset-3.5 rounded-full border border-dashed border-zinc-900/30 pointer-events-none"></div>

        <svg 
          viewBox="0 0 200 200" 
          className="w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] relative z-10 select-none drop-shadow-[0_0_35px_rgba(34,211,238,0.06)]" 
          id="lightspeed-analog-dial-hero"
        >
          {/* Clock glass backplate */}
          <circle cx="100" cy="100" r="94" fill="#040405" stroke="#1d1d22" strokeWidth="1.75" />
          <circle cx="100" cy="100" r="94" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="4" />

          {/* Faint guide rings for Sweep pathways */}
          <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(34,211,238,0.04)" strokeWidth="0.75" strokeDasharray="1,4" />
          <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(245,158,11,0.04)" strokeWidth="0.75" strokeDasharray="1,3" />

          {/* Ticks around dial (100 divisions) */}
          {(() => {
            const ticks = [];
            for (let i = 0; i < 100; i++) {
              const isMajor = i % 10 === 0;
              const isMedium = i % 5 === 0 && !isMajor;
              const angleRad = (i * 3.6 * Math.PI) / 180;
              const rStart = isMajor ? 80 : (isMedium ? 83 : 86);
              const rEnd = 91;
              const x1 = 100 + rStart * Math.sin(angleRad);
              const y1 = 100 - rStart * Math.cos(angleRad);
              const x2 = 100 + rEnd * Math.sin(angleRad);
              const y2 = 100 - rEnd * Math.cos(angleRad);
              
              let strokeColor = 'rgba(63, 63, 70, 0.4)';
              if (isMajor) {
                strokeColor = 'rgba(34, 211, 238, 0.75)';
              } else if (isMedium) {
                strokeColor = 'rgba(113, 113, 122, 0.55)';
              }

              ticks.push(
                <line
                  key={`tick-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth={isMajor ? 1.75 : (isMedium ? 1.25 : 0.75)}
                />
              );
            }
            return ticks;
          })()}

          {/* Number Labels (00, 10, 20, ... 90) */}
          {(() => {
            const labels = [];
            for (let i = 0; i < 10; i++) {
              const angleRad = (i * 36 * Math.PI) / 180;
              const rLabel = 68;
              const x = 100 + rLabel * Math.sin(angleRad);
              const y = 100 - rLabel * Math.cos(angleRad);
              const val = i * 10;
              labels.push(
                <text
                  key={`label-${i}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`font-mono text-[9px] font-bold select-none ${val === 0 ? 'fill-cyan-400 font-extrabold text-[9.5px]' : 'fill-zinc-500'}`}
                >
                  {val}
                </text>
              );
            }
            return labels;
          })()}

          {/* Central status identifiers without custom letters */}
          <text x="100" y="134" textAnchor="middle" className="font-mono text-[7px] font-bold uppercase tracking-[0.25em] fill-zinc-600 select-none">
            COSMIC TIME
          </text>
          <text x="100" y="146" textAnchor="middle" className="font-mono text-[9.5px] font-bold fill-cyan-400 select-none">
            {formatPad(decomposed.totalSessions % 100)}
          </text>
          <text x="100" y="156" textAnchor="middle" className="font-mono text-[9.5px] font-bold fill-amber-500 select-none">
            {formatPad(decomposed.epoch)}
          </text>

          {/* Session hand (Slower, Cyan) */}
          <g transform={`rotate(${sessionAngle}, 100, 100)`}>
            {/* Outer high-blur glow line */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="28" 
              stroke="#22d3ee" 
              strokeWidth="6" 
              strokeLinecap="round" 
              opacity="0.2"
            />
            {/* Soft medium glow line */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="28" 
              stroke="#22d3ee" 
              strokeWidth="4.2" 
              strokeLinecap="round" 
              opacity="0.45"
            />
            {/* Solid cyan body */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="28" 
              stroke="#22d3ee" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            {/* High-contrast core line */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="28" 
              stroke="#ffffff" 
              strokeWidth="1" 
              strokeLinecap="round" 
              opacity="0.9"
            />
            {/* Dot on the session hand tip */}
            <circle cx="100" cy="28" r="3" fill="#22d3ee" stroke="#ffffff" strokeWidth="0.5" />
          </g>

          {/* Epoch hand (Faster, Amber) */}
          <g transform={`rotate(${epochAngle}, 100, 100)`}>
            {/* Outer soft glow stroke */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="12" 
              stroke="#fbbf24" 
              strokeWidth="5" 
              strokeLinecap="round" 
              opacity="0.2"
            />
            {/* Soft secondary bloom */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="12" 
              stroke="#fbbf24" 
              strokeWidth="3.2" 
              strokeLinecap="round" 
              opacity="0.45"
            />
            {/* Solid amber body */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="12" 
              stroke="#fbbf24" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
            />
            {/* High-contrast core line */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="12" 
              stroke="#ffffff" 
              strokeWidth="0.75" 
              strokeLinecap="round" 
              opacity="0.9"
            />
            {/* Dot on the epoch hand tip */}
            <circle cx="100" cy="12" r="2" fill="#fbbf24" stroke="#ffffff" strokeWidth="0.5" />
          </g>

          {/* Nuclear Center Pin assembly */}
          <circle cx="100" cy="100" r="6" fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.75" />
          <circle cx="100" cy="100" r="3" fill="#09090b" />
          <circle cx="100" cy="100" r="1.5" fill="#22d3ee" />
        </svg>
      </div>

      {/* Legend identifiers */}
      <div className="flex gap-4 mt-3.5 text-[10px] font-mono justify-center relative z-20">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.6)]"></span>
          <span className="text-zinc-400 font-bold uppercase tracking-wider">Session Hand</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-amber-500 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.6)]"></span>
          <span className="text-zinc-400 font-bold uppercase tracking-wider">Epoch Hand</span>
        </div>
      </div>
    </div>
  );
}
