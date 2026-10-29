'use client';

import { useMemo, useState, type ChangeEvent } from 'react';

import { APARTMENTS, PROJECTS } from '../lib/apartments';
import { applyFilters, countByRooms, DEFAULT_FILTERS, getBounds, hasActiveFilters } from '../lib/filters';
import { formatApartmentsCount, formatCompletion, formatRoomsShort } from '../lib/format';
import { useUrlFilters } from '../lib/use-url-filters';
import {
  ROOM_TYPES,
  SORT_ORDERS,
  type CompletionQuarter,
  type NumberRange,
  type PickerFilters,
  type RoomType,
  type SortOrder,
} from '../model/types';
import { ApartmentCard } from './ApartmentCard';
import styles from './ApartmentPicker.module.scss';
import { RangeField } from './RangeField';

const PAGE_SIZE = 12;
const PROJECT_IDS = PROJECTS.map((project) => project.id);
const PROJECT_NAMES = new Map(PROJECTS.map((project) => [project.id, project.name]));

const PRICE_BOUNDS_MILLIONS = (() => {
  const bounds = getBounds(APARTMENTS, (apartment) => apartment.price);

  return { min: Math.floor(bounds.min / 1_000_000), max: Math.ceil(bounds.max / 1_000_000) };
})();
const AREA_BOUNDS = (() => {
  const bounds = getBounds(APARTMENTS, (apartment) => apartment.area);

  return { min: Math.floor(bounds.min), max: Math.ceil(bounds.max) };
})();
const FLOOR_BOUNDS = getBounds(APARTMENTS, (apartment) => apartment.floor);
const COMPLETION_OPTIONS = [...new Set(APARTMENTS.map((apartment) => apartment.completion))].sort();

const SORT_LABELS: Record<SortOrder, string> = {
  price_asc: 'Сначала дешевле',
  price_desc: 'Сначала дороже',
  area_asc: 'Сначала меньше площадь',
  area_desc: 'Сначала больше площадь',
  completion_asc: 'Сначала раньше сдача',
};

function toggleItem<T>(items: readonly T[], item: T, order: readonly T[]): T[] {
  const next = items.includes(item) ? items.filter((current) => current !== item) : [...items, item];

  return order.filter((current) => next.includes(current));
}

function millionsToRub(range: NumberRange): NumberRange {
  return {
    min: range.min === undefined ? undefined : range.min * 1_000_000,
    max: range.max === undefined ? undefined : range.max * 1_000_000,
  };
}

function rubToMillions(range: NumberRange): NumberRange {
  return {
    min: range.min === undefined ? undefined : range.min / 1_000_000,
    max: range.max === undefined ? undefined : range.max / 1_000_000,
  };
}

type ApartmentPickerViewProps = {
  filters: PickerFilters;
  onFiltersChange: (filters: PickerFilters) => void;
};

