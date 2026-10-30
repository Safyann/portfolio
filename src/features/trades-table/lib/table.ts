import type { SortKey, Trade, TradeFilters, TradeSort } from '../model/types';

export const DEFAULT_SORT: TradeSort = { key: 'time', direction: 'desc' };

export const DEFAULT_FILTERS: TradeFilters = { kind: 'all', side: 'all', query: '' };

export function filterTrades(
  trades: readonly Trade[],
  filters: TradeFilters,
  names: ReadonlyMap<string, string>
): Trade[] {
  const query = filters.query.trim().toLocaleLowerCase('ru');

  return trades.filter((trade) => {
    if (filters.kind !== 'all' && trade.kind !== filters.kind) {
      return false;
    }

    if (filters.side !== 'all' && trade.side !== filters.side) {
      return false;
    }

    if (query === '') {
      return true;
    }

    const name = names.get(trade.ticker) ?? '';

    return trade.ticker.toLocaleLowerCase('ru').includes(query) || name.toLocaleLowerCase('ru').includes(query);
  });
}

function compareBy(key: SortKey, left: Trade, right: Trade): number {
  if (key === 'ticker' || key === 'side') {
    return left[key].localeCompare(right[key], 'ru');
  }

  return left[key] - right[key];
}

// Ожидает сделки в порядке поступления. По времени сортирует без sort(): массив уже упорядочен,
// а это основной сценарий — он не должен стоить O(n log n) на каждую сделку из потока.
export function sortTrades(trades: readonly Trade[], sort: TradeSort): Trade[] {
  if (sort.key === 'time') {
    return sort.direction === 'asc' ? [...trades] : [...trades].reverse();
  }

  const sign = sort.direction === 'asc' ? 1 : -1;

  // При равенстве свежие сделки выше — порядок стабилен и не прыгает при обновлении.
  return [...trades].sort((left, right) => sign * compareBy(sort.key, left, right) || right.id - left.id);
}

export function toggleSort(current: TradeSort, key: SortKey): TradeSort {
  if (current.key !== key) {
    // Числа и время удобнее начинать с больших значений, текст — по алфавиту.
    return { key, direction: key === 'ticker' || key === 'side' ? 'asc' : 'desc' };
  }

  return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
}
