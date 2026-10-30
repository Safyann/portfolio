export type VirtualWindowInput = {
  scrollTop: number;
  viewportHeight: number;
  rowHeight: number;
  rowCount: number;
  // Сколько строк дорисовать сверху и снизу, чтобы при быстрой прокрутке не мелькали пустые кадры.
  overscan: number;
};

export type VirtualWindow = {
  start: number;
  end: number;
  paddingTop: number;
  paddingBottom: number;
};

// Какие строки рисовать: только видимые плюс запас. Остальная высота — пустые отступы,
// поэтому полоса прокрутки соответствует всему списку.
export function getVirtualWindow({
  scrollTop,
  viewportHeight,
  rowHeight,
  rowCount,
  overscan,
}: VirtualWindowInput): VirtualWindow {
  const firstVisible = Math.floor(Math.max(0, scrollTop) / rowHeight);
  const visibleCount = Math.ceil(Math.max(0, viewportHeight) / rowHeight);
  const end = Math.min(rowCount, firstVisible + visibleCount + overscan);
  const start = Math.min(Math.max(0, firstVisible - overscan), end);

  return {
    start,
    end,
    paddingTop: start * rowHeight,
    paddingBottom: (rowCount - end) * rowHeight,
  };
}
