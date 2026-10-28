import styles from './Chip.module.scss';

type ChipListProps = {
  items: readonly string[];
  label?: string;
};

export function ChipList({ items, label = 'Стек' }: ChipListProps) {
  return (
    <ul className={styles.list} aria-label={label}>
      {items.map((item) => (
        <li key={item} className={styles.chip}>
          {item}
        </li>
      ))}
    </ul>
  );
}
