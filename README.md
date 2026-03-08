# DOM Box 🔓

> A puzzle game where the interface *is* the mechanism.

DOM Box is a browser-based puzzle where you solve riddles using only standard UI components — toggles, sliders, dropdowns, and accordions. No tutorials. No instructions. Just a broken dashboard and a support ticket waiting to be closed.

![DOM Box Screenshot](docs/screenshot.png)

---

## The Concept

Most puzzle games teach you a new language. DOM Box speaks a language you already know fluently: the web interface.

Every component you've ever clicked without thinking — a toggle switch, a progress bar, a dropdown menu — is a lock here. Your muscle memory is both the key and the trap.

> *"The puzzle is the UI. The UI is the puzzle."*

---

## How to Play

You've been assigned **Ticket #4096**: a SaaS dashboard has gone haywire. Four modules need to be fixed. Close the ticket.

That's all you're told.

**Everything happens inside the browser window.** No DevTools. No console tricks. Pure UI interaction.

### The Four Modules

| Module | Component | Mechanic |
|--------|-----------|----------|
| Service Status | Toggle Switches | Hidden XOR dependency chains between services |
| Performance Tuning | Range Sliders | Find the "resonance" — a waveform guides you |
| Region Configuration | Cascading Dropdowns | One valid path through a decision tree |
| System Logs | Accordion + Text Input | A toast holds a clue; the logs hold the rest |

Each module unlocks the next. Solve them in order, read the signals, and recover the system.

---

## Running Locally

```bash
# Clone
git clone https://github.com/human2l/dom-box.git
cd dom-box

# Install
npm install

# Run
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — and good luck.

---

## Tech Stack

- **Vite + React** — component-based UI, state-driven rendering
- **Vanilla CSS** — zero UI libraries; every component is hand-crafted
- **useReducer + Context** — a centralized finite state machine (FSM) manages all puzzle state
- **Canvas API** — the waveform visualizer in the Performance Tuning module

### Architecture

The core follows a **headless architecture** — puzzle logic is completely separated from UI:

```
src/
├── engine/          # Pure JS puzzle logic (no DOM, no React)
│   └── puzzleEngine.js
├── context/         # Central FSM (GameContext + useReducer)
│   └── GameContext.jsx
├── data/            # Puzzle constants, correct answers, log lines
│   └── constants.js
└── components/      # UI layer — controlled components only
    ├── Layer1/      # Toggle switches
    ├── Layer2/      # Sliders + waveform
    ├── Layer3/      # Cascading dropdowns
    ├── Layer4/      # Accordion logs + recovery input
    └── Layout/      # Sidebar, Header, Dashboard
```

This means the puzzle rules can be changed in `engine/` without touching any UI code — and vice versa.

---

## Design Philosophy

**False Affordance** — UI components that look completely normal but behave in unexpected, interconnected ways. The familiarity of the interface is the puzzle's difficulty curve.

**State Gridlock** — components are interdependent. Fixing one thing breaks another. The correct path requires understanding the hidden system beneath the surface.

**No guidance, no hand-holding** — the only clues are embedded in the interface itself.

---

## Roadmap

- [ ] More puzzle layers (drag-and-drop, modal sequences, button physics)
- [ ] Multiple "tickets" (level select)
- [ ] Leaderboard / shareable results
- [ ] Mobile-friendly layout

---

## License

MIT
