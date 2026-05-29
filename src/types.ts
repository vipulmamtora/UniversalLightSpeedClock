/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CosmicTimeDecomposition {
  epoch: number;      // Ecu (10^10)
  giga: number;       // Tcu (10^8)
  mega: number;       // Gcu (10^6)
  myria: number;      // Mcu (10^4)
  canto: number;      // Ccu (10^2)
  chronUnit: number;  // cu  (10^0)
  shift: number;      // Shift (circadian/day level)
  centum: number;     // Centum (month level)
  vector: number;     // Vector (year level)
  totalSessions: number; // accumulated Cosmic Sessions (total_cu / 10^12)
  totalShifts: number;   // accumulated Cosmic Shifts (total_cu / 10^14)
}

export interface CalibrationAnchor {
  id: string;
  name: string;
  description: string;
  timestamp: number; // Earth Milliseconds (Date.now())
  isFixed: boolean;  // Whether it's a fixed historical date or a user-adjustable anchor
}

export interface DistanceItem {
  id: string;
  name: string;
  category: 'micro' | 'human' | 'planetary' | 'cosmic';
  meters: number;
}

export interface SchedulerItem {
  id: string;
  title: string;
  sessionStart: number; // 0 to 99 inside a Cosmic Shift (since 1 Cosmic Shift = 100 Sessions)
  durationSessions: number; // Duration in Cosmic Sessions
  category: 'survival' | 'scientific' | 'operational' | 'rest' | 'habitation';
}
