export type CaseMetric = {
  value: string;
  label: string;
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
