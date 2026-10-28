import { APARTMENTS, PROJECTS } from '../lib/apartments';
import {
  applyFilters,
  countByRooms,
  DEFAULT_FILTERS,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
} from '../lib/filters';
import { formatApartmentsCount, formatCompletion, formatPriceMillions } from '../lib/format';
import type { Apartment, PickerFilters } from '../model/types';

const PROJECT_IDS = PROJECTS.map((project) => project.id);

const SAMPLE: Apartment[] = [
  {
    id: 'a',
    projectId: 'p1',
    building: 1,
    floor: 3,
    floorsTotal: 10,
    rooms: '1',
    area: 40,
    price: 20_000_000,
    completion: '2027-Q2',
  },
  {
    id: 'b',
    projectId: 'p1',
    building: 1,
    floor: 8,
    floorsTotal: 10,
    rooms: '2',
    area: 60,
    price: 35_000_000,
    completion: '2027-Q2',
  },
  {
    id: 'c',
    projectId: 'p2',
    building: 2,
    floor: 5,
    floorsTotal: 20,
    rooms: '3',
    area: 95,
    price: 70_000_000,
    completion: '2028-Q1',
  },
  {
    id: 'd',
    projectId: 'p2',
    building: 2,
    floor: 12,
    floorsTotal: 20,
    rooms: 'studio',
    area: 28,
    price: 15_000_000,
    completion: '2026-Q4',
  },
];

function filtersWith(overrides: Partial<PickerFilters>): PickerFilters {
  return { ...DEFAULT_FILTERS, ...overrides };
}

describe('parseFilters / serializeFilters', () => {
  it('восстанавливает те же фильтры из сериализованной строки', () => {
    const filters = filtersWith({
      price: { min: 10_000_000, max: 60_000_000 },
      area: { min: 40 },
      floor: { max: 10 },
      rooms: ['1', '2'],
      projects: ['naberezhnaya'],
      completionBy: '2027-Q4',
      sort: 'area_desc',
    });

    const query = serializeFilters(filters);

    expect(parseFilters(new URLSearchParams(query), PROJECT_IDS)).toEqual(filters);
  });

  it('хранит цену в URL в миллионах и не пишет значения по умолчанию', () => {
    expect(serializeFilters(filtersWith({ price: { max: 45_000_000 } }))).toBe('price_max=45');
    expect(serializeFilters(DEFAULT_FILTERS)).toBe('');
    expect(serializeFilters(filtersWith({ rooms: ['1', '2'] }))).toBe('rooms=1,2');
  });

  it('отбрасывает мусор из URL', () => {
    const params = new URLSearchParams(
      'price_min=abc&area_max=-5&rooms=2,9,studio,2&project=unknown&by=2027-Q7&sort=random'
    );

    expect(parseFilters(params, PROJECT_IDS)).toEqual(filtersWith({ rooms: ['studio', '2'] }));
  });

  it('меняет местами перепутанные «от» и «до»', () => {
    const filters = parseFilters(new URLSearchParams('area_min=90&area_max=50'), PROJECT_IDS);

    expect(filters.area).toEqual({ min: 50, max: 90 });
  });
});

describe('applyFilters', () => {
  it('без фильтров возвращает всё, отсортированное по цене', () => {
    expect(applyFilters(SAMPLE, DEFAULT_FILTERS).map((apartment) => apartment.id)).toEqual(['d', 'a', 'b', 'c']);
  });

  it('учитывает границы диапазонов включительно', () => {
    const result = applyFilters(SAMPLE, filtersWith({ area: { min: 40, max: 60 } }));

    expect(result.map((apartment) => apartment.id)).toEqual(['a', 'b']);
  });

  it('комбинирует комнаты, проект, этаж и срок сдачи', () => {
    const result = applyFilters(
      SAMPLE,
      filtersWith({ rooms: ['studio', '3'], projects: ['p2'], floor: { min: 6 }, completionBy: '2027-Q4' })
    );

    expect(result.map((apartment) => apartment.id)).toEqual(['d']);
  });

  it('сортирует по сроку сдачи, затем по цене', () => {
    const result = applyFilters(SAMPLE, filtersWith({ sort: 'completion_asc' }));

    expect(result.map((apartment) => apartment.id)).toEqual(['d', 'a', 'b', 'c']);
  });

  it('не мутирует исходный список', () => {
    const copy = [...SAMPLE];

    applyFilters(SAMPLE, filtersWith({ sort: 'price_desc' }));

    expect(SAMPLE).toEqual(copy);
  });
});

describe('countByRooms', () => {
  it('считает варианты без учёта выбранных комнат, но с остальными фильтрами', () => {
    const counts = countByRooms(SAMPLE, filtersWith({ rooms: ['1'], projects: ['p1'] }));

    expect(counts).toEqual({ studio: 0, '1': 1, '2': 1, '3': 0, '4': 0 });
  });
});

describe('hasActiveFilters', () => {
  it('не считает сортировку фильтром', () => {
    expect(hasActiveFilters(filtersWith({ sort: 'area_asc' }))).toBe(false);
    expect(hasActiveFilters(filtersWith({ rooms: ['2'] }))).toBe(true);
  });
});

describe('моковые данные', () => {
  it('детерминированы и согласованы', () => {
    expect(APARTMENTS).toHaveLength(204);
    expect(new Set(APARTMENTS.map((apartment) => apartment.id)).size).toBe(APARTMENTS.length);
    expect(APARTMENTS.every((apartment) => apartment.floor >= 2 && apartment.floor <= apartment.floorsTotal)).toBe(
      true
    );
  });
});

describe('format', () => {
  it('склоняет «квартира»', () => {
    expect([1, 2, 5, 11, 21, 104].map(formatApartmentsCount)).toEqual([
      '1 квартира',
      '2 квартиры',
      '5 квартир',
      '11 квартир',
      '21 квартира',
      '104 квартиры',
    ]);
  });

  it('форматирует цену и срок', () => {
    expect(formatPriceMillions(35_400_000).replace(/\s/g, ' ')).toBe('35,4 млн ₽');
    expect(formatCompletion('2027-Q3')).toBe('3 кв. 2027');
  });
});
