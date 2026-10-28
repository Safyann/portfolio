import type { Metadata, Viewport } from 'next';
import { Golos_Text } from 'next/font/google';
import type { ReactNode } from 'react';

import { OG_IMAGE, OPEN_GRAPH_BASE, SITE } from '@/shared/config';
import { REVEAL_SCRIPT } from '@/shared/lib';
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
  metadataBase: new URL(SITE.url),
  // canonical и og:url здесь не задаём: layout наследуют все страницы, включая 404, —
  // каждая страница указывает свой адрес сама.
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: SITE.title,
    description: SITE.description,
  },
  // Без title и description: иначе страницы кейсов унаследуют их от главной. Карточка берёт их из og:*.
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE.url],
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
    // data-reveal на <html> ставит инлайн-скрипт до гидрации — отсюда suppressHydrationWarning.
    <html lang="ru" className={golos.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
