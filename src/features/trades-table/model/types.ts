export type InstrumentKind = 'share' | 'bond';

export type TradeSide = 'buy' | 'sell';

export type Instrument = {
  ticker: string;
  name: string;
  kind: InstrumentKind;
  // Акции — в рублях за штуку, облигации — в процентах от номинала.
  startPrice: number;
};

export type Trade = {
  id: number;
  // Секунды от начала суток.
  time: number;
  ticker: string;
  kind: InstrumentKind;
  side: TradeSide;
  price: number;
  quantity: number;
  // Сумма сделки в рублях.
  amount: number;
};

export type SortKey = 'time' | 'ticker' | 'side' | 'price' | 'quantity' | 'amount';

export type SortDirection = 'asc' | 'desc';

export type TradeSort = {
  key: SortKey;
  direction: SortDirection;
};

export type TradeFilters = {
  kind: InstrumentKind | 'all';
  side: TradeSide | 'all';
  query: string;
};
