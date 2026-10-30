import type { Block, BlockType, Fact, PageAction, PageState } from '../model/types';
import { createBlock, isBlockType } from './blocks';

export const STORAGE_KEY = 'page-builder-draft';

export function createInitialPage(): PageState {
  const blockTypes: BlockType[] = ['hero', 'facts', 'text', 'cta'];

  return {
    blocks: blockTypes.map((type, index) => createBlock(type, `block-${index + 1}`)),
    selectedId: null,
    nextId: blockTypes.length + 1,
  };
}

function clampIndex(index: number, length: number): number {
  return Math.min(Math.max(0, index), length);
}

export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const result = [...items];
  const [item] = result.splice(from, 1);

  if (item === undefined) {
    return [...items];
  }

  result.splice(clampIndex(to, result.length), 0, item);

  return result;
}

// Все изменения страницы — здесь: чистая функция, которую легко тестировать отдельно от React и dnd.
export function pageReducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case 'add': {
      const block = createBlock(action.blockType, `block-${state.nextId}`);
      const blocks = [...state.blocks];

      blocks.splice(clampIndex(action.index ?? blocks.length, blocks.length), 0, block);

      return { blocks, selectedId: block.id, nextId: state.nextId + 1 };
    }

    case 'remove': {
      const index = state.blocks.findIndex((block) => block.id === action.id);

      if (index === -1) {
        return state;
      }

      const blocks = state.blocks.filter((block) => block.id !== action.id);
      // Выделение переходит на соседний блок, чтобы фокус клавиатуры не терялся.
      const neighbour = blocks[Math.min(index, blocks.length - 1)];

      return {
        ...state,
        blocks,
        selectedId: state.selectedId === action.id ? (neighbour?.id ?? null) : state.selectedId,
      };
    }

    case 'duplicate': {
      const index = state.blocks.findIndex((block) => block.id === action.id);
      const source = state.blocks[index];

      if (!source) {
        return state;
      }

      // structuredClone — чтобы копия не делила массивы (например, факты) с оригиналом.
      const copy = { ...structuredClone(source), id: `block-${state.nextId}` };
      const blocks = [...state.blocks];

      blocks.splice(index + 1, 0, copy);

      return { blocks, selectedId: copy.id, nextId: state.nextId + 1 };
    }

    case 'move':
      if (action.from === action.to) {
        return state;
      }

      return { ...state, blocks: moveItem(state.blocks, action.from, action.to) };

    case 'select':
      return { ...state, selectedId: action.id };

    case 'update':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.id ? ({ ...block, data: { ...block.data, ...action.data } } as Block) : block
        ),
      };

    case 'reset':
      return createInitialPage();

    case 'restore':
      return action.state;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isFact(value: unknown): value is Fact {
  return isRecord(value) && isString(value.value) && isString(value.label);
}

function isBlock(value: unknown): value is Block {
  if (!isRecord(value) || !isString(value.id) || !isBlockType(value.type) || !isRecord(value.data)) {
    return false;
  }

  const { data } = value;

  switch (value.type) {
    case 'hero':
      return isString(data.title) && isString(data.subtitle);
    case 'text':
      return isString(data.text);
    case 'facts':
      return Array.isArray(data.items) && data.items.every(isFact);
    case 'cta':
      return isString(data.label) && isString(data.href);
  }
}

// Черновик из localStorage — внешние данные: проверяем форму целиком, иначе начинаем с шаблона.
export function parsePage(raw: string | null): PageState | null {
  if (raw === null) {
    return null;
  }

  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(value) || !Array.isArray(value.blocks) || !value.blocks.every(isBlock)) {
    return null;
  }

  const blocks = value.blocks;
  const ids = new Set(blocks.map((block) => block.id));

  if (ids.size !== blocks.length) {
    return null;
  }

  // nextId пересчитываем сами: так новые id не совпадут с сохранёнными, даже если счётчик в файле испорчен.
  const maxId = Math.max(0, ...blocks.map((block) => Number(block.id.replace('block-', '')) || 0));

  return { blocks, selectedId: null, nextId: maxId + 1 };
}

// В черновик и в просмотр JSON попадают только блоки: выделение и счётчик id — состояние редактора.
export function serializePage(state: PageState, indent?: number): string {
  return JSON.stringify({ blocks: state.blocks }, null, indent);
}

export function formatBlocksCount(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} блок`;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} блока`;
  }

  return `${count} блоков`;
}
