'use client';

import { useEffect, useState } from 'react';

/**
 * Displays total elapsed quiz time (ticking every 100ms), excluding any
 * paused duration. Freezes once `frozen` is true (paused or finished).
 */
export default function QuizTimer({ startTime, pausedMs, frozen }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (frozen) return;

    const update = () => setElapsed((Date.now() - startTime - pausedMs) / 1000);
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [startTime, pausedMs, frozen]);

  return (
    <span className="font-mono text-xs text-text-muted">
      Total time: {Math.max(elapsed, 0).toFixed(1)}s
    </span>
  );
}