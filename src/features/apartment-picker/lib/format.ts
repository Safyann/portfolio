import type { CompletionQuarter, RoomType } from '../model/types';

const ROOM_LABELS: Record<RoomType, string> = {
  studio: 'Студия',
  '1': '1-комнатная',
  '2': '2-комнатная',
  '3': '3-комнатная',
  '4': '4-комнатная',
};

const ROOM_SHORT_LABELS: Record<RoomType, string> = {
  studio: 'Ст',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4+',
};

const priceFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
const areaFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

export function formatRooms(rooms: RoomType): string {
  return ROOM_LABELS[rooms];
}

export function formatRoomsShort(rooms: RoomType): string {
  return ROOM_SHORT_LABELS[rooms];
}

export function formatPriceMillions(priceRub: number): string {
  return `${priceFormatter.format(priceRub / 1_000_000)} млн ₽`;
}

export function formatArea(area: number): string {
  return `${areaFormatter.format(area)} м²`;
}

export function formatCompletion(completion: CompletionQuarter): string {
  const [year, quarter] = completion.split('-Q');

  return `${quarter} кв. ${year}`;
}

export function formatApartmentsCount(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} квартир`;
  }

  if (lastDigit === 1) {
    return `${count} квартира`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} квартиры`;
  }

  return `${count} квартир`;
}
