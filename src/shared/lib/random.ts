// Детерминированный генератор (mulberry32): данные демо не меняются между сборками и совпадают на сервере и клиенте.
export function createRandom(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(items: readonly T[], random: () => number): T {
  const item = items[Math.floor(random() * items.length)];

  if (item === undefined) {
    throw new Error('pick() called with an empty list');
  }

  return item;
}
