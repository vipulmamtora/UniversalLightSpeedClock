/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CosmicTimeDecomposition, CalibrationAnchor, DistanceItem, SchedulerItem } from './types.ts';

// Core Physical Constants
export const COSMIC_STEP_M = 0.211061140541; // Wavelength of Hydrogen vacuum
export const SPEED_OF_LIGHT_M_S = 299792458; // Standard light velocity
export const CHRON_UNIT_S = COSMIC_STEP_M / SPEED_OF_LIGHT_M_S; // Duration of 1 cu (~7.04014838 * 10^-10 s)
export const CHRON_UNIT_MS = CHRON_UNIT_S * 1000; // ~7.04014838 * 10^-7 ms

// Conversions
export const MS_IN_CHRON_UNITS = 1 / CHRON_UNIT_MS; // ~1,420,405.7517684

// Scale Factors (Base-100)
export const SCALE_CANTO = 1e2;
export const SCALE_MYRIA = 1e4;
export const SCALE_MEGA = 1e6;
export const SCALE_GIGA = 1e8;
export const SCALE_EPOCH = 1e10;
export const SCALE_SESSION = 1e12;
export const SCALE_SHIFT = 1e14;

// Absolute Cosmic Sync Constants
export const PAST_COSMIC_SHIFTS_OFFSET = 75306503;
export const OFFSET_CU = PAST_COSMIC_SHIFTS_OFFSET * SCALE_SHIFT;
export const SN1987A_TIMESTAMP = 541035341000; // February 23, 1987, at 07:35:41 UTC

/**
 * Converts standard millisecond duration since an anchor into equivalent cumulative Chron-Units.
 */
export function msToChronUnits(ms: number): number {
  return ms * MS_IN_CHRON_UNITS;
}

/**
 * Decomposes continuous Chron-Units into six Base-100 positions:
 * [Epoch] . [Giga] . [Mega] . [Myria] . [Canto] . [Chron-Unit]
 * Where each positional slot rolls over standardly at 100:
 * 100 Chron-Units = 1 Canto-Chron
 * 100 Canto-Chrons = 1 Myria-Chron
 * 100 Myria-Chrons = 1 Mega-Chron
 * 100 Mega-Chrons = 1 Giga-Chron
 * 100 Giga-Chrons = 1 Epoch-Chron
 * 100 Epoch-Chrons = 1 Cosmic Session (Rollover)
 */
export function decomposeChronUnits(totalCu: number): CosmicTimeDecomposition {
  const positiveCu = Math.max(0, totalCu);

  const chronUnit = Math.floor(positiveCu) % 100;
  const canto = Math.floor(positiveCu / 1e2) % 100;
  const myria = Math.floor(positiveCu / 1e4) % 100;
  const mega = Math.floor(positiveCu / 1e6) % 100;
  const giga = Math.floor(positiveCu / 1e8) % 100;
  const epoch = Math.floor(positiveCu / 1e10) % 100;

  const total_absolute_shifts = Math.floor(positiveCu / 1e14);
  const shift = total_absolute_shifts % 100;
  const centum = Math.floor(total_absolute_shifts / 100) % 10;
  const vector = Math.floor(total_absolute_shifts / 1000);

  const totalSessions = Math.floor(positiveCu / SCALE_SESSION);
  const totalShifts = Math.floor(positiveCu / SCALE_SHIFT);

  return {
    epoch,
    giga,
    mega,
    myria,
    canto,
    chronUnit,
    shift,
    centum,
    vector,
    totalSessions,
    totalShifts,
  };
}

/**
 * Multipliers for earth values into seconds
 */
export const EARTH_MINUTE_S = 60;
export const EARTH_HOUR_S = 3600;
export const EARTH_DAY_S = 86400;

/**
 * Converts Cosmic Sessions or Cosmic Shifts back to Standard Earth units for visualization.
 */
export function cosmicSessionsToSeconds(sessions: number): number {
  return sessions * SCALE_SESSION * CHRON_UNIT_S;
}

export function cosmicShiftsToSeconds(shifts: number): number {
  return shifts * SCALE_SHIFT * CHRON_UNIT_S;
}

/**
 * Standard Calibration Benchmarks
 */
