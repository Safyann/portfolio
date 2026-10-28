import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { OG_IMAGE, SITE } from '@/shared/config';

// Картинка для превью ссылки в Telegram, hh и мессенджерах. Генерируется один раз при сборке.
// Route handler, а не opengraph-image.tsx: при статическом экспорте тот даёт файл без расширения,
// и GitHub Pages отдаёт его как application/octet-stream — Telegram такое превью не показывает.
export const dynamic = 'force-static';

const FONT_DIR = join(process.cwd(), 'node_modules/@fontsource/golos-text/files');
const FONT_WEIGHTS = [400, 500] as const;
const FONT_SUBSETS = [
  { family: 'Golos Latin', subset: 'latin' },
  { family: 'Golos Cyrillic', subset: 'cyrillic' },
] as const;

// В satori нет системных шрифтов. Латиница и кириллица — отдельные файлы, поэтому это два семейства
// с фолбэком через fontFamily: внутри одного имени satori путает начертания разных файлов.
async function loadFonts() {
  const variants = FONT_SUBSETS.flatMap(({ family, subset }) =>
    FONT_WEIGHTS.map((weight) => ({ family, subset, weight }))
  );

  return Promise.all(
    variants.map(async ({ family, subset, weight }) => ({
      name: family,
      data: await readFile(join(FONT_DIR, `golos-text-${subset}-${weight}-normal.woff`)),
      weight,
      style: 'normal' as const,
    }))
  );
}

const COLOR = {
  BG: '#ffffff',
  TEXT: '#141614',
  SECONDARY: '#545a55',
  ACCENT: '#0f6e56',
  BORDER: '#e3e6e2',
};

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: COLOR.BG,
        color: COLOR.TEXT,
        fontFamily: 'Golos Latin, Golos Cyrillic',
        borderTop: `16px solid ${COLOR.ACCENT}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 34, fontWeight: 500, color: COLOR.ACCENT }}>
          {`${SITE.role} · ${SITE.experienceYears} лет`}
        </div>
        <div style={{ marginTop: 20, fontSize: 84, fontWeight: 500, lineHeight: 1.05, letterSpacing: -2 }}>
          {SITE.name}
        </div>
        <div style={{ marginTop: 28, fontSize: 38, color: COLOR.SECONDARY }}>
          React / Next.js · Vue / Nuxt · TypeScript
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: 32,
          borderTop: `2px solid ${COLOR.BORDER}`,
          fontSize: 28,
          color: COLOR.SECONDARY,
        }}
      >
        <div style={{ display: 'flex' }}>Sminex · Московская биржа · Prinzip</div>
        <div style={{ display: 'flex', color: COLOR.ACCENT, fontWeight: 500 }}>{SITE.url.replace('https://', '')}</div>
      </div>
    </div>,
    { width: OG_IMAGE.width, height: OG_IMAGE.height, fonts: await loadFonts() }
  );
}
