# Feature Implementation Plan

**Overall Progress:** `0%`

## TLDR
Build a Countdown Numbers Game web app for v1 — a gift replicating the math round from the British TV show. Greenfield Next.js App Router project with a 5-state game flow, 30s animated timer, collapsible workspace scratch-pad, recursive solver, and a Reality TV dark mode UI. Deploy-ready for Vercel.

## Critical Decisions
- **No sound in v1** — timer uses animation only (Framer Motion); sound is a future idea
- **Auto-generated numbers** — app randomly picks large/small numbers after user selects count; no manual tile-drawing
- **Workspace is scratch-pad only** — no submission or scoring; purely for the user to think through equations
- **Reveal is triggered by timer end** — "Reveal Solutions" button appears when timer hits zero; no manual "I'm done" button
- **Solver runs on reveal** — backtracking runs client-side in `/lib/solver.ts` when user clicks "Reveal Solutions"
- **New Round resets to SETUP** — full state reset, no score persistence in v1

---

## Tasks

- [ ] 🟥 **Step 1: Project Scaffold**
  - [ ] 🟥 Init Next.js App Router project with TypeScript (`create-next-app`)
  - [ ] 🟥 Install dependencies: `framer-motion`, `lucide-react`
  - [ ] 🟥 Configure Tailwind CSS with custom theme tokens (Deep Navy, Gold, Electric Blue)
  - [ ] 🟥 Add JetBrains Mono via Google Fonts in `/app/layout.tsx`
  - [ ] 🟥 Set global background color and base font in layout

- [ ] 🟥 **Step 2: Game State Machine (`/app/page.tsx`)**
  - [ ] 🟥 Define `GameState` type: `SETUP | PLAYING | TIME_UP | REVEAL`
  - [ ] 🟥 Hold state: `gameState`, `largeCount`, `numbers[]`, `target`
  - [ ] 🟥 Wire state transitions: SETUP → PLAYING → TIME_UP → REVEAL → SETUP (New Round)
  - [ ] 🟥 Render the correct view/components per state

- [ ] 🟥 **Step 3: Number & Target Generation (`/lib/gameUtils.ts`)**
  - [ ] 🟥 `generateNumbers(largeCount: number): number[]` — picks N from [25,50,75,100] + (6-N) from two sets of 1–10
  - [ ] 🟥 `generateTarget(): number` — random integer 101–999

- [ ] 🟥 **Step 4: SETUP Screen**
  - [ ] 🟥 Heading: "How many large numbers?"
  - [ ] 🟥 Five buttons labeled 0–4 (styled with gold accent)
  - [ ] 🟥 On selection: generate numbers + target, transition to PLAYING

- [ ] 🟥 **Step 5: Timer Component (`/components/Timer.tsx`)**
  - [ ] 🟥 SVG circular progress ring (Framer Motion `animate` on `strokeDashoffset`)
  - [ ] 🟥 Countdown display in JetBrains Mono (electric blue glow)
  - [ ] 🟥 Counts 30s → 0; on zero: fires `onTimeUp` callback, animation stops
  - [ ] 🟥 Color shifts from gold → red as time runs low (last 10s)

- [ ] 🟥 **Step 6: Number Cards (`/components/NumberCard.tsx`)**
  - [ ] 🟥 Glassmorphism card with gold border + subtle glow
  - [ ] 🟥 Framer Motion entrance animation (staggered reveal on PLAYING state)
  - [ ] 🟥 `used` prop dims the card when the number has been used in Workspace

- [ ] 🟥 **Step 7: PLAYING Screen**
  - [ ] 🟥 Display target number (JetBrains Mono, large, electric blue)
  - [ ] 🟥 Display 6 `NumberCard` tiles
  - [ ] 🟥 Mount `Timer` component
  - [ ] 🟥 Mount `Workspace` component (collapsed by default)

- [ ] 🟥 **Step 8: Workspace (`/components/Workspace.tsx`)**
  - [ ] 🟥 Collapsible bottom-sheet (Framer Motion slide-up animation)
  - [ ] 🟥 Toggle button (chevron icon via Lucide)
  - [ ] 🟥 Equation display area (built string shown live)
  - [ ] 🟥 Clickable number buttons (from the 6 provided numbers)
  - [ ] 🟥 Operator buttons: `+`, `-`, `×`, `÷`
  - [ ] 🟥 Clear / backspace button
  - [ ] 🟥 Real-time validation: track which numbers have been used; prevent reuse

- [ ] 🟥 **Step 9: Solver (`/lib/solver.ts`)**
  - [ ] 🟥 `solve(numbers: number[], target: number): SolverResult` type definition
  - [ ] 🟥 Recursive backtracking over all permutations of numbers and operations
  - [ ] 🟥 Enforce no fractions and no negative intermediates
  - [ ] 🟥 Track closest result found; collect up to 5 unique expression strings
  - [ ] 🟥 Return `{ closest: number, expressions: string[] }`

- [ ] 🟥 **Step 10: Solution Box (`/components/SolutionBox.tsx`)**
  - [ ] 🟥 "Reveal Solutions" button (appears in TIME_UP state)
  - [ ] 🟥 On click: run solver, transition to REVEAL state
  - [ ] 🟥 Show closest result achieved (gold highlight if exact match)
  - [ ] 🟥 Scrollable list of up to 5 solution expressions
  - [ ] 🟥 "New Round" button → resets to SETUP

- [ ] 🟥 **Step 11: Vercel Deployment**
  - [ ] 🟥 Confirm `next.config.ts` has no blockers
  - [ ] 🟥 Add `vercel.json` if needed (likely not required for App Router)
  - [ ] 🟥 Push to `rituann/countdown` on GitHub
  - [ ] 🟥 Connect repo to Vercel and confirm zero-config deploy
