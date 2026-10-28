import {
  ROOM_TYPES,
  SORT_ORDERS,
  type Apartment,
  type CompletionQuarter,
  type NumberRange,
  type PickerFilters,
  type RoomType,
  type SortOrder,
} from '../model/types';

export const DEFAULT_SORT: SortOrder = 'price_asc';

export const DEFAULT_FILTERS: PickerFilters = {
  price: {},
  area: {},
  floor: {},
  rooms: [],
  projects: [],
  sort: DEFAULT_SORT,
};

// Цена в URL — в миллионах рублей, чтобы ссылка оставалась читаемой: ?price_max=60
const RUB_IN_MILLION = 1_000_000;

const PARAM = {
  PRICE_MIN: 'price_min',
  PRICE_MAX: 'price_max',
  AREA_MIN: 'area_min',
  AREA_MAX: 'area_max',
  FLOOR_MIN: 'floor_min',
  FLOOR_MAX: 'floor_max',
  ROOMS: 'rooms',
  PROJECTS: 'project',
  COMPLETION_BY: 'by',
  SORT: 'sort',
} as const;

const COMPLETION_PATTERN = /^\d{4}-Q[1-4]$/;

function parsePositiveNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseList<T extends string>(value: string | null, allowed: readonly T[]): T[] {
  if (!value) {
    return [];
  }

  const allowedSet = new Set<string>(allowed);
  const unique = new Set(value.split(',').filter((item) => allowedSet.has(item)));

  return allowed.filter((item) => unique.has(item));
}

// Округляем до рубля и до сотых миллиона, чтобы в URL не попадали артефакты float вроде 12.300000000000001.
function millionsToRub(millions: number | undefined): number | undefined {
  return millions === undefined ? undefined : Math.round(millions * RUB_IN_MILLION);
}

function rubToMillions(rub: number | undefined): number | undefined {
  return rub === undefined ? undefined : Math.round((rub / RUB_IN_MILLION) * 100) / 100;
}

function isSortOrder(value: string | null): value is SortOrder {
  return value !== null && (SORT_ORDERS as readonly string[]).includes(value);
}

function isCompletionQuarter(value: string | null): value is CompletionQuarter {
  return value !== null && COMPLETION_PATTERN.test(value);
}

// Если «от» больше «до», при фильтрации меняем их местами, а не показываем пустой результат.
// В URL и полях ввода остаётся то, что ввёл пользователь, — иначе значения перескакивали бы во время набора.
function normalizeRange(range: NumberRange): NumberRange {
  const { min, max } = range;

  if (min !== undefined && max !== undefined && min > max) {
    return { min: max, max: min };
  }

  return range;
}

export function parseFilters(params: URLSearchParams, knownProjectIds: readonly string[]): PickerFilters {
  const priceMinMillions = parsePositiveNumber(params.get(PARAM.PRICE_MIN));
  const priceMaxMillions = parsePositiveNumber(params.get(PARAM.PRICE_MAX));
  const sortParam = params.get(PARAM.SORT);
  const completionParam = params.get(PARAM.COMPLETION_BY);

  return {
    price: {
      min: millionsToRub(priceMinMillions),
      max: millionsToRub(priceMaxMillions),
    },
    area: {
      min: parsePositiveNumber(params.get(PARAM.AREA_MIN)),
      max: parsePositiveNumber(params.get(PARAM.AREA_MAX)),
    },
    floor: {
      min: parsePositiveNumber(params.get(PARAM.FLOOR_MIN)),
      max: parsePositiveNumber(params.get(PARAM.FLOOR_MAX)),
    },
    rooms: parseList(params.get(PARAM.ROOMS), ROOM_TYPES),
    projects: parseList(params.get(PARAM.PROJECTS), knownProjectIds),
    completionBy: isCompletionQuarter(completionParam) ? completionParam : undefined,
    sort: isSortOrder(sortParam) ? sortParam : DEFAULT_SORT,
  };
}

