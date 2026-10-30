import type { Block, BlockDataMap, BlockType } from '../model/types';

type BlockDefinition<T extends BlockType> = {
  label: string;
  description: string;
  createData: () => BlockDataMap[T];
};

// Каталог блоков: подпись в палитре и данные по умолчанию для нового блока.
export const BLOCK_DEFINITIONS: { [T in BlockType]: BlockDefinition<T> } = {
  hero: {
    label: 'Первый экран',
    description: 'Заголовок и подзаголовок',
    createData: () => ({ title: 'Дом у реки', subtitle: 'Квартиры с видом на набережную, сдача в 2028 году' }),
  },
  text: {
    label: 'Текст',
    description: 'Абзац описания',
    createData: () => ({ text: 'Тихий двор без машин, детская площадка и сад на крыше.' }),
  },
  facts: {
    label: 'Факты',
    description: 'Цифры о проекте',
    createData: () => ({
      items: [
        { value: '24', label: 'этажа' },
        { value: '312', label: 'квартир' },
        { value: '2028', label: 'год сдачи' },
      ],
    }),
  },
  cta: {
    label: 'Кнопка',
    description: 'Призыв к действию',
    createData: () => ({ label: 'Выбрать квартиру', href: '/demo/picker/' }),
  },
};

export const BLOCK_TYPES = Object.keys(BLOCK_DEFINITIONS) as BlockType[];

export function isBlockType(value: unknown): value is BlockType {
  return typeof value === 'string' && Object.hasOwn(BLOCK_DEFINITIONS, value);
}

export function createBlock(type: BlockType, id: string): Block {
  // Обобщённый createData возвращает объединение данных — связь type и data TypeScript здесь не выводит.
  return { id, type, data: BLOCK_DEFINITIONS[type].createData() } as Block;
}

// Короткая подпись блока в списке холста.
export function getBlockSummary(block: Block): string {
  switch (block.type) {
    case 'hero':
      return block.data.title;
    case 'text':
      return block.data.text;
    case 'facts':
      return block.data.items.map((item) => `${item.value} ${item.label}`).join(' · ');
    case 'cta':
      return block.data.label;
  }
}
