import Hero from '@/components/sections/Hero';
import Showcase from '@/components/sections/Showcase';
import Playground from '@/components/sections/Playground';


export default function Home() {
  return (
    <main>
      <Hero />
      {/* Showcase, About, Skills, Contact sections go here as you build them */}

      <Showcase /> 
      <Playground/>
    </main>
  );
}