export const RECENT_CALIBRATIONS: CalibrationAnchor[] = [
  {
    id: 'supernova-1987a',
    name: 'Supernova 1987A Baseline',
    description: 'Primary astrophysical anchor mapped to the SN 1987A core collapse event.',
    timestamp: 541035341000, // Feb 23, 1987, 07:35:41 UTC
    isFixed: true,
  },
  {
    id: 'unix-epoch',
    name: 'UNIX Coordinate Origin',
    description: 'The standard zero coordinate of planetary UNIX time networks.',
    timestamp: 0, // Jan 1, 1970
    isFixed: true,
  },
  {
    id: 'apollo-landing',
    name: 'Apollo 11 Lunar Ingress',
    description: 'First human footsteps on Earth lunar terminal.',
    timestamp: -14158940000, // July 20, 1969 20:17:40
    isFixed: true,
  },
  {
    id: 'voyager-launch',
    name: 'Voyager 1 Launch Initiative',
    description: 'Launch of humanity\'s furthest physical cosmic tracker.',
    timestamp: 242312160000, // September 5, 1977 12:56:00
    isFixed: true,
  },
  {
    id: 'hubble-deployment',
    name: 'Hubble Orbit Insertion',
    description: 'Deployment of the first comprehensive orbital photon receiver.',
    timestamp: 641001600000, // April 25, 1990 00:00:00
    isFixed: true,
  },
];

/**
 * Distance Anchor Presets
 */
export const PRESET_DISTANCES: DistanceItem[] = [
  { id: 'bohr', name: 'Hydrogen Bohr Radius', category: 'micro', meters: 5.29177e-11 },
  { id: 'water', name: 'Water Molecule Diameter', category: 'micro', meters: 2.75e-10 },
  { id: 'dna', name: 'DNA Double Helix Width', category: 'micro', meters: 2.0e-9 },
  { id: 'redcell', name: 'Red Blood Cell Diameter', category: 'micro', meters: 7.0e-6 },
  { id: 'tennis', name: 'Standard Tennis Ball diameter', category: 'human', meters: 0.067 },
  { id: 'cosmicstep', name: '1 Cosmic Step (Hydrogen Wavelength)', category: 'human', meters: COSMIC_STEP_M },
  { id: 'human-avg', name: 'Average Human Height', category: 'human', meters: 1.75 },
  { id: 'iss', name: 'International Space Station Span', category: 'human', meters: 109.0 },
  { id: 'everest', name: 'Mount Everest Elevation', category: 'planetary', meters: 8848.86 },
  { id: 'earth-diameter', name: 'Earth Polar Diameter', category: 'planetary', meters: 12742000 },
  { id: 'moon-distance', name: 'Moon Orbital Radius (Average)', category: 'planetary', meters: 384400000 },
  { id: 'sun-distance', name: 'Astronomical Unit (Earth-Sun Distance)', category: 'cosmic', meters: 149597870700 },
  { id: 'voyager-dist', name: 'Voyager 1 Distance from Sun (approx)', category: 'cosmic', meters: 2.4e13 },
  { id: 'proxima', name: 'Proxima Centauri interstellar distance', category: 'cosmic', meters: 4.017e16 },
];

/**
 * Habitational Schedule Presets
 */
export const WORK_SHIFT_PRESETS: SchedulerItem[] = [
  { id: 's1', title: 'Cosmic Drift Sync & System Purge', sessionStart: 0, durationSessions: 8, category: 'operational' },
  { id: 's2', title: 'Solar Array Alignment & Static Calib', sessionStart: 8, durationSessions: 12, category: 'operational' },
  { id: 's3', title: 'Nutrient Bio-Purge & Intake Cycles', sessionStart: 20, durationSessions: 6, category: 'habitation' },
  { id: 's4', title: 'Scientific Gravitational Analysis', sessionStart: 26, durationSessions: 22, category: 'scientific' },
  { id: 's5', title: 'Interstellar Signal Logging', sessionStart: 48, durationSessions: 10, category: 'scientific' },
  { id: 's6', title: 'Active Physical Recovery Shift', sessionStart: 58, durationSessions: 6, category: 'rest' },
  { id: 's7', title: 'Operational Integrity Inspections', sessionStart: 64, durationSessions: 10, category: 'operational' },
  { id: 's8', title: 'Deep Circadian Regeneration', sessionStart: 74, durationSessions: 26, category: 'rest' },
];
