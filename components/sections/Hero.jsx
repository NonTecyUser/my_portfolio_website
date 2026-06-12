'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Code2 } from 'lucide-react';

// The terminal "session" that introduces Samir — doubles as the
// page's signature element instead of a generic gradient hero.
const TERMINAL_LINES = [
  { prompt: '$', text: 'whoami' },
  { prompt: '>', text: 'Samir Aryal — BSc CSIT, Tribhuvan University' },
  { prompt: '$', text: 'cat ./stack.json' },
  {
    prompt: '>',
    text: '["React","Next.js",".NET","Python","C++","Java","C#","Flutter","React Native"]',
  },
  { prompt: '$', text: './status.sh --check' },
  { prompt: '>', text: 'STATUS: Open to high-impact technical internships' },
];

/**
 * Types out `lines` character by character, one line at a time.
 * Kept dependency-free so it can be dropped into any client component.
 */
function useTypewriter(lines, charSpeed = 28, lineDelay = 450) {
  const [output, setOutput] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    const drafted = [];
    let timeoutId;

    const typeNext = () => {
      if (lineIndex >= lines.length) {
        setDone(true);
        return;
      }
      const { prompt, text } = lines[lineIndex];
      drafted[lineIndex] = { prompt, text: text.slice(0, charIndex + 1) };
      setOutput([...drafted]);
      charIndex += 1;

      if (charIndex > text.length) {
        lineIndex += 1;
        charIndex = 0;
        timeoutId = setTimeout(typeNext, lineDelay);
      } else {
        timeoutId = setTimeout(typeNext, charSpeed);
      }
    };

    timeoutId = setTimeout(typeNext, 600);
    return () => clearTimeout(timeoutId);
  }, [lines, charSpeed, lineDelay]);

  return { output, done };
}

export default function Hero() {
  const { output, done } = useTypewriter(TERMINAL_LINES);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-base px-6 pt-28 pb-16 md:px-12 lg:px-20">
      {/* Ambient gradient orbs — subtle depth without a 3D dependency */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-16 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-accent-warm/15 blur-[110px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Left column — identity, role, CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-text-muted backdrop-blur-md">
            BSc CSIT · Tribhuvan University
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-text-primary sm:text-6xl lg:text-7xl">
            Samir Aryal
          </h1>

          <p className="mt-4 max-w-xl font-display text-2xl font-medium text-accent sm:text-3xl">
            Aspiring AI Developer &amp; Full-Stack Engineer
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            I build systems that think and ship — from search engines with
            PageRank and clustering at their core, to production-style
            full-stack apps across web and mobile. Currently looking for a
            high-impact technical internship where I can learn fast and
            contribute from day one.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-base-deep shadow-lg shadow-accent/20 transition-shadow hover:shadow-accent/40"
            >
              <FileText size={18} />
              View Resume
            </motion.a>

            <motion.a
              href="https://github.com/NonTecyUser"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-text-primary backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <Code2 size={18} />
              GitHub
            </motion.a>
          </div>
        </motion.div>

        {/* Right column — signature terminal window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-1 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
              <span className="ml-3 font-mono text-xs text-text-muted">
                samir@portfolio — zsh
              </span>
            </div>

            <div className="min-h-[280px] p-5 font-mono text-sm leading-7 text-text-primary sm:text-[15px]">
              {output.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span
                    className={
                      line.prompt === '$' ? 'text-accent' : 'text-text-muted'
                    }
                  >
                    {line.prompt}
                  </span>
                  <span className="break-all">{line.text}</span>
                </div>
              ))}
              {!done && (
                <span className="inline-block h-4 w-2 translate-y-1 animate-pulse bg-accent" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}