function ApartmentPickerView({ filters, onFiltersChange }: ApartmentPickerViewProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const results = useMemo(() => applyFilters(APARTMENTS, filters), [filters]);
  const roomCounts = useMemo(() => countByRooms(APARTMENTS, filters), [filters]);
  const visibleResults = results.slice(0, visibleCount);
  const isFiltered = hasActiveFilters(filters);

  const updateFilters = (patch: Partial<PickerFilters>) => {
    setVisibleCount(PAGE_SIZE);
    onFiltersChange({ ...filters, ...patch });
  };

  const handleRoomToggle = (roomType: RoomType) => {
    updateFilters({ rooms: toggleItem(filters.rooms, roomType, ROOM_TYPES) });
  };

  const handleProjectToggle = (projectId: string) => {
    updateFilters({ projects: toggleItem(filters.projects, projectId, PROJECT_IDS) });
  };

  const handleCompletionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    updateFilters({ completionBy: value === '' ? undefined : (value as CompletionQuarter) });
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sort: event.target.value as SortOrder });
  };

  const handleReset = () => {
    updateFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
  };

  return (
    // data-ui: это рабочий интерфейс — у полей и переключателей остаются свои рамки.
    <div className={styles.picker} data-ui>
      <form className={styles.filters} aria-label="Фильтры квартир" onSubmit={(event) => event.preventDefault()}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Комнаты</legend>
          <div className={styles.toggles}>
            {ROOM_TYPES.map((roomType) => {
              const isSelected = filters.rooms.includes(roomType);

              return (
                <button
                  key={roomType}
                  type="button"
                  className={styles.toggle}
                  aria-pressed={isSelected}
                  aria-label={`${formatRoomsShort(roomType)}: ${formatApartmentsCount(roomCounts[roomType])}`}
                  disabled={!isSelected && roomCounts[roomType] === 0}
                  onClick={() => handleRoomToggle(roomType)}
                >
                  <span>{formatRoomsShort(roomType)}</span>
                  <span className={styles.toggleCount} aria-hidden="true">
                    {roomCounts[roomType]}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <RangeField
          id="price"
          legend="Цена"
          unit="млн ₽"
          step={0.5}
          value={rubToMillions(filters.price)}
          bounds={PRICE_BOUNDS_MILLIONS}
          onChange={(range) => updateFilters({ price: millionsToRub(range) })}
        />
        <RangeField
          id="area"
          legend="Площадь"
          unit="м²"
          value={filters.area}
          bounds={AREA_BOUNDS}
          onChange={(range) => updateFilters({ area: range })}
        />
        <RangeField
          id="floor"
          legend="Этаж"
          unit="№"
          value={filters.floor}
          bounds={FLOOR_BOUNDS}
          onChange={(range) => updateFilters({ floor: range })}
        />

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Проект</legend>
          <div className={styles.checkboxes}>
            {PROJECTS.map((project) => (
              <label key={project.id} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.projects.includes(project.id)}
                  onChange={() => handleProjectToggle(project.id)}
                />
                <span>
                  {project.name}
                  <span className={styles.checkboxHint}>{project.district}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className={styles.selectField}>
          <span className={styles.legend}>Сдача не позже</span>
          <select value={filters.completionBy ?? ''} onChange={handleCompletionChange}>
            <option value="">Любой срок</option>
            {COMPLETION_OPTIONS.map((completion) => (
              <option key={completion} value={completion}>
                {formatCompletion(completion)}
              </option>
            ))}
          </select>
        </label>

        {isFiltered ? (
          <button type="button" className={styles.reset} onClick={handleReset}>
            Сбросить фильтры
          </button>
        ) : null}
      </form>

      <section className={styles.results} aria-labelledby="results-title">
        <div className={styles.resultsHeader}>
          <h2 id="results-title" className={styles.resultsTitle} aria-live="polite">
            {results.length > 0 ? `Найдено: ${formatApartmentsCount(results.length)}` : 'Ничего не нашлось'}
          </h2>
          <label className={styles.sort}>
            <span className="visually-hidden">Сортировка</span>
            <select value={filters.sort} onChange={handleSortChange}>
              {SORT_ORDERS.map((sortOrder) => (
                <option key={sortOrder} value={sortOrder}>
                  {SORT_LABELS[sortOrder]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className={styles.empty}>
            <p>Попробуйте расширить диапазон цены или площади.</p>
            <button type="button" className={styles.reset} onClick={handleReset}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <ul className={styles.grid}>
            {visibleResults.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                projectName={PROJECT_NAMES.get(apartment.projectId) ?? apartment.projectId}
              />
            ))}
          </ul>
        )}

        {results.length > visibleCount ? (
          <button type="button" className={styles.more} onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            Показать ещё {Math.min(PAGE_SIZE, results.length - visibleCount)}
          </button>
        ) : null}
      </section>
    </div>
  );
}

// Фильтры из URL. useSearchParams при статическом экспорте доступен только в браузере,
// поэтому страница оборачивает этот компонент в Suspense с ApartmentPickerFallback.
export function ApartmentPicker() {
  const { filters, setFilters } = useUrlFilters(PROJECT_IDS);

  return <ApartmentPickerView filters={filters} onFiltersChange={setFilters} />;
}

function ignoreFiltersChange() {}

// Тот же подбор с фильтрами по умолчанию — попадает в статический HTML вместо пустой заглушки,
// поэтому до загрузки JS страница уже показывает список и не прыгает при гидрации.
export function ApartmentPickerFallback() {
  return <ApartmentPickerView filters={DEFAULT_FILTERS} onFiltersChange={ignoreFiltersChange} />;
}
