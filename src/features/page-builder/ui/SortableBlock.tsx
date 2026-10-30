import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

import { BLOCK_DEFINITIONS } from '../lib/blocks';
import type { Block } from '../model/types';
import { BlockPreview } from './BlockPreview';
import styles from './PageBuilder.module.scss';

type SortableBlockProps = {
  block: Block;
  index: number;
  count: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (to: number) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  // Настройки блока для узкого экрана: там нет боковой панели, и форма открывается прямо под блоком.
  inspector?: ReactNode;
};

export function SortableBlock({
  block,
  index,
  count,
  isSelected,
  onSelect,
  onMove,
  onDuplicate,
  onRemove,
  inspector,
}: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
  const label = BLOCK_DEFINITIONS[block.type].label;
  // Номер в подписи различает одинаковые блоки, например два «Текста», для экранного диктора.
  const name = `${index + 1} «${label}»`;

  return (
    <li
      ref={setNodeRef}
      className={[styles.block, isSelected ? styles.selected : '', isDragging ? styles.dragging : '']
        .filter(Boolean)
        .join(' ')}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <div className={styles.blockBar}>
        {/* Тащить можно только за ручку: остальная карточка остаётся кликабельной и выделяется текстом. */}
        <button
          ref={setActivatorNodeRef}
          type="button"
          className={styles.handle}
          aria-label={`Переместить блок «${label}», позиция ${index + 1} из ${count}`}
          {...attributes}
          {...listeners}
        >
          <span aria-hidden="true">⠿</span>
        </button>
        <button type="button" className={styles.blockName} aria-pressed={isSelected} onClick={onSelect}>
          <span className="visually-hidden">Блок {index + 1}: </span>
          {label}
        </button>
        {/* Кнопки вверх и вниз — запасной способ для тех, кому неудобно перетаскивать. */}
        <div className={styles.blockActions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Поднять блок ${name}`}
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
          >
            ↑
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Опустить блок ${name}`}
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
          >
            ↓
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Копировать блок ${name}`}
            onClick={onDuplicate}
          >
            ⧉
          </button>
          <button type="button" className={styles.iconButton} aria-label={`Удалить блок ${name}`} onClick={onRemove}>
            ✕
          </button>
        </div>
      </div>
      <div className={styles.blockBody} onClick={onSelect}>
        <BlockPreview block={block} />
      </div>
      {inspector ? <div className={styles.inlineInspector}>{inspector}</div> : null}
    </li>
  );
}
