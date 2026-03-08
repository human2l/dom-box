# Design Doc: DOM Box - System Repair Dashboard

**Date**: 2026-03-08
**Status**: Approved
**Author**: Antigravity

## 1. Overview
DOM Box is a puzzle-solving game where the core mechanics are built using standard web UI components (buttons, sliders, switches, etc.). The game subverts user's expectations of how these components behave, turning a "normal" dashboard into a complex mechanical puzzle box.

The first prototype is a **SaaS Repair Ticket** scenario where the player must "fix" a malfunctioning dashboard to resolve an urgent support ticket.

## 2. Narrative & Style
- **Setting**: An internal admin dashboard of a SaaS company.
- **Goal**: Resolve "Ticket #4096" by fixing four malfunctioning system modules.
- **Aesthetic**: Clean, modern design system (Vite + React + Vanilla CSS). Starts with "broken" cold tones and transitions to "fixed" warm/golden tones upon completion.

## 3. Puzzle Mechanisms

### Layer 1: Service Status (Switch Logic Gate)
- **Component**: 5 Toggle Switches.
- **Logic**: Hidden XOR/dependency relationships between switches.
- **Goal**: Turn all 5 status lights from Red to Green.
- **Clue**: Tooltips briefly flash the name of a dependent service.

### Layer 2: Performance Tuning (Slider Resonance)
- **Component**: 3 Range Sliders (CPU, Memory, Bandwidth).
- **Logic**: Values must satisfy `Sum = 150` and `MaxDifference <= 30`.
- **Feedback**: A real-time wave visualization that smooths out as the player approaches the "resonance" values.
- **Clue**: Small text label hinting at `Target: Resonance @ 150Hz`.

### Layer 3: Region Configuration (Decision Tree Dropdowns)
- **Component**: 3 Cascading Select Dropdowns.
- **Logic**: Selecting an option in one dropdown dynamically changes available options in the next. Only one unique path leads to a valid state.
- **Feedback**: Red validation errors that provide cryptic hints about the necessary path.
- **Clue**: A sidebar navigation item changes name to include a prefix found in the correct answer.

### Layer 4: System Logs (Hidden Input & Toast)
- **Component**: An Accordion containing scrolling logs.
- **Logic**: A Toast notification gives a fragment of a key (`DOM-`). Three lines in the log have subtle visual deviations; their first characters form the rest of the key (`BOX`).
- **Goal**: Enter the key `DOM-BOX` into a hidden "Search/Recovery" input at the bottom of the logs.

## 4. Technical Architecture
- **Framework**: Vite + React.
- **State Management**: Centralized `useReducer` + `Context API` acting as a Finite State Machine (FSM).
- **Styling**: Vanilla CSS with CSS Variables for theme switching.
- **Component Logic**: Pure JS "Engine" files for each layer's logic to keep UI components lean.

## 5. Success Criteria
- Player can successfully navigate from Layer 1 to Layer 4 and see the victory screen.
- The transition from "Broken" to "Fixed" state is visually distinct and satisfying.
- The code is modular enough to add more "Modules" (Levels) in the future.
