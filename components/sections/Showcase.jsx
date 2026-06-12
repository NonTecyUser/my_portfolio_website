import { projects } from '@/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Showcase() {
  return (
    <section id="showcase" className="bg-base px-6 py-24 md:px-12 lg:px-20">
      <SectionHeading
        eyebrow="Selected Work"
        title="Things I've built end-to-end"
        description="From algorithmic systems to full production-style apps."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}