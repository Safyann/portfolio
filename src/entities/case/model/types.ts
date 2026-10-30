export type CaseMetric = {
  value: string;
  label: string;
};

// Скриншот публичной страницы: файлы public/cases/{name}-720.jpg и {name}-1440.jpg, кадр 1440×700.
export type CaseImage = {
  name: string;
  alt: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  employer: string;
  period: string;
  title: string;
  summary: string;
  stack: readonly string[];
  task: string;
  contributions: readonly string[];
  isFeatured: boolean;
  metric?: CaseMetric;
  team?: string;
  url?: string;
  image?: CaseImage;
  // Своя реализация похожей задачи на сайте-портфолио — с вымышленными данными.
  demo?: { href: string; label: string };
  // Почему нет скриншотов: внутренний инструмент, NDA и т. п.
  visualsNote?: string;
};

export type SideProject = {
  name: string;
  industry: string;
  employer: string;
  period: string;
  stack: readonly string[];
  summary: string;
  url?: string;
};
