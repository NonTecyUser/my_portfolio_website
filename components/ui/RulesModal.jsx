'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function RulesModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-base-deep p-6 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-text-primary">
                How scoring works
              </h3>
              <button
                onClick={onClose}
                aria-label="Close rules"
                className="text-text-muted transition-colors hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
              <li>
                <span className="text-accent">▸</span> Each correct answer is
                worth <strong className="text-text-primary">0.5 points</strong> for accuracy.
              </li>
              <li>
                <span className="text-accent">▸</span> A speed bonus is added
                to <strong className="text-text-primary">every correct answer</strong>,
                based on your total time to finish the whole quiz.
              </li>
              <li>
                <span className="text-accent">▸</span> Finish in under{' '}
                <strong className="text-text-primary">0.8s × number of questions</strong>{' '}
                (e.g. 8s for 10 questions) → +0.5 bonus per correct answer (full marks).
              </li>
              <li>
                <span className="text-accent">▸</span> Finish in under{' '}
                <strong className="text-text-primary">1.2s × number of questions</strong>{' '}
                (e.g. 12s for 10 questions) → +0.35 bonus per correct answer (70%).
              </li>
              <li>
                <span className="text-accent">▸</span> Slower than that → +0.25
                bonus per correct answer (50%).
              </li>
              <li>
                <span className="text-accent">▸</span> Max possible per question
                is 1.0 — your final score is shown as a percentage.
              </li>
              <li>
                <span className="text-accent">▸</span> If you go inactive for{' '}
                <strong className="text-text-primary">45 seconds</strong>, the
                quiz pauses automatically. Paused time doesn't count toward
                your total time.
              </li>
              <li>
                <span className="text-accent">▸</span> Each question-count
                mode (10/15/20/25) has its own high score, shown after you finish.
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}