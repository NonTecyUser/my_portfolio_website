'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';

/**
 * Project shape expected (see data/projects.ts):
 * {
 *   title: string,
 *   category: string,           // e.g. "Search & Algorithms"
 *   description: string,
 *   highlights: string[],       // technical depth bullets
 *   tech: string[],              // stack chips
 *   links: { github?: string, demo?: string | null }
 * }
 */
export default function ProjectCard({ project }) {
  const { title, category, description, highlights, tech, links } = project;
  const cardRef = useRef(null);

  // Normalized -0.5..0.5 cursor position within the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Subtle 3D tilt driven by cursor position
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  // Cursor-tracking glow position
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(94,234,212,0.15), transparent 60%)`
  );

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-accent/40 sm:p-8"
    >
      {/* Cursor-tracking glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowBackground }}
      />

      <div className="relative z-10">
        {/* Category tag + external links */}
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
            {category}
          </span>
          <div className="flex gap-3 text-text-muted">
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} source on GitHub`}
                className="transition-colors hover:text-text-primary"
              >
                <Code2 size={18} />
              </a>
            )}
            {links?.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} live demo`}
                className="transition-colors hover:text-text-primary"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Title + description */}
        <h3 className="mt-5 font-display text-2xl font-semibold text-text-primary sm:text-[1.65rem]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-[15px]">
          {description}
        </p>

        {/* Technical depth highlights */}
        {highlights?.length > 0 && (
          <ul className="mt-5 space-y-2 border-l border-white/10 pl-4">
            {highlights.map((point, i) => (
              <li key={i} className="text-sm leading-relaxed text-text-muted">
                <span className="text-accent">▸</span> {point}
              </li>
            ))}
          </ul>
        )}

        {/* Tech stack chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tech.map((item) => (
            <span
              key={item}
              className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
