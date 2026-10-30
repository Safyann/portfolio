import { createRandom, pick } from '@/shared/lib';

import type { Apartment, CompletionQuarter, Project, RoomType } from '../model/types';

// Все данные вымышленные: названия, цены и сроки сгенерированы, к реальным проектам отношения не имеют.
export const PROJECTS: readonly Project[] = [
  { id: 'severny-park', name: 'Северный парк', district: 'Северный район' },
  { id: 'naberezhnaya', name: 'Набережная', district: 'Центр' },
  { id: 'liteyny', name: 'Литейный квартал', district: 'Исторический центр' },
];

const PROJECT_SETTINGS: Record<
  string,
  { pricePerSqmRub: number; floorsTotal: number; completions: CompletionQuarter[] }
> = {
  'severny-park': { pricePerSqmRub: 420_000, floorsTotal: 17, completions: ['2027-Q2', '2027-Q4'] },
  naberezhnaya: { pricePerSqmRub: 610_000, floorsTotal: 24, completions: ['2026-Q4', '2028-Q1'] },
  liteyny: { pricePerSqmRub: 780_000, floorsTotal: 9, completions: ['2027-Q3', '2028-Q3'] },
};

const AREA_BY_ROOMS: Record<RoomType, [number, number]> = {
  studio: [24, 34],
  '1': [36, 52],
  '2': [55, 78],
  '3': [80, 112],
  '4': [115, 165],
};

const APARTMENTS_PER_BUILDING = 34;
const BUILDINGS_PER_PROJECT = 2;
const RANDOM_SEED = 20261028;
const PRICE_ROUNDING_RUB = 10_000;

function generateApartments(): Apartment[] {
  const random = createRandom(RANDOM_SEED);
  const roomTypes = Object.keys(AREA_BY_ROOMS) as RoomType[];
  const apartments: Apartment[] = [];

  for (const project of PROJECTS) {
    const settings = PROJECT_SETTINGS[project.id];

    if (!settings) {
      continue;
    }

    for (let building = 1; building <= BUILDINGS_PER_PROJECT; building += 1) {
      const completion = settings.completions[building - 1] ?? settings.completions[0] ?? '2027-Q4';

      for (let index = 0; index < APARTMENTS_PER_BUILDING; index += 1) {
        const rooms = pick(roomTypes, random);
        const [areaMin, areaMax] = AREA_BY_ROOMS[rooms];
        const area = Math.round((areaMin + random() * (areaMax - areaMin)) * 10) / 10;
        const floor = 2 + Math.floor(random() * (settings.floorsTotal - 1));
        // Чем выше этаж, тем дороже метр — до +15% на последнем этаже.
        const floorFactor = 1 + (floor / settings.floorsTotal) * 0.15;
        const price =
          Math.round((area * settings.pricePerSqmRub * floorFactor) / PRICE_ROUNDING_RUB) * PRICE_ROUNDING_RUB;

        apartments.push({
          id: `${project.id}-${building}-${index + 1}`,
          projectId: project.id,
          building,
          floor,
          floorsTotal: settings.floorsTotal,
          rooms,
          area,
          price,
          completion,
        });
      }
    }
  }

  return apartments;
}

export const APARTMENTS: readonly Apartment[] = generateApartments();
