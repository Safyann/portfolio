import type { InstrumentKind, TradeSide } from '../model/types';

const moneyFormatter = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const integerFormatter = new Intl.NumberFormat('ru-RU');

const SIDE_LABELS: Record<TradeSide, string> = { buy: 'Покупка', sell: 'Продажа' };

export function formatTime(seconds: number): string {
  const total = Math.floor(seconds) % 86_400;
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];

  return parts.map((part) => String(part).padStart(2, '0')).join(':');
}

export function formatPrice(price: number, kind: InstrumentKind): string {
  return `${moneyFormatter.format(price)} ${kind === 'bond' ? '%' : '₽'}`;
}

export function formatMoney(amount: number): string {
  return moneyFormatter.format(amount);
}

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatSide(side: TradeSide): string {
  return SIDE_LABELS[side];
}
