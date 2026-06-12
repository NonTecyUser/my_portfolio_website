'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Brain } from 'lucide-react';
import QuizSettings from '@/components/ui/QuizSettings';
import QuizTimer from '@/components/ui/QuizTimer';

const OPERATORS = ['+', '-', '×'];

function generateQuestion() {
  const op = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
  let a, b, answer;

  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 25;
    b = Math.floor(Math.random() * 25) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  }

  const options = new Set([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 9) - 4; // -4..4
    const candidate = answer + (offset === 0 ? 5 : offset);
    if (candidate >= 0) options.add(candidate);
  }

  return {
    text: `${a} ${op} ${b}`,
    answer,
    options: [...options].sort(() => Math.random() - 0.5),
  };
}

// 50% accuracy + 50% speed, per question (max 1.0):
//  - correct answer -> +0.5
//  - answered within 8s  -> +0.5 (100% of speed half)
//  - answered within 15s -> +0.35 (70% of speed half)
//  - slower              -> +0.25 (50% of speed half)
function scoreQuestion(isCorrect, elapsedSeconds) {
  const accuracyPoints = isCorrect ? 0.5 : 0;
  let speedPoints;
  if (elapsedSeconds <= 8) speedPoints = 0.5;
  else if (elapsedSeconds <= 15) speedPoints = 0.35;
  else speedPoints = 0.25;

  return accuracyPoints + speedPoints;
}

export default function Playground() {
  const [phase, setPhase] = useState('settings'); // 'settings' | 'playing' | 'finished'
  const [questionCount, setQuestionCount] = useState(10);

  const [question, setQuestion] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0); // sum of per-question points (0..questionCount)
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(null);

  function startQuiz() {
    setQuestion(generateQuestion());
    setRound(1);
    setTotalScore(0);
    setCorrectCount(0);
    setSelected(null);
    setStartTime(Date.now());
    setPhase('playing');
  }

  const handleAnswer = useCallback(
    (option) => {
      if (selected !== null) return;
      setSelected(option);

      const elapsed = (Date.now() - startTime) / 1000;
      const isCorrect = option === question.answer;
      if (isCorrect) setCorrectCount((c) => c + 1);
      setTotalScore((s) => s + scoreQuestion(isCorrect, elapsed));

      setTimeout(() => {
        if (round >= questionCount) {
          setPhase('finished');
        } else {
          setRound((r) => r + 1);
          setQuestion(generateQuestion());
          setSelected(null);
          setStartTime(Date.now());
        }
      }, 600);
    },
    [selected, question, round, questionCount, startTime]
  );

  function restart() {
    setPhase('settings');
    setQuestion(null);
  }

  const percentage = phase === 'finished' ? Math.round((totalScore / questionCount) * 100) : 0;

  return (
    <section id="playground" className="bg-base px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Take a break
        </span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
          Quick mental math quiz
        </h2>
        <p className="mt-3 text-text-muted">
          Half your score comes from accuracy, half from speed — answer fast and right.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {phase === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <QuizSettings
                  selected={questionCount}
                  onSelect={setQuestionCount}
                  onStart={startQuiz}
                />
              </motion.div>
            )}

            {phase === 'playing' && question && (
              <motion.div
                key={round}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between font-mono text-xs text-text-muted">
                  <span>Question {round} / {questionCount}</span>
                  <QuizTimer startTime={startTime} frozen={selected !== null} />
                </div>

                <p className="mt-6 text-center font-display text-4xl font-semibold text-text-primary sm:text-5xl">
                  {question.text}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {question.options.map((option) => {
                    const isCorrect = option === question.answer;
                    const isSelected = option === selected;
                    let stateClasses = 'border-white/10 bg-white/5 hover:border-accent/40';

                    if (selected !== null) {
                      if (isCorrect) {
                        stateClasses = 'border-accent bg-accent/10 text-accent';
                      } else if (isSelected) {
                        stateClasses = 'border-red-400/60 bg-red-400/10 text-red-300';
                      } else {
                        stateClasses = 'border-white/10 bg-white/5 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selected !== null}
                        className={`rounded-xl border px-4 py-4 font-mono text-lg text-text-primary transition-colors ${stateClasses}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {phase === 'finished' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <Brain className="mx-auto text-accent" size={32} />
                <p className="mt-4 font-display text-3xl font-semibold text-text-primary">
                  {percentage}%
                </p>
                <p className="mt-2 text-text-muted">
                  {correctCount} / {questionCount} correct — accuracy and speed combined
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {percentage >= 90
                    ? 'Outstanding — fast and accurate.'
                    : percentage >= 70
                    ? 'Solid run — nice work.'
                    : 'Give it another go.'}
                </p>
                <button
                  onClick={restart}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-medium text-base-deep transition-shadow hover:shadow-lg hover:shadow-accent/30"
                >
                  <RefreshCw size={16} />
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}