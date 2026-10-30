import type { MetadataRoute } from 'next';

import { CASES } from '@/entities/case';
import { SITE } from '@/shared/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/', '/cases/', '/demo/', '/demo/picker/', '/demo/trades/', '/demo/builder/'];
  const casePaths = CASES.map((caseStudy) => `/cases/${caseStudy.slug}/`);

  return [...staticPaths, ...casePaths].map((path) => ({ url: `${SITE.url}${path}` }));
}
