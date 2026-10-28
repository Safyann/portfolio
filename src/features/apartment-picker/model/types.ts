export const ROOM_TYPES = ['studio', '1', '2', '3', '4'] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const SORT_ORDERS = ['price_asc', 'price_desc', 'area_asc', 'area_desc', 'completion_asc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export type Project = {
  id: string;
  name: string;
  district: string;
};

// Квартал сдачи в формате 2027-Q3 — сравнивается как строка.
export type CompletionQuarter = `${number}-Q${1 | 2 | 3 | 4}`;

export type Apartment = {
  id: string;
  projectId: string;
  building: number;
  floor: number;
  floorsTotal: number;
  rooms: RoomType;
  area: number;
  price: number;
  completion: CompletionQuarter;
};

export type NumberRange = {
  min?: number;
  max?: number;
};

export type PickerFilters = {
  price: NumberRange;
  area: NumberRange;
  floor: NumberRange;
  rooms: readonly RoomType[];
  projects: readonly string[];
  completionBy?: CompletionQuarter;
  sort: SortOrder;
};
