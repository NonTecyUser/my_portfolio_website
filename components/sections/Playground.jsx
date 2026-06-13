'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Brain, Pause } from 'lucide-react';
import QuizSettings from '@/components/ui/QuizSettings';
import QuizTimer from '@/components/ui/QuizTimer';
import Leaderboard from '@/components/ui/Leaderboard';

const OPERATORS = ['+', '-', '×'];
const IDLE_LIMIT_MS = 60000; // 1 minute

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

// Speed bonus applied to EVERY correct answer, based on total quiz time.
// Thresholds scale with question count (8s / 12s are calibrated for 10 questions).
function getTimeBonus(totalSeconds, questionCount) {
  const fast = questionCount * 0.8; // e.g. 8s for 10 questions
  const ok = questionCount * 1.2; // e.g. 12s for 10 questions
  if (totalSeconds <= fast) return 0.5;
  if (totalSeconds <= ok) return 0.35;
  return 0.25;
}

export default function Playground() {
  const [phase, setPhase] = useState('settings'); // settings | playing | paused | finished
  const [questionCount, setQuestionCount] = useState(10);

  const [question, setQuestion] = useState(null);
  const [round, setRound] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);

  const [pausedMs, setPausedMs] = useState(0);
  const [result, setResult] = useState(null); // { percentage, totalSeconds, timeBonus }
  const [previousBest, setPreviousBest] = useState(null); // record that existed BEFORE this run
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  const quizStartRef = useRef(null);
  const lastActivityRef = useRef(null);
  const pauseStartRef = useRef(null);

  // Idle watcher — pauses the quiz after IDLE_LIMIT_MS of no interaction.
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_LIMIT_MS) {
        pauseStartRef.current = Date.now();
        setPhase('paused');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  function loadBest(count) {
    const key = `mathquiz-best-${count}`;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function startQuiz() {
    setQuestion(generateQuestion());
    setRound(1);
    setCorrectCount(0);
    setSelected(null);
    setPausedMs(0);
    setResult(null);
    setIsNewRecord(false);
    setNameSaved(false);
    setNameInput('');
    setPreviousBest(loadBest(questionCount));
    quizStartRef.current = Date.now();
    lastActivityRef.current = Date.now();
    setPhase('playing');
  }

  function resumeQuiz() {
    setPausedMs((p) => p + (Date.now() - pauseStartRef.current));
    lastActivityRef.current = Date.now();
    setPhase('playing');
  }

  const finishQuiz = useCallback(
    (finalCorrectCount) => {
      const totalSeconds = (Date.now() - quizStartRef.current - pausedMs) / 1000;
      const timeBonus = getTimeBonus(totalSeconds, questionCount);
      const finalScore = finalCorrectCount * (0.5 + timeBonus);
      const percentage = Math.round((finalScore / questionCount) * 100);

      setResult({ percentage, totalSeconds, timeBonus });

      const best = loadBest(questionCount);
      setPreviousBest(best);
      setIsNewRecord(!best || percentage > best.percentage);
      setPhase('finished');
    },
    [pausedMs, questionCount]
  );

  const handleAnswer = useCallback(
    (option) => {
      if (selected !== null) return;
      lastActivityRef.current = Date.now();
      setSelected(option);

      const isCorrect = option === question.answer;
      const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
      if (isCorrect) setCorrectCount(nextCorrect);

      setTimeout(() => {
        if (round >= questionCount) {
          finishQuiz(nextCorrect);
        } else {
          setRound((r) => r + 1);
          setQuestion(generateQuestion());
          setSelected(null);
        }
      }, 500);
    },
    [selected, question, round, questionCount, correctCount, finishQuiz]
  );

  function saveRecord() {
    if (!nameInput.trim() || !result) return;
    const key = `mathquiz-best-${questionCount}`;
    const newRecord = { name: nameInput.trim(), percentage: result.percentage };
    try {
      localStorage.setItem(key, JSON.stringify(newRecord));
    } catch {
      /* ignore storage errors */
    }
    setNameSaved(true);
  }

  function restart() {
    setPhase('settings');
    setQuestion(null);
  }

  // Record shown in the leaderboard panel: the freshly-saved one if the
  // player just set a new record, otherwise whatever was on record before.
  const displayedRecord = nameSaved
    ? { name: nameInput.trim(), percentage: result.percentage }
    : previousBest;

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
          Half your score is accuracy, half is how fast you finish the whole quiz.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          {/* Persistent timer header — stays mounted across question changes
              so it never visibly resets, only the question card animates. */}
          {(phase === 'playing' || phase === 'paused') && (
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-text-muted">
                Question {Math.min(round, questionCount)} / {questionCount}
              </span>
              <QuizTimer
                startTime={quizStartRef.current}
                pausedMs={pausedMs}
                frozen={phase === 'paused'}
              />
            </div>
          )}

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
                <p className="text-center font-display text-4xl font-semibold text-text-primary sm:text-5xl">
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

            {phase === 'paused' && (
              <motion.div
                key="paused"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <Pause className="text-accent" size={28} />
                <p className="mt-4 font-display text-xl font-semibold text-text-primary">
                  Paused — no activity for 1 minute
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  This time won't count toward your score.
                </p>
                <button
                  onClick={resumeQuiz}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-medium text-base-deep transition-shadow hover:shadow-lg hover:shadow-accent/30"
                >
                  Resume
                </button>
              </motion.div>
            )}

            {phase === 'finished' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 sm:grid-cols-[1fr_180px]"
              >
                <div className="text-center sm:text-left">
                  <Brain className="mx-auto text-accent sm:mx-0" size={28} />
                  <p className="mt-4 font-display text-3xl font-semibold text-text-primary">
                    {result.percentage}%
                  </p>
                  <p className="mt-2 text-text-muted">
                    {correctCount} / {questionCount} correct · finished in{' '}
                    {result.totalSeconds.toFixed(1)}s
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {result.percentage >= 90
                      ? 'Outstanding — fast and accurate.'
                      : result.percentage >= 70
                      ? 'Solid run — nice work.'
                      : 'Give it another go.'}
                  </p>

                  {isNewRecord && !nameSaved && (
                    <div className="mt-5 rounded-xl border border-accent/40 bg-accent/5 p-4">
                      <p className="text-sm font-medium text-accent">
                        New high score for {questionCount} questions! Enter your name:
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Your name"
                          maxLength={24}
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50"
                        />
                        <button
                          onClick={saveRecord}
                          disabled={!nameInput.trim()}
                          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-base-deep disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={restart}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-text-primary transition-colors hover:bg-white/10"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
                </div>

                <Leaderboard
                  questionCount={questionCount}
                  record={displayedRecord}
                  isNewRecord={isNewRecord}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
