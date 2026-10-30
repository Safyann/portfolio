'use client';

import {
  type Announcements,
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useReducer, useRef, useState } from 'react';

import { BLOCK_DEFINITIONS, BLOCK_TYPES } from '../lib/blocks';
import { createInitialPage, formatBlocksCount, pageReducer, parsePage, serializePage, STORAGE_KEY } from '../lib/page';
import type { BlockType, PageAction } from '../model/types';
import { BlockInspector } from './BlockInspector';
import styles from './PageBuilder.module.scss';
import { SortableBlock } from './SortableBlock';

const SCREEN_READER_INSTRUCTIONS = {
  draggable:
    'Чтобы взять блок, нажмите пробел или Enter. Стрелки вверх и вниз перемещают его, пробел или Enter — отпустить, Escape — отменить.',
};

function readDraft(): string | null {
  // localStorage может быть недоступен (приватный режим, запрет cookies) — тогда работаем без черновика.
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeDraft(value: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Черновик не сохранится, но редактор продолжит работать.
  }
}

type PageBuilderProps = {
  // В Storybook черновик не нужен: каждая история начинается с шаблона.
  persist?: boolean;
};

export function PageBuilder({ persist = true }: PageBuilderProps) {
  const [page, dispatch] = useReducer(pageReducer, undefined, createInitialPage);
  // Пока черновик не прочитан, не записываем — иначе шаблон затёр бы сохранённую страницу.
  const isDraftLoadedRef = useRef(!persist);
  const [message, setMessage] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor),
    // 'instant', а не 'auto': на сайте глобально scroll-behavior: smooth, и 'auto' тоже скроллит плавно —
    // тогда блок, который нужно увести за край экрана, не перемещается с клавиатуры.
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates, scrollBehavior: 'instant' })
  );

  // Один эффект на чтение и запись черновика: первый запуск восстанавливает, следующие сохраняют.
  useEffect(() => {
    if (!persist) {
      return;
    }

    if (!isDraftLoadedRef.current) {
      isDraftLoadedRef.current = true;
      const draft = parsePage(readDraft());

      if (draft) {
        dispatch({ type: 'restore', state: draft });
        return;
      }
    }

    writeDraft(serializePage(page));
  }, [page, persist]);

  const ids = page.blocks.map((block) => block.id);
  const selectedBlock = page.blocks.find((block) => block.id === page.selectedId);

  const labelOf = (id: UniqueIdentifier) => {
    const block = page.blocks.find((item) => item.id === id);

    return block ? BLOCK_DEFINITIONS[block.type].label : 'блок';
  };
  const positionOf = (id: UniqueIdentifier) => `${ids.indexOf(String(id)) + 1} из ${ids.length}`;

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Блок «${labelOf(active.id)}» взят, позиция ${positionOf(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over ? `Блок «${labelOf(active.id)}» над позицией ${positionOf(over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over ? `Блок «${labelOf(active.id)}» перемещён на позицию ${positionOf(over.id)}.` : 'Перемещение отменено.',
    onDragCancel: ({ active }) => `Перемещение блока «${labelOf(active.id)}» отменено.`,
  };

  const run = (action: PageAction, announcement: string) => {
    dispatch(action);
    setMessage(announcement);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      dispatch({ type: 'move', from: ids.indexOf(String(active.id)), to: ids.indexOf(String(over.id)) });
    }
  };

  const handleAdd = (blockType: BlockType) => {
    // Новый блок встаёт после выделенного — так собирают страницу сверху вниз.
    const selectedIndex = ids.indexOf(page.selectedId ?? '');
    const index = selectedIndex === -1 ? undefined : selectedIndex + 1;

    run({ type: 'add', blockType, index }, `Добавлен блок «${BLOCK_DEFINITIONS[blockType].label}».`);
  };

  const renderInspector = () =>
    selectedBlock ? (
      <BlockInspector
        key={selectedBlock.id}
        block={selectedBlock}
        onChange={(data) => dispatch({ type: 'update', id: selectedBlock.id, data })}
      />
    ) : null;

  return (
    <div className={styles.builder} data-ui>
      <section className={styles.palette} aria-labelledby="builder-palette">
        <h2 id="builder-palette" className={styles.panelTitle}>
          Блоки
        </h2>
        <ul className={styles.paletteList}>
          {BLOCK_TYPES.map((blockType) => (
            <li key={blockType}>
              <button type="button" className={styles.paletteItem} onClick={() => handleAdd(blockType)}>
                <span className={styles.paletteLabel}>+ {BLOCK_DEFINITIONS[blockType].label}</span>
                <span className={styles.paletteDescription}>{BLOCK_DEFINITIONS[blockType].description}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.textButton}
          onClick={() => run({ type: 'reset' }, 'Страница сброшена к шаблону.')}
        >
          Сбросить к шаблону
        </button>
      </section>

      <section className={styles.canvas} aria-labelledby="builder-canvas">
        <h2 id="builder-canvas" className={styles.panelTitle}>
          Страница · {formatBlocksCount(page.blocks.length)}
        </h2>
        <DndContext
          // Постоянный id: иначе dnd-kit генерирует разные aria-атрибуты на сервере и клиенте.
          id="page-builder"
          sensors={sensors}
          collisionDetection={closestCenter}
          accessibility={{ announcements, screenReaderInstructions: SCREEN_READER_INSTRUCTIONS }}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ol className={styles.blocks}>
              {page.blocks.map((block, index) => {
                const label = BLOCK_DEFINITIONS[block.type].label;

                return (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    count={page.blocks.length}
                    isSelected={block.id === page.selectedId}
                    onSelect={() => dispatch({ type: 'select', id: block.id })}
                    onMove={(to) =>
                      run({ type: 'move', from: index, to }, `Блок «${label}» на позиции ${to + 1} из ${ids.length}.`)
                    }
                    onDuplicate={() => run({ type: 'duplicate', id: block.id }, `Блок «${label}» скопирован.`)}
                    onRemove={() => run({ type: 'remove', id: block.id }, `Блок «${label}» удалён.`)}
                    inspector={block.id === page.selectedId ? renderInspector() : null}
                  />
                );
              })}
            </ol>
          </SortableContext>
        </DndContext>
        {page.blocks.length === 0 ? <p className={styles.empty}>Страница пустая — добавьте блок слева.</p> : null}
        <details className={styles.json}>
          <summary>Конфигурация страницы (JSON)</summary>
          <pre>{serializePage(page, 2)}</pre>
        </details>
      </section>

      <section className={styles.inspector} aria-labelledby="builder-inspector">
        <h2 id="builder-inspector" className="visually-hidden">
          Настройки блока
        </h2>
        {selectedBlock ? (
          renderInspector()
        ) : (
          <p className={styles.empty}>Выберите блок на странице, чтобы изменить его текст.</p>
        )}
      </section>

      <p className="visually-hidden" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
