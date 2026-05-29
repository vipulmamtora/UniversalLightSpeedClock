/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Trash2, ShieldAlert, Sparkles, Plus, CheckCircle2, UserCheck } from 'lucide-react';
import { WORK_SHIFT_PRESETS } from '../utils.ts';
import { SchedulerItem } from '../types.ts';

export default function HabitatScheduler() {
  const [schedule, setSchedule] = useState<SchedulerItem[]>(WORK_SHIFT_PRESETS);
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState(0);
  const [newDuration, setNewDuration] = useState(10);
  const [newCategory, setNewCategory] = useState<'survival' | 'scientific' | 'operational' | 'rest' | 'habitation'>('operational');

  // Add items
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    // Boundary rules: Session index starts at 0, goes to 99
    const startVal = Math.min(Math.max(0, newStart), 99);
    const durationVal = Math.min(Math.max(1, newDuration), 100 - startVal);

    const newItem: SchedulerItem = {
      id: `task-${Date.now()}`,
      title: newTitle,
      sessionStart: startVal,
      durationSessions: durationVal,
      category: newCategory
    };

    setSchedule(prev => [...prev, newItem].sort((a, b) => a.sessionStart - b.sessionStart));
    setNewTitle('');
    setNewStart(Math.min(99, startVal + durationVal));
  };

  const handleDeleteTask = (id: string) => {
    setSchedule(prev => prev.filter(t => t.id !== id));
  };

  const handleResetPresets = () => {
    setSchedule(WORK_SHIFT_PRESETS);
  };

  // Compute metrics
  // Initialize a 100-slot boolean/occupation array to compute coverage and overlaps
  const slotsOccupation = Array.from({ length: 100 }, () => [] as string[]);
  schedule.forEach(task => {
    const end = Math.min(100, task.sessionStart + task.durationSessions);
    for (let i = task.sessionStart; i < end; i++) {
      slotsOccupation[i].push(task.title);
    }
  });

  const occupiedSlotsCount = slotsOccupation.filter(slots => slots.length > 0).length;
  const overlappingSlotsCount = slotsOccupation.filter(slots => slots.length > 1).length;

  const categoryColors = {
    survival: { bg: 'bg-red-500/80', text: 'text-red-400', fill: 'bg-red-950/20 border-red-900/40' },
    scientific: { bg: 'bg-cyan-500/80', text: 'text-cyan-400', fill: 'bg-cyan-950/20 border-cyan-900/40' },
    operational: { bg: 'bg-indigo-500/80', text: 'text-indigo-405', fill: 'bg-indigo-950/20 border-indigo-900/40' },
    rest: { bg: 'bg-purple-500/80', text: 'text-purple-400', fill: 'bg-purple-950/20 border-purple-900/40' },
    habitation: { bg: 'bg-emerald-500/80', text: 'text-emerald-400', fill: 'bg-emerald-950/20 border-emerald-900/40' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="habitat-scheduler-dock">
      {/* Visual Timeline and Scheduler Planner */}
      <div className="lg:col-span-8 hardware-border bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-905 pb-4 mb-4 gap-3">
            <div>
              <h3 className="text-base font-light text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                <Calendar size={18} className="text-cyan-400" />
                Cosmic Shift Scheduler
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Optimize habitat timelines scaled around an efficient 100-Session Shift circadian loop.
              </p>
            </div>
            
            <button
              onClick={handleResetPresets}
              className="text-xs font-semibold px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 bg-zinc-950 transition-colors"
              id="btn-schedule-reset"
            >
              Reset to Base Preset
            </button>
          </div>

          {/* Timeline Bar (100-percentile timeline) */}
          <div className="my-6">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-2 font-bold">
              Circadian Shift Coverage (0 - 99 Cosmic Sessions)
            </span>
            
            {/* The actual stacked timeline bar */}
            <div className="relative h-7 w-full bg-zinc-950 rounded-lg overflow-hidden flex border border-zinc-850">
              {schedule.map((task) => {
                const widthPct = task.durationSessions;
                const filterColor = categoryColors[task.category] || categoryColors.operational;
                return (
                  <div
                    key={task.id}
                    className={`h-full ${filterColor.bg} opacity-85 hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-mono font-bold text-white relative group cursor-pointer border-r border-white/20`}
                    style={{ width: `${widthPct}%` }}
                    title={`${task.title} (Session ${task.sessionStart} - ${task.sessionStart + task.durationSessions})`}
                  >
                    {widthPct > 5 && (
                      <span className="truncate px-1 select-none">
                        S-{task.sessionStart}
                      </span>
                    )}
                    
                    {/* Floating Detailed Hover tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-950 border border-zinc-850 text-white p-3 rounded-lg w-52 text-left z-30 shadow-xl pointer-events-none">
                      <div className="font-bold text-xs leading-snug mb-1">{task.title}</div>
                      <div className="text-[10px] text-zinc-400">
                        Category: <strong className="capitalize text-zinc-200">{task.category}</strong>
                      </div>
                      <div className="text-[10px] text-zinc-450 mt-1">
                        Timeline: <strong className="text-zinc-200">Session {task.sessionStart} to {task.sessionStart + task.durationSessions}</strong>
                      </div>
                      <div className="text-[10px] text-zinc-450">
                        Duration: <strong className="text-zinc-200">{task.durationSessions} Cosmic Sessions</strong> (&approx; {(task.durationSessions * 11.73).toFixed(1)} mins)
                      </div>
                    </div>
                  </div>
                );
              })}

              {schedule.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-650 italic">
                  No active cosmic session rosters booked.
                </div>
              )}
            </div>

            {/* Scale markings */}
            <div className="flex justify-between text-[9px] font-mono text-zinc-500 px-1 mt-1 font-bold">
              <span>Session 00 (Start)</span>
              <span>Session 25</span>
              <span>Session 50 (Mid-Shift)</span>
              <span>Session 75</span>
              <span>Session 99 (End-Shift)</span>
            </div>
          </div>

          {/* Validation Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-zinc-950/50 border border-zinc-850/80 p-3 rounded-lg flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-cyan-500" />
              <div>
                <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 block font-semibold">Total Booked</span>
                <span className="font-mono text-xs font-bold text-zinc-200">{occupiedSlotsCount}/100 Sessions</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
              overlappingSlotsCount > 0 
                ? 'bg-amber-950/20 border-amber-900 text-amber-400' 
                : 'bg-zinc-950/50 border-zinc-850/80 text-zinc-500'
            }`}>
              <ShieldAlert size={16} className={overlappingSlotsCount > 0 ? 'text-amber-500' : 'text-zinc-500'} />
              <div>
                <span className="text-[9px] uppercase tracking-wider font-mono block font-bold">Overlapping slots</span>
                <span className="font-mono text-xs font-bold">
                  {overlappingSlotsCount > 0 ? `${overlappingSlotsCount} Sessions` : 'None / Integrated'}
                </span>
              </div>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-850/80 p-3 rounded-lg flex items-center gap-2.5">
              <UserCheck size={16} className="text-cyan-500" />
              <div>
                <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 block font-semibold">Unallocated Space</span>
                <span className="font-mono text-xs font-bold text-zinc-200">{100 - occupiedSlotsCount} Sessions</span>
              </div>
            </div>
          </div>

          {/* Schedule list */}
          <div className="border border-zinc-900/80 rounded-xl overflow-hidden max-h-[190px] overflow-y-auto bg-zinc-950/20">
            {schedule.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-550 italic bg-zinc-950/40">
                Shift schedule empty. Load presets or append custom sessions.
              </div>
            ) : (
              <table className="w-full text-xs text-left text-zinc-400 divide-y divide-zinc-900">
                <thead className="bg-zinc-950 font-mono text-[9px] uppercase font-bold tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-4 py-2.5">Launch Session</th>
                    <th className="px-4 py-2.5">Roster Description / Duty</th>
                    <th className="px-4 py-2.5">Span</th>
                    <th className="px-4 py-2.5 text-center">Velocity</th>
                    <th className="px-4 py-2.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50 bg-transparent">
                  {schedule.map(task => {
                    const style = categoryColors[task.category] || categoryColors.operational;
                    return (
                      <tr key={task.id} className="hover:bg-zinc-900/30">
                        <td className="px-4 py-2.5 font-bold font-mono text-zinc-300">
                          Session {task.sessionStart.toString().padStart(2, '0')}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-semibold text-zinc-200 block text-xs">{task.title}</span>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${style.fill} ${style.text} tracking-wider font-mono`}>
                            {task.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-zinc-400">
                          {task.durationSessions} Sessions
                        </td>
                        <td className="px-4 py-2.5 text-center font-mono text-[10px] text-zinc-400">
                          &approx; {(task.durationSessions * 11.73).toFixed(1)} m
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 hover:text-red-400 text-zinc-500 rounded-md transition-colors"
                            title="Remove mission item"
                            id={`btn-del-${task.id}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div className="text-[9px] text-zinc-500 font-mono italic mt-4 font-light">
          Circadian logic model optimized for Deep Space Habitat crews &mdash; 1 cosmic shift = 19.55 Earth hours.
        </div>
      </div>

      {/* Scheduler controller right (Add custom task Form) */}
      <div className="lg:col-span-4 hardware-border bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative">
        <h3 className="text-sm font-light tracking-wide uppercase text-zinc-102 font-mono mb-4 flex items-center gap-1.5 border-b border-zinc-900 pb-3">
          <Plus size={14} className="text-cyan-400" /> Dispatch New Duty
        </h3>
        
        <p className="text-xs text-zinc-400 mb-5 leading-relaxed font-light">
          Queue up mission critical operations into the active habitat roster.
        </p>

        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1 font-mono tracking-wider">
              Duty Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Recalibrate Transceiver"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              id="inp-duty-desc"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1 font-mono tracking-wider">
                Start Session
              </label>
              <input
                type="number"
                min="0"
                max="99"
                required
                value={newStart}
                onChange={e => setNewStart(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full text-xs px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                id="inp-duty-start"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1 font-mono tracking-wider">
                Span (Sessions)
              </label>
              <input
                type="number"
                min="1"
                max={100 - newStart}
                required
                value={newDuration}
                onChange={e => setNewDuration(Math.min(100 - newStart, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full text-xs px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                id="inp-duty-duration"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1 font-mono tracking-wider">
              Duty Classification
            </label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as any)}
              className="w-full text-xs px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-zinc-300"
              id="sel-duty-class"
            >
              <option value="operational">Operational (Integrity Sync)</option>
              <option value="scientific">Scientific (Analysis/Scan)</option>
              <option value="survival">Survival (Shielding Purges)</option>
              <option value="rest">Rest (Crew Regeneration)</option>
              <option value="habitation">Habitation (Social/Nutrition)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-colors flex justify-center items-center gap-1 mt-4"
            id="btn-duty-submit"
          >
            <Plus size={14} />
            <span>Append Habitat Duty</span>
          </button>
        </form>

        <div className="bg-zinc-950/50 border border-zinc-850 p-3 rounded-xl mt-5 text-[11px] text-zinc-400 leading-relaxed font-mono">
          <span className="font-bold uppercase text-[9px] text-zinc-505 block mb-1">Estimated Span info</span>
          Current configuration spans <strong>{(newDuration * 11.73).toFixed(1)} minutes</strong> of relative Earth time.
        </div>
      </div>
    </div>
  );
}
