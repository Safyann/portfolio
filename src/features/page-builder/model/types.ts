export type Fact = {
  value: string;
  label: string;
};

// Данные каждого типа блока. Добавить блок = добавить ключ сюда, остальное подскажет TypeScript.
export type BlockDataMap = {
  hero: { title: string; subtitle: string };
  text: { text: string };
  facts: { items: Fact[] };
  cta: { label: string; href: string };
};

export type BlockType = keyof BlockDataMap;

// Размеченное объединение: по полю type TypeScript знает форму data.
export type Block = {
  [T in BlockType]: { id: string; type: T; data: BlockDataMap[T] };
}[BlockType];

export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;

export type PageState = {
  blocks: Block[];
  selectedId: string | null;
  // Счётчик для id блоков: состояние остаётся чистым и детерминированным, без Math.random и Date.now.
  nextId: number;
};

export type PageAction =
  | { type: 'add'; blockType: BlockType; index?: number }
  | { type: 'remove'; id: string }
  | { type: 'duplicate'; id: string }
  | { type: 'move'; from: number; to: number }
  | { type: 'select'; id: string | null }
  | { type: 'update'; id: string; data: Partial<BlockDataMap[BlockType]> }
  | { type: 'reset' }
  | { type: 'restore'; state: PageState };
