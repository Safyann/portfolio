import { formatArea, formatCompletion, formatPriceMillions, formatRooms } from '../lib/format';
import type { Apartment } from '../model/types';
import styles from './ApartmentPicker.module.scss';

type ApartmentCardProps = {
  apartment: Apartment;
  projectName: string;
};

export function ApartmentCard({ apartment, projectName }: ApartmentCardProps) {
  return (
    <li className={styles.card}>
      <p className={styles.cardProject}>
        {projectName} · корпус {apartment.building}
      </p>
      <p className={styles.cardTitle}>
        {formatRooms(apartment.rooms)}, {formatArea(apartment.area)}
      </p>
      <p className={styles.cardMeta}>
        Этаж {apartment.floor} из {apartment.floorsTotal} · сдача {formatCompletion(apartment.completion)}
      </p>
      <p className={styles.cardPrice}>{formatPriceMillions(apartment.price)}</p>
    </li>
  );
}
