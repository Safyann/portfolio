import { formatPrice, formatTime } from '../lib/format';
import { DEFAULT_FILTERS, filterTrades, sortTrades, toggleSort } from '../lib/table';
import { createTradeGenerator, INSTRUMENT_NAMES, takeTrades } from '../lib/trades';
import { getVirtualWindow } from '../lib/virtual-window';
import type { Trade } from '../model/types';

function trade(overrides: Partial<Trade>): Trade {
  return {
    id: 1,
    time: 36_000,
    ticker: 'СЕВР',
    kind: 'share',
    side: 'buy',
    price: 100,
    quantity: 1,
    amount: 100,
    ...overrides,
  };
}

describe('createTradeGenerator', () => {
  it('детерминирован: одинаковый seed — одинаковые сделки', () => {
    expect(takeTrades(createTradeGenerator(1), 50)).toEqual(takeTrades(createTradeGenerator(1), 50));
  });

  it('выдаёт сделки по порядку времени и с растущими id', () => {
    const trades = takeTrades(createTradeGenerator(), 2000);

    trades.slice(1).forEach((current, index) => {
      const previous = trades[index] as Trade;
      expect(current.time).toBeGreaterThanOrEqual(previous.time);
      expect(current.id).toBe(previous.id + 1);
    });
  });

  it('считает сумму облигации от номинала, акции — от цены', () => {
    const trades = takeTrades(createTradeGenerator(), 500);
    const bond = trades.find((item) => item.kind === 'bond') as Trade;
    const share = trades.find((item) => item.kind === 'share') as Trade;

    expect(bond.amount).toBeCloseTo((bond.price / 100) * 1000 * bond.quantity, 2);
    expect(share.amount).toBeCloseTo(share.price * share.quantity, 2);
  });

  it('продолжает поток с того же места, где закончилась выгрузка', () => {
    const generator = createTradeGenerator(7);
    const initial = takeTrades(generator, 10);
    const streamed = generator();

    expect(streamed.id).toBe(11);
    expect(streamed.time).toBeGreaterThanOrEqual((initial.at(-1) as Trade).time);
  });
});

describe('filterTrades', () => {
  const trades = [
    trade({ id: 1, ticker: 'СЕВР', kind: 'share', side: 'buy' }),
    trade({ id: 2, ticker: 'СЕВР-01', kind: 'bond', side: 'sell' }),
    trade({ id: 3, ticker: 'ТЛМС', kind: 'share', side: 'sell' }),
  ];

  it('без фильтров возвращает всё', () => {
    expect(filterTrades(trades, DEFAULT_FILTERS, INSTRUMENT_NAMES)).toHaveLength(3);
  });

  it('фильтрует по типу инструмента и направлению', () => {
    const result = filterTrades(trades, { ...DEFAULT_FILTERS, kind: 'share', side: 'sell' }, INSTRUMENT_NAMES);

    expect(result.map((item) => item.id)).toEqual([3]);
  });

  it('ищет по тикеру и по названию эмитента без учёта регистра', () => {
    expect(filterTrades(trades, { ...DEFAULT_FILTERS, query: 'севр' }, INSTRUMENT_NAMES)).toHaveLength(2);
    expect(filterTrades(trades, { ...DEFAULT_FILTERS, query: '  телемост ' }, INSTRUMENT_NAMES)).toHaveLength(1);
  });
});

describe('sortTrades', () => {
  const trades = [
    trade({ id: 1, time: 1, price: 30, ticker: 'ЛИТН' }),
    trade({ id: 2, time: 2, price: 10, ticker: 'ВЛГА' }),
    trade({ id: 3, time: 3, price: 30, ticker: 'СЕВР' }),
  ];

  it('по времени — порядок поступления или обратный', () => {
    expect(sortTrades(trades, { key: 'time', direction: 'asc' }).map((item) => item.id)).toEqual([1, 2, 3]);
    expect(sortTrades(trades, { key: 'time', direction: 'desc' }).map((item) => item.id)).toEqual([3, 2, 1]);
  });

  it('при равных значениях ставит свежие сделки выше', () => {
    expect(sortTrades(trades, { key: 'price', direction: 'desc' }).map((item) => item.id)).toEqual([3, 1, 2]);
    expect(sortTrades(trades, { key: 'price', direction: 'asc' }).map((item) => item.id)).toEqual([2, 3, 1]);
  });

  it('сортирует текст по алфавиту', () => {
    expect(sortTrades(trades, { key: 'ticker', direction: 'asc' }).map((item) => item.ticker)).toEqual([
      'ВЛГА',
      'ЛИТН',
      'СЕВР',
    ]);
  });

  it('не меняет исходный массив', () => {
    const ids = trades.map((item) => item.id);

    sortTrades(trades, { key: 'time', direction: 'desc' });
    sortTrades(trades, { key: 'price', direction: 'asc' });

    expect(trades.map((item) => item.id)).toEqual(ids);
  });
});

describe('toggleSort', () => {
  it('новая колонка: числа — по убыванию, текст — по возрастанию', () => {
    expect(toggleSort({ key: 'time', direction: 'desc' }, 'amount')).toEqual({ key: 'amount', direction: 'desc' });
    expect(toggleSort({ key: 'time', direction: 'desc' }, 'ticker')).toEqual({ key: 'ticker', direction: 'asc' });
  });

  it('та же колонка — меняет направление', () => {
    expect(toggleSort({ key: 'price', direction: 'desc' }, 'price')).toEqual({ key: 'price', direction: 'asc' });
  });
});

describe('getVirtualWindow', () => {
  const base = { rowHeight: 40, viewportHeight: 400, rowCount: 1000, overscan: 5 };

  it('в начале списка рисует видимые строки и запас снизу', () => {
    expect(getVirtualWindow({ ...base, scrollTop: 0 })).toEqual({
      start: 0,
      end: 15,
      paddingTop: 0,
      paddingBottom: 985 * 40,
    });
  });

  it('в середине держит запас с обеих сторон, а высота всего списка не меняется', () => {
    const window = getVirtualWindow({ ...base, scrollTop: 4000 });

    expect(window).toMatchObject({ start: 95, end: 115 });
    expect(window.paddingTop + (window.end - window.start) * 40 + window.paddingBottom).toBe(1000 * 40);
  });

  it('у конца списка не выходит за последнюю строку', () => {
    expect(getVirtualWindow({ ...base, scrollTop: 40_000 })).toMatchObject({ end: 1000, paddingBottom: 0 });
  });

  it('прокрутка дальше конца после сужения фильтра не даёт start > end', () => {
    const window = getVirtualWindow({ ...base, rowCount: 3, scrollTop: 40_000 });

    expect(window.start).toBeLessThanOrEqual(window.end);
    expect(window.paddingBottom).toBe(0);
  });

  it('пустой список', () => {
    expect(getVirtualWindow({ ...base, rowCount: 0, scrollTop: 0 })).toEqual({
      start: 0,
      end: 0,
      paddingTop: 0,
      paddingBottom: 0,
    });
  });
});

describe('format', () => {
  it('время — часы:минуты:секунды', () => {
    expect(formatTime(10 * 3600 + 5 * 60 + 7.9)).toBe('10:05:07');
  });

  it('цена облигации — в процентах, акции — в рублях', () => {
    expect(formatPrice(99.5, 'bond')).toMatch(/^99,50\s%$/);
    expect(formatPrice(1240, 'share')).toMatch(/^1\s240,00\s₽$/);
  });
});
