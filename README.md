# Universal Light-Speed Clock

An absolute cosmological chronometer operating independently of geocentric cycles (no Earth days, years, or standard seconds). The clock is anchored directly to the fundamental physical wavelength of neutral Hydrogen and is scaled using a pure base-100 metric positional hierarchy.

This application provides a highly polished, interactive visual instrument for modeling, calibrating, and converting astronomical epochs under absolute spacetime metrics.

---

## Technical Specifications & Formulation

### 1. The Fundamental Unit: Chron-Unit (cu)
Terrestrial timekeeping is geocentrically arbitrary (historically derived from divisions of Earth's rotation and orbit around a G-type star). The **Universal Light-Speed Clock** resolves this by deriving its base interval from absolute physical constants:

* **Medium Wavelength of Neutral Hydrogen ($\lambda_H$):** `0.211061140541...` meters (the standard hypefine spin-flip transition wavelength, colloquially the "21.1 cm line").
* **Speed of Light in Vacuum ($c$):** `299,792,458` meters/second.

A single **Chron-Unit (cu)** is defined as the time light takes to propagate across exactly one wavelength of Hydrogen in a vacuum:

$$t_{cu} = \frac{\lambda_H}{c}$$

$$\approx 7.04014838 \times 10^{-10} \text{ seconds}$$

### 2. Base-100 Positional Hierarchy
The clock organizes sequential subdivisions into neat base-100 cascading registers, eliminating highly irregular units (such as 60-second minutes, 24-hour days, or 365-day years):

| Unit Tier | CU Multiplier | Terrestrial Observer Equivalent | Physical Light Distance |
| :--- | :--- | :--- | :--- |
| **Chron-Unit (cu)** | $10^0$ | $0.704 \text{ nanoseconds}$ | $0.211061 \text{ meters}$ (1 $\lambda_H$) |
| **Canto (Ca)** | $10^2$ | $70.40 \text{ nanoseconds}$ | $21.106 \text{ meters}$ |
| **Myria (My)** | $10^4$ | $7.04 \text{ microseconds}$ | $2.11 \text{ kilometers}$ |
| **Mega (Me)** | $10^6$ | $704.01 \text{ microseconds}$ | $211.06 \text{ kilometers}$ |
| **Giga (Gi)** | $10^8$ | $70.40 \text{ milliseconds}$ | $21,106.11 \text{ kilometers}$ |
| **Epoch (E)** | $10^{10}$ | $7.04 \text{ seconds}$ | $2,110,611 \text{ kilometers}$ (~5.5x Moon distance) |
| **Session (Se)** | $10^{12}$ | $11.73 \text{ minutes}$ | $1.41 \text{ Astronomical Units (AU)}$ |
| **Shift (S)** | $10^{14}$ | $19.56 \text{ hours}$ | $141.0 \text{ Astronomical Units (AU)}$ |
| **Centum (C)** | $10^{16}$ | $81.48 \text{ days}$ | $\approx 0.223 \text{ Light Years}$ |
| **Vector (V)** | $10^{17}$ | $2.23 \text{ Years}$ | $\approx 2.23 \text{ Light Years}$ |

### 3. Absolute Chronological Reference: Supernova 1987A (SN 1987A)
To anchor elapsed time-flow onto an objective galactic coordinate, the clock's baseline reference zero $(0 \text{ cu})$ is calibrated to the exact moment the neutrino and photon wavefront from **Supernova 1987A** entered Earth sensors:
* **Terrestrial Epoch:** `February 23, 1987, 07:35:41 UTC`

---

## Core Application Modules

### 🪐 Primary Instrument Dashboard
- **Universal Odometer:** A mechanical-style readout displaying live fractional registers from absolute Vectors down to Chrons with high-framerate kinetic ticks.
- **Cosmic Orbital Clock:** A custom canvas-rendered analog radial visualization modeled on orbital rings and sweep hands tracking Sessions, Shifts, and Epochs.
- **Coordinate Matrix & Calendar:** A unified component packing the ten-tier physical coordinate table aligned side-by-side with an interactive decan 10x10 Shift grid showing cyclic propagation.

### ⚡ Dynamics Regulator & Synchronization Anchors
- **Time-flow Regulator:** Simulates relativistic travel at precise velocities, scaling simulation increments from natural-speed up to $10,000,000 \times$.
- **Sync Anchors Panel:** Connects the absolute clock frame to various historical epochs (e.g., Earth Millennial Epoch, Moon Landing, JWST Deep Field, or your own custom timestamp anchor).

### 🧪 Physics Sandbox & Converter
- **Hydrogen Hyperfine Sandbox:** Interactive visualization of ground-state Hydrogen spin-flips and photon propagation that matches live signal calculations.
- **Playground Converter:** Bilateral computation node translating human UTC dates down to precise fractional Cosmic Coordinates and vice versa in real time.

---

## Build, Run & Development

This is a modern full-stack web application bundled using **Vite + React + Tailwind CSS**.

### Setup and Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Launch the development server:**
   ```bash
   npm run dev
   ```

3. **Production compilation:**
   ```bash
   npm run build
   ```

4. **Linter validation:**
   ```bash
   npm run lint
   ```
