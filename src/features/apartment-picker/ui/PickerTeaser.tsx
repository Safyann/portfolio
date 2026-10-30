'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { APARTMENTS, PROJECTS } from '../lib/apartments';
import { applyFilters, countByRooms, DEFAULT_FILTERS, serializeFilters } from '../lib/filters';
import { formatApartmentsCount, formatArea, formatPriceMillions, formatRooms, formatRoomsShort } from '../lib/format';
import { ROOM_TYPES, type PickerFilters, type RoomType } from '../model/types';
import styles from './PickerTeaser.module.scss';

const PREVIEW_SIZE = 3;
const PROJECT_NAMES = new Map(PROJECTS.map((project) => [project.id, project.name]));

// Мини-версия демо для первого экрана: только комнаты, три самые доступные квартиры и ссылка
// на полный подбор с теми же фильтрами. Состояние локальное — URL главной не меняется.
export function PickerTeaser() {
  const [rooms, setRooms] = useState<readonly RoomType[]>([]);

  const filters: PickerFilters = useMemo(() => ({ ...DEFAULT_FILTERS, rooms }), [rooms]);
  const results = useMemo(() => applyFilters(APARTMENTS, filters), [filters]);
  const roomCounts = useMemo(() => countByRooms(APARTMENTS, filters), [filters]);
  const query = serializeFilters(filters);

  const handleToggle = (roomType: RoomType) => {
    setRooms((current) => {
      const next = current.includes(roomType) ? current.filter((item) => item !== roomType) : [...current, roomType];

      return ROOM_TYPES.filter((item) => next.includes(item));
    });
  };

  return (
    <div className={styles.teaser} data-ui>
      <p className={styles.caption}>Подбор квартир — живое демо на вымышленных данных</p>
      <div className={styles.toggles} role="group" aria-label="Комнаты">
        {ROOM_TYPES.map((roomType) => (
          <button
            key={roomType}
            type="button"
            className={styles.toggle}
            aria-pressed={rooms.includes(roomType)}
            onClick={() => handleToggle(roomType)}
          >
            {formatRoomsShort(roomType)}
            <span className="visually-hidden">, {formatApartmentsCount(roomCounts[roomType])}</span>
          </button>
        ))}
      </div>
      <p className={styles.count} aria-live="polite">
        Найдено: {formatApartmentsCount(results.length)}
      </p>
      <ul className={styles.results}>
        {results.slice(0, PREVIEW_SIZE).map((apartment) => (
          <li key={apartment.id} className={styles.result}>
            <span>
              {formatRooms(apartment.rooms)}, {formatArea(apartment.area)}
              <span className={styles.project}> · {PROJECT_NAMES.get(apartment.projectId)}</span>
            </span>
            <span className={styles.price}>{formatPriceMillions(apartment.price)}</span>
          </li>
        ))}
      </ul>
      <Link className={styles.more} href={query ? `/demo/picker/?${query}` : '/demo/picker/'}>
        Открыть полный подбор <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
