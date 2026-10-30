import type { Metadata } from 'next';

import { OPEN_GRAPH_BASE, SITE } from '@/shared/config';
import { Approach } from '@/widgets/approach';
import { FeaturedCases } from '@/widgets/cases-list';
import { Contacts } from '@/widgets/contacts';
import { Hero } from '@/widgets/hero';
import { SideProjects } from '@/widgets/side-projects';
import { Summary } from '@/widgets/summary';
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

// Микроразметка schema.org Person: поисковики показывают по ней карточку человека
// и лучше связывают сайт с запросами вроде «senior frontend Екатеринбург».
const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: `${SITE.role}-разработчик`,
  url: SITE.url,
  address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressCountry: 'RU' },
  knowsAbout: ['React', 'Next.js', 'Vue', 'Nuxt', 'TypeScript', 'SSR', 'UI-kit'],
  sameAs: [SITE.telegramUrl, SITE.githubUrl, ...(SITE.hhUrl ? [SITE.hhUrl] : [])],
  ...(SITE.email ? { email: `mailto:${SITE.email}` } : {}),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Данные статические, из конфига сайта; экранируем «<», чтобы строка не могла закрыть тег script.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <Summary />
      <FeaturedCases />
      <SideProjects />
      <Approach />
      <TechStack />
      <Contacts />
    </>
  );
}