function setNumber(params: URLSearchParams, key: string, value: number | undefined) {
  if (value !== undefined) {
    params.set(key, String(value));
  }
}

export function serializeFilters(filters: PickerFilters): string {
  const params = new URLSearchParams();

  setNumber(params, PARAM.PRICE_MIN, rubToMillions(filters.price.min));
  setNumber(params, PARAM.PRICE_MAX, rubToMillions(filters.price.max));
  setNumber(params, PARAM.AREA_MIN, filters.area.min);
  setNumber(params, PARAM.AREA_MAX, filters.area.max);
  setNumber(params, PARAM.FLOOR_MIN, filters.floor.min);
  setNumber(params, PARAM.FLOOR_MAX, filters.floor.max);

  if (filters.rooms.length > 0) {
    params.set(PARAM.ROOMS, filters.rooms.join(','));
  }

  if (filters.projects.length > 0) {
    params.set(PARAM.PROJECTS, filters.projects.join(','));
  }

  if (filters.completionBy) {
    params.set(PARAM.COMPLETION_BY, filters.completionBy);
  }

  if (filters.sort !== DEFAULT_SORT) {
    params.set(PARAM.SORT, filters.sort);
  }

  // Запятая в значениях допустима в query — оставляем её читаемой: ?rooms=1,2 вместо ?rooms=1%2C2
  return params.toString().replace(/%2C/gi, ',');
}

function isInRange(value: number, range: NumberRange): boolean {
  const { min, max } = normalizeRange(range);

  if (min !== undefined && value < min) {
    return false;
  }

  return max === undefined || value <= max;
}

function matchesWithoutRooms(apartment: Apartment, filters: PickerFilters): boolean {
  if (filters.projects.length > 0 && !filters.projects.includes(apartment.projectId)) {
    return false;
  }

  if (filters.completionBy && apartment.completion > filters.completionBy) {
    return false;
  }

  return (
    isInRange(apartment.price, filters.price) &&
    isInRange(apartment.area, filters.area) &&
    isInRange(apartment.floor, filters.floor)
  );
}

function matches(apartment: Apartment, filters: PickerFilters): boolean {
  if (filters.rooms.length > 0 && !filters.rooms.includes(apartment.rooms)) {
    return false;
  }

  return matchesWithoutRooms(apartment, filters);
}

const COMPARATORS: Record<SortOrder, (left: Apartment, right: Apartment) => number> = {
  price_asc: (left, right) => left.price - right.price,
  price_desc: (left, right) => right.price - left.price,
  area_asc: (left, right) => left.area - right.area,
  area_desc: (left, right) => right.area - left.area,
  completion_asc: (left, right) => left.completion.localeCompare(right.completion) || left.price - right.price,
};

export function applyFilters(apartments: readonly Apartment[], filters: PickerFilters): Apartment[] {
  return apartments.filter((apartment) => matches(apartment, filters)).sort(COMPARATORS[filters.sort]);
}

// Сколько квартир найдётся при выборе каждого типа — с учётом остальных фильтров, но без фильтра по комнатам.
export function countByRooms(apartments: readonly Apartment[], filters: PickerFilters): Record<RoomType, number> {
  const counts = Object.fromEntries(ROOM_TYPES.map((roomType) => [roomType, 0])) as Record<RoomType, number>;

  for (const apartment of apartments) {
    if (matchesWithoutRooms(apartment, filters)) {
      counts[apartment.rooms] += 1;
    }
  }

  return counts;
}

export function getBounds(apartments: readonly Apartment[], select: (apartment: Apartment) => number) {
  const values = apartments.map(select);

  return { min: Math.min(...values), max: Math.max(...values) };
}

export function hasActiveFilters(filters: PickerFilters): boolean {
  return serializeFilters({ ...filters, sort: DEFAULT_SORT }) !== '';
}
