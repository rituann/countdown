export interface SolverResult {
  closest: number;
  /** How far the closest result is from the target (0 = exact) */
  diff: number;
  /** Up to 5 unique solution paths, sorted simplest first (fewest steps) */
  expressions: string[];
}

interface Candidate {
  value: number;
  diff: number;
  stepCount: number;
  steps: string[];
}

/**
 * Recursive backtracking solver — official Countdown rules:
 *  - Each number used at most once
 *  - Operations: +, -, *, /
 *  - No negative intermediates
 *  - No fractional intermediates (integer division only)
 *
 * Key improvement over naive approach:
 *  Collects ALL solutions during search, then sorts by step count ascending
 *  so the SIMPLEST solution (fewest numbers used) is shown first.
 */
export function solve(numbers: number[], target: number): SolverResult {
  let closestDiff = Infinity;
  let closestValue = numbers[0];

  // Collect every candidate that produces a result
  const candidates: Candidate[] = [];

  function recurse(
    nums: Array<{ val: number; expr: string }>,
    steps: string[]
  ): void {
    for (const { val } of nums) {
      const diff = Math.abs(val - target);

      // Update global closest
      if (diff < closestDiff) {
        closestDiff = diff;
        closestValue = val;
      }

      // Record this as a candidate (skip trivial 0-step single-number hits
      // unless it genuinely IS the target — those get picked up below)
      if (steps.length > 0) {
        candidates.push({ value: val, diff, stepCount: steps.length, steps });
      }
    }

    // Try every ordered pair with every operator
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;
        const a = nums[i];
        const b = nums[j];
        const rest = nums.filter((_, k) => k !== i && k !== j);

        const ops: Array<{ val: number | null; label: string }> = [
          {
            val: a.val + b.val,
            label: `${a.expr} + ${b.expr} = ${a.val + b.val}`,
          },
          {
            val: a.val > b.val ? a.val - b.val : null,
            label: `${a.expr} - ${b.expr} = ${a.val - b.val}`,
          },
          {
            val: a.val * b.val,
            label: `${a.expr} × ${b.expr} = ${a.val * b.val}`,
          },
          {
            val: b.val !== 0 && a.val % b.val === 0 ? a.val / b.val : null,
            label: `${a.expr} ÷ ${b.expr} = ${a.val / b.val}`,
          },
        ];

        for (const op of ops) {
          if (op.val === null || op.val <= 0) continue;
          recurse(
            [{ val: op.val, expr: `(${op.label.split(" = ")[0]})` }, ...rest],
            [...steps, op.label]
          );
        }
      }
    }
  }

  // Handle case where a number directly equals the target (0 steps)
  for (const n of numbers) {
    if (n === target) {
      return { closest: target, diff: 0, expressions: [`${target} is one of your numbers!`] };
    }
  }

  recurse(numbers.map((n) => ({ val: n, expr: String(n) })), []);

  // Filter to only the closest result, then sort by fewest steps first
  const best = candidates
    .filter((c) => c.diff === closestDiff)
    .sort((a, b) => a.stepCount - b.stepCount);

  // Deduplicate by step signature, take top 5
  const seen = new Set<string>();
  const expressions: string[] = [];
  for (const c of best) {
    const key = c.steps.join("|");
    if (!seen.has(key) && expressions.length < 5) {
      seen.add(key);
      expressions.push(c.steps.join(", "));
    }
  }

  return { closest: closestValue, diff: closestDiff, expressions };
}
