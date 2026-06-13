import Hero from '@/components/sections/Hero';
import Showcase from '@/components/sections/Showcase';
import Playground from '@/components/sections/Playground';

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden">
      <Hero />
      <Showcase /> 
      <Playground />
    </main>
  );
}
