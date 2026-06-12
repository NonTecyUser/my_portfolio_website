// components/ui/SectionHeading.jsx
export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary sm:text-4xl">{title}</h2>
      <p className="mt-3 text-text-muted">{description}</p>
    </div>
  );
}