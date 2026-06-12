import { projects } from '@/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Showcase() {
  return (
    <section id="showcase" className="relative w-full bg-base px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Selected Work"
          title="Things I've built end-to-end"
          description="From algorithmic systems to full production-style apps."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-muted">Projects loading...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
