import type { Metadata, Viewport } from 'next';
import { Golos_Text } from 'next/font/google';
import type { ReactNode } from 'react';

import { SITE } from '@/shared/config';
import '@/shared/styles/global.scss';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-golos',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary',
    title: SITE.title,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f110f' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={golos.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
