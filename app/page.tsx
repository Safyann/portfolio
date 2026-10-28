import { Approach } from '@/widgets/approach';
import { FeaturedCases } from '@/widgets/cases-list';
import { Contacts } from '@/widgets/contacts';
import { DemoTeaser } from '@/widgets/demo-teaser';
import { Hero } from '@/widgets/hero';
import { SideProjects } from '@/widgets/side-projects';
import { TechStack } from '@/widgets/tech-stack';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCases />
      <DemoTeaser />
      <SideProjects />
      <Approach />
      <TechStack />
      <Contacts />
    </>
  );
}
