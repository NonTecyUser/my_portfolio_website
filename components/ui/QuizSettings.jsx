'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import RulesModal from './RulesModal';

const OPTIONS = [10, 15, 20, 25];

export default function QuizSettings({ selected, onSelect, onStart }) {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          Choose number of questions
        </p>
        <button
          onClick={() => setRulesOpen(true)}
          aria-label="View scoring rules"
          className="text-text-muted transition-colors hover:text-accent"
        >
          <Info size={15} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => onSelect(count)}
            className={`rounded-xl border px-4 py-3 font-mono text-lg transition-colors ${
              selected === count
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-white/10 bg-white/5 text-text-primary hover:border-accent/40'
            }`}
          >
            {count}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-text-muted">
        Score = accuracy + a speed bonus on every correct answer, based on
        your total time.{' '}
        <button
          onClick={() => setRulesOpen(true)}
          className="text-accent underline-offset-2 hover:underline"
        >
          View full rules
        </button>
      </p>

      <button
        onClick={onStart}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-medium text-base-deep transition-shadow hover:shadow-lg hover:shadow-accent/30"
      >
        Start quiz
      </button>

      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}