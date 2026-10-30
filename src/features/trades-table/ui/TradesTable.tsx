'use client';

import { type CSSProperties, type UIEvent, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';

import { formatInteger, formatMoney, formatPrice, formatSide, formatTime } from '../lib/format';
import { DEFAULT_FILTERS, DEFAULT_SORT, filterTrades, sortTrades, toggleSort } from '../lib/table';
import {
  BOND_NOMINAL_RUB,
  createTradeGenerator,
  INITIAL_TRADES_COUNT,
  INSTRUMENT_NAMES,
  takeTrades,
} from '../lib/trades';
import { getVirtualWindow } from '../lib/virtual-window';
import type { SortDirection, SortKey, Trade, TradeFilters, TradeSort } from '../model/types';
import styles from './TradesTable.module.scss';

const ROW_HEIGHT = 44;
const OVERSCAN = 8;
// До первого замера высоты: столько строк попадёт в статический HTML.
const INITIAL_VIEWPORT_HEIGHT = 600;
const STREAM_INTERVAL_MS = 1000;
const MAX_STREAM_BATCH = 3;

type Column = {
  key: SortKey;
  label: string;
  isNumeric?: boolean;
  render: (trade: Trade) => string;
};

const COLUMNS: readonly Column[] = [
  { key: 'time', label: 'Время', render: (trade) => formatTime(trade.time) },
  { key: 'ticker', label: 'Инструмент', render: (trade) => trade.ticker },
  { key: 'side', label: 'Направление', render: (trade) => formatSide(trade.side) },
  { key: 'price', label: 'Цена', isNumeric: true, render: (trade) => formatPrice(trade.price, trade.kind) },
  { key: 'quantity', label: 'Кол-во, шт.', isNumeric: true, render: (trade) => formatInteger(trade.quantity) },
  { key: 'amount', label: 'Сумма, ₽', isNumeric: true, render: (trade) => formatMoney(trade.amount) },
];

const ARIA_SORT: Record<SortDirection, 'ascending' | 'descending'> = { asc: 'ascending', desc: 'descending' };

const SORT_ARROWS: Record<SortDirection, string> = { asc: '↑', desc: '↓' };

const SORT_LABELS: Record<SortKey, string> = {
  time: 'времени',
  ticker: 'инструменту',
  side: 'направлению',
  price: 'цене',
  quantity: 'количеству',
  amount: 'сумме',
};

type TradesTableProps = {
  initialCount?: number;
};

export function TradesTable({ initialCount = INITIAL_TRADES_COUNT }: TradesTableProps) {
  // Генератор и начальная выгрузка создаются вместе: в StrictMode инициализатор вызывается дважды,
  // и раздельные useState получили бы выгрузку от одного генератора, а поток — от другого.
  const [{ nextTrade, initialTrades }] = useState(() => {
    const generator = createTradeGenerator();

    return { nextTrade: generator, initialTrades: takeTrades(generator, initialCount) };
  });
  const [streamedTrades, setStreamedTrades] = useState<Trade[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [filters, setFilters] = useState<TradeFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<TradeSort>(DEFAULT_SORT);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(INITIAL_VIEWPORT_HEIGHT);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Поиск по 50 000 строк не должен тормозить ввод: таблица догоняет поле с низким приоритетом.
  const deferredFilters = useDeferredValue(filters);

  const trades = useMemo(
    () => (streamedTrades.length > 0 ? initialTrades.concat(streamedTrades) : initialTrades),
    [initialTrades, streamedTrades]
  );
  const rows = useMemo(
    () => sortTrades(filterTrades(trades, deferredFilters, INSTRUMENT_NAMES), sort),
    [trades, deferredFilters, sort]
  );
  const { start, end, paddingTop, paddingBottom } = getVirtualWindow({
    scrollTop,
    viewportHeight,
    rowHeight: ROW_HEIGHT,
    rowCount: rows.length,
    overscan: OVERSCAN,
  });

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setViewportHeight(entry.contentRect.height);
      }
    });

    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      // Сделки берём вне updater: в StrictMode он вызывается дважды и сдвинул бы генератор лишний раз.
      const batch = takeTrades(nextTrade, 1 + Math.floor(Math.random() * MAX_STREAM_BATCH));

      setStreamedTrades((previous) => previous.concat(batch));
    }, STREAM_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isStreaming, nextTrade]);

  const scrollToTop = () => {
    viewportRef.current?.scrollTo({ top: 0 });
    setScrollTop(0);
  };

  const updateFilters = (patch: Partial<TradeFilters>) => {
    setFilters((previous) => ({ ...previous, ...patch }));
    scrollToTop();
  };

  const handleSort = (key: SortKey) => {
    setSort((previous) => toggleSort(previous, key));
    scrollToTop();
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const sortDirectionLabel = sort.direction === 'asc' ? 'по возрастанию' : 'по убыванию';

  return (
    <div className={styles.root} data-ui>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.label}>Тикер или эмитент</span>
          <input
            type="search"
            value={filters.query}
            placeholder="Например, СЕВР"
            onChange={(event) => updateFilters({ query: event.target.value })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Инструменты</span>
          <select
            value={filters.kind}
            onChange={(event) => updateFilters({ kind: event.target.value as TradeFilters['kind'] })}
          >
            <option value="all">Все</option>
            <option value="share">Акции</option>
            <option value="bond">Облигации</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Направление</span>
          <select
            value={filters.side}
            onChange={(event) => updateFilters({ side: event.target.value as TradeFilters['side'] })}
          >
            <option value="all">Все</option>
            <option value="buy">Покупка</option>
            <option value="sell">Продажа</option>
          </select>
        </label>
        <button
          type="button"
          className={styles.stream}
          aria-pressed={isStreaming}
          onClick={() => setIsStreaming((previous) => !previous)}
        >
          {isStreaming ? 'Остановить поток' : 'Запустить поток сделок'}
        </button>
      </div>

      {/* Во время потока счётчик меняется каждую секунду — объявлять его вслух нельзя. */}
      <p className={styles.status} aria-live={isStreaming ? 'off' : 'polite'}>
        Сделок: {formatInteger(rows.length)}
        <span className={styles.statusNote}> · в DOM {formatInteger(end - start)} строк</span>
      </p>

      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ '--row-height': `${ROW_HEIGHT}px` } as CSSProperties}
        role="region"
        aria-label="Таблица сделок"
        tabIndex={0}
        onScroll={handleScroll}
      >
        <table className={styles.table} aria-rowcount={rows.length + 1}>
          <caption className="visually-hidden">
            Сделки, отсортированные по {SORT_LABELS[sort.key]}, {sortDirectionLabel}
          </caption>
          <thead>
            <tr aria-rowindex={1}>
              {COLUMNS.map((column) => {
                const isActive = sort.key === column.key;

                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={column.isNumeric ? styles.numeric : undefined}
                    aria-sort={isActive ? ARIA_SORT[sort.direction] : undefined}
                  >
                    <button type="button" className={styles.sort} onClick={() => handleSort(column.key)}>
                      {column.label}
                      <span className={styles.arrow} aria-hidden="true">
                        {isActive ? SORT_ARROWS[sort.direction] : ''}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr className={styles.spacer} style={{ height: paddingTop }} aria-hidden="true">
                <td colSpan={COLUMNS.length} />
              </tr>
            )}
            {rows.slice(start, end).map((trade, index) => (
              <tr key={trade.id} aria-rowindex={start + index + 2}>
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      column.isNumeric ? styles.numeric : '',
                      column.key === 'side' ? styles[trade.side] : '',
                      column.key === 'ticker' ? styles.ticker : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {column.render(trade)}
                  </td>
                ))}
              </tr>
            ))}
            {paddingBottom > 0 && (
              <tr className={styles.spacer} style={{ height: paddingBottom }} aria-hidden="true">
                <td colSpan={COLUMNS.length} />
              </tr>
            )}
          </tbody>
        </table>
        {rows.length === 0 && <p className={styles.empty}>Сделок не найдено — измените фильтры.</p>}
      </div>

      <p className={styles.note}>
        Данные вымышленные. Цена облигаций — в процентах от номинала {formatInteger(BOND_NOMINAL_RUB)} ₽.
      </p>
    </div>
  );
}
