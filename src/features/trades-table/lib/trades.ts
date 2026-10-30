import { createRandom, pick } from '@/shared/lib';

import type { Instrument, InstrumentKind, Trade } from '../model/types';

// Инструменты вымышленные: тикеры и названия придуманы, к реальным эмитентам отношения не имеют.
export const INSTRUMENTS: readonly Instrument[] = [
  { ticker: 'СЕВР', name: 'Северный металл', kind: 'share', startPrice: 182.4 },
  { ticker: 'ЛИТН', name: 'Литейные заводы', kind: 'share', startPrice: 64.15 },
  { ticker: 'НБРЖ', name: 'Набережная девелопмент', kind: 'share', startPrice: 1240 },
  { ticker: 'ВЛГА', name: 'Волга энерго', kind: 'share', startPrice: 38.65 },
  { ticker: 'КМСТ', name: 'Камский стан', kind: 'share', startPrice: 512.8 },
  { ticker: 'ТЛМС', name: 'Телемост', kind: 'share', startPrice: 96.3 },
  { ticker: 'СЕВР-01', name: 'Северный металл, выпуск 01', kind: 'bond', startPrice: 99.42 },
  { ticker: 'НБРЖ-02', name: 'Набережная девелопмент, выпуск 02', kind: 'bond', startPrice: 101.15 },
  { ticker: 'ВЛГА-03', name: 'Волга энерго, выпуск 03', kind: 'bond', startPrice: 97.6 },
  { ticker: 'ТЛМС-01', name: 'Телемост, выпуск 01', kind: 'bond', startPrice: 100.05 },
];

export const INSTRUMENT_NAMES: ReadonlyMap<string, string> = new Map(
  INSTRUMENTS.map((instrument) => [instrument.ticker, instrument.name])
);

export const BOND_NOMINAL_RUB = 1000;
export const INITIAL_TRADES_COUNT = 50_000;

const TRADES_SEED = 20261031;
const SESSION_START_SECONDS = 10 * 3600;
// Средний интервал между сделками подобран так, чтобы 50 000 сделок заняли основную сессию.
const AVERAGE_GAP_SECONDS = 0.6;
// Облигации за день двигаются на доли процента, акции — на единицы процентов.
const MAX_PRICE_STEP: Record<InstrumentKind, number> = { share: 0.001, bond: 0.0001 };
const MAX_QUANTITY = 1000;

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export type TradeGenerator = () => Trade;

// Один генератор и для начальной выгрузки, и для потока: поток продолжает те же цены и время.
export function createTradeGenerator(seed: number = TRADES_SEED): TradeGenerator {
  const random = createRandom(seed);
  const prices = new Map(INSTRUMENTS.map((instrument) => [instrument.ticker, instrument.startPrice]));
  let time = SESSION_START_SECONDS;
  let id = 0;

  return () => {
    const instrument = pick(INSTRUMENTS, random);
    const previousPrice = prices.get(instrument.ticker) ?? instrument.startPrice;
    // Случайное блуждание: каждая сделка немного сдвигает цену вверх или вниз.
    const step = (random() * 2 - 1) * MAX_PRICE_STEP[instrument.kind];
    const price = Math.max(0.01, roundMoney(previousPrice * (1 + step)));
    // Мелких сделок больше, чем крупных.
    const quantity = Math.max(1, Math.ceil(random() ** 3 * MAX_QUANTITY));
    const amount =
      instrument.kind === 'bond'
        ? roundMoney((price / 100) * BOND_NOMINAL_RUB * quantity)
        : roundMoney(price * quantity);

    prices.set(instrument.ticker, price);
    time = Math.round((time + random() * AVERAGE_GAP_SECONDS * 2) * 1000) / 1000;
    id += 1;

    return {
      id,
      time,
      ticker: instrument.ticker,
      kind: instrument.kind,
      side: random() < 0.5 ? 'buy' : 'sell',
      price,
      quantity,
      amount,
    };
  };
}

export function takeTrades(next: TradeGenerator, count: number): Trade[] {
  return Array.from({ length: count }, () => next());
}
