export interface SolverResult {
  closest: number;
  /** How far the closest result is from the target (0 = exact) */
  diff: number;
  /** Up to 5 unique expressions that produce the closest result */
  expressions: string[];
}

/**
 * Recursive backtracking solver — official Countdown rules:
 *  - Each number used at most once
 *  - Operations: +, -, *, /
 *  - No negative intermediates
 *  - No fractional intermediates (integer division only)
 *  - Returns up to 5 unique expressions achieving the closest result
 */
export function solve(numbers: number[], target: number): SolverResult {
  let closestDiff = Infinity;
  let closestValue = numbers[0];
  const found = new Set<string>();
  const MAX_EXPRESSIONS = 5;

  /**
   * @param nums   Remaining available numbers with their expression strings
   * @param steps  Human-readable steps accumulated so far
   */
  function recurse(
    nums: Array<{ val: number; expr: string }>,
    steps: string[]
  ): void {
    // Check each current value against the target
    for (const { val, expr } of nums) {
      const diff = Math.abs(val - target);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestValue = val;
        found.clear();
      }
      if (diff === closestDiff && found.size < MAX_EXPRESSIONS) {
        // Build a readable solution string from the steps taken
        const key = steps.join(", ");
        if (!found.has(key)) found.add(key);
      }
    }

    if (found.size >= MAX_EXPRESSIONS && closestDiff === 0) return;

    // Try every pair of remaining numbers with every operator
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;
        const a = nums[i];
        const b = nums[j];
        const rest = nums.filter((_, idx) => idx !== i && idx !== j);

        const ops: Array<{
          val: number | null;
          label: string;
        }> = [
          { val: a.val + b.val, label: `${a.expr} + ${b.expr} = ${a.val + b.val}` },
          // Only subtract if result is positive
          {
            val: a.val > b.val ? a.val - b.val : null,
            label: `${a.expr} - ${b.expr} = ${a.val - b.val}`,
          },
          { val: a.val * b.val, label: `${a.expr} × ${b.expr} = ${a.val * b.val}` },
          // Only divide if result is a whole number
          {
            val:
              b.val !== 0 && a.val % b.val === 0 ? a.val / b.val : null,
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

  recurse(
    numbers.map((n) => ({ val: n, expr: String(n) })),
    []
  );

  return {
    closest: closestValue,
    diff: closestDiff,
    expressions: Array.from(found),
  };
}
