import type { Metadata } from 'next';

import { OPEN_GRAPH_BASE, SITE } from '@/shared/config';
import { Approach } from '@/widgets/approach';
import { FeaturedCases } from '@/widgets/cases-list';
import { Contacts } from '@/widgets/contacts';
import { Hero } from '@/widgets/hero';
import { SideProjects } from '@/widgets/side-projects';
import { TechStack } from '@/widgets/tech-stack';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: SITE.title,
    description: SITE.description,
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCases />
      <SideProjects />
      <Approach />
      <TechStack />
      <Contacts />
    </>
  );
}
