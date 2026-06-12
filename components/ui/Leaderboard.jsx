'use client';

import { Trophy } from 'lucide-react';

/**
 * Displays the stored high score for a given question-count segment.
 * `record` is { name: string, percentage: number } | null.
 */
export default function Leaderboard({ questionCount, record, isNewRecord }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
        <Trophy size={14} />
        {questionCount}-Question Best
      </div>

      {record ? (
        <div className="mt-3">
          <p className="font-display text-2xl font-semibold text-text-primary">
            {record.percentage}%
          </p>
          <p className="mt-1 text-sm text-text-muted">{record.name}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-text-muted">No record yet — be the first.</p>
      )}

      {isNewRecord && (
        <p className="mt-3 text-xs font-medium text-accent">New high score!</p>
      )}
    </div>
  );
}