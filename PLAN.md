# Feature Implementation Plan

**Overall Progress:** `100%`

## TLDR
Build a Countdown Numbers Game web app for v1 — a gift replicating the math round from the British TV show. Greenfield Next.js App Router project with a 5-state game flow, 30s animated timer, collapsible workspace scratch-pad, recursive solver, and a Reality TV dark mode UI. Deploy-ready for Vercel.

## Critical Decisions
- **No sound in v1** — timer uses animation only (Framer Motion); sound is a future idea
- **Auto-generated numbers** — app randomly picks large/small numbers after user selects count; no manual tile-drawing
- **Workspace is scratch-pad only** — no submission or scoring; purely for the user to think through equations
- **Reveal is triggered by timer end** — "Reveal Solutions" button appears when timer hits zero; no manual "I'm done" button
- **Solver runs on reveal** — backtracking runs client-side in `/lib/solver.ts` when user clicks "Reveal Solutions"
- **New Round resets to SETUP** — full state reset, no score persistence in v1
- **Proximity messaging** — if closest result is 1 or 2 away from target, a special message is shown ("Just 1 away — so close!", "Only 2 away — very close!")

---

## Tasks

- [x] 🟩 **Step 1: Project Scaffold**
  - [x] 🟩 Init Next.js App Router project with TypeScript
  - [x] 🟩 Install dependencies: `framer-motion`, `lucide-react`
  - [x] 🟩 Configure Tailwind CSS with custom theme tokens (Deep Navy, Gold, Electric Blue)
  - [x] 🟩 Add JetBrains Mono via Google Fonts in `/app/layout.tsx`
  - [x] 🟩 Set global background color and base font in layout

- [x] 🟩 **Step 2: Game State Machine (`/app/page.tsx`)**
  - [x] 🟩 Define `GameState` type: `SETUP | PLAYING | TIME_UP`
  - [x] 🟩 Hold state: `gameState`, `largeCount`, `numbers[]`, `target`
  - [x] 🟩 Wire state transitions: SETUP → PLAYING → TIME_UP → SETUP (New Round)
  - [x] 🟩 Render the correct view/components per state

- [x] 🟩 **Step 3: Number & Target Generation (`/lib/gameUtils.ts`)**
  - [x] 🟩 `generateNumbers(largeCount)` — picks N from [25,50,75,100] + (6-N) from two sets of 1–10
  - [x] 🟩 `generateTarget()` — random integer 101–999

- [x] 🟩 **Step 4: SETUP Screen**
  - [x] 🟩 Heading: "How many large numbers?"
  - [x] 🟩 Five buttons labeled 0–4 (styled with gold accent)
  - [x] 🟩 On selection: generate numbers + target, transition to PLAYING

- [x] 🟩 **Step 5: Timer Component (`/components/Timer.tsx`)**
  - [x] 🟩 SVG circular progress ring (Framer Motion on strokeDashoffset)
  - [x] 🟩 Countdown display in JetBrains Mono (color-matched to ring)
  - [x] 🟩 Counts 30s → 0; on zero: fires `onTimeUp` callback, animation stops
  - [x] 🟩 Color shifts gold → orange → red as time runs low (last 10s)

- [x] 🟩 **Step 6: Number Cards (`/components/NumberCard.tsx`)**
  - [x] 🟩 Glassmorphism card with gold border + subtle glow
  - [x] 🟩 Framer Motion staggered entrance animation
  - [x] 🟩 `used` prop dims the card when number is in Workspace

- [x] 🟩 **Step 7: PLAYING Screen**
  - [x] 🟩 Display target number (JetBrains Mono, large, electric blue)
  - [x] 🟩 Display 6 `NumberCard` tiles
  - [x] 🟩 Mount `Timer` component
  - [x] 🟩 Mount `Workspace` component (collapsed by default)

- [x] 🟩 **Step 8: Workspace (`/components/Workspace.tsx`)**
  - [x] 🟩 Collapsible bottom-sheet (Framer Motion slide-up)
  - [x] 🟩 Toggle button (chevron icon via Lucide)
  - [x] 🟩 Equation display area (built string shown live)
  - [x] 🟩 Clickable number buttons (from the 6 provided numbers)
  - [x] 🟩 Operator buttons: +, −, ×, ÷
  - [x] 🟩 Clear / backspace button
  - [x] 🟩 Real-time validation: prevent reuse of same number slot

- [x] 🟩 **Step 9: Solver (`/lib/solver.ts`)**
  - [x] 🟩 `SolverResult` type with `closest`, `diff`, `expressions`
  - [x] 🟩 Recursive backtracking over all permutations
  - [x] 🟩 No fractions, no negative intermediates
  - [x] 🟩 Tracks closest result, collects up to 5 unique expression strings
  - [x] 🟩 Proximity messaging for diff === 1 or diff === 2

- [x] 🟩 **Step 10: Solution Box (`/components/SolutionBox.tsx`)**
  - [x] 🟩 "Reveal Solutions" button (appears in TIME_UP state)
  - [x] 🟩 Runs solver on click
  - [x] 🟩 Shows closest result (blue if exact, gold if 1-2 away, orange otherwise)
  - [x] 🟩 Proximity message: exact / 1 away / 2 away / off by N
  - [x] 🟩 Scrollable list of up to 5 solution expressions
  - [x] 🟩 "New Round" button → resets to SETUP

- [x] 🟩 **Step 11: Vercel Deployment**
  - [x] 🟩 Zero-config `next.config.ts` confirmed
  - [x] 🟩 Pushed to `rituann/countdown` on GitHub
  - [ ] 🟥 Connect repo to Vercel (manual step — user needs to do this)
