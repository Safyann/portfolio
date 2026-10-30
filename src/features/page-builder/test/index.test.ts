import { createBlock, getBlockSummary } from '../lib/blocks';
import { createInitialPage, formatBlocksCount, moveItem, pageReducer, parsePage, serializePage } from '../lib/page';
import type { BlockOf, PageState } from '../model/types';

function idsOf(state: PageState): string[] {
  return state.blocks.map((block) => block.id);
}

describe('pageReducer', () => {
  const initial = createInitialPage();

  it('шаблон — четыре блока с последовательными id', () => {
    expect(idsOf(initial)).toEqual(['block-1', 'block-2', 'block-3', 'block-4']);
    expect(initial.nextId).toBe(5);
  });

  it('добавляет блок в конец или по индексу и выделяет его', () => {
    const appended = pageReducer(initial, { type: 'add', blockType: 'text' });
    expect(idsOf(appended).at(-1)).toBe('block-5');
    expect(appended.selectedId).toBe('block-5');

    const inserted = pageReducer(initial, { type: 'add', blockType: 'cta', index: 1 });
    expect(idsOf(inserted)).toEqual(['block-1', 'block-5', 'block-2', 'block-3', 'block-4']);
  });

  it('не повторяет id после удаления и добавления', () => {
    const removed = pageReducer(initial, { type: 'remove', id: 'block-4' });
    const added = pageReducer(removed, { type: 'add', blockType: 'cta' });

    expect(new Set(idsOf(added)).size).toBe(added.blocks.length);
  });

  it('при удалении выделенного блока выделяет соседний', () => {
    const selected = pageReducer(initial, { type: 'select', id: 'block-2' });

    expect(pageReducer(selected, { type: 'remove', id: 'block-2' }).selectedId).toBe('block-3');

    const lastSelected = pageReducer(initial, { type: 'select', id: 'block-4' });
    expect(pageReducer(lastSelected, { type: 'remove', id: 'block-4' }).selectedId).toBe('block-3');
  });

  it('копия встаёт следом и не делит данные с оригиналом', () => {
    const duplicated = pageReducer(initial, { type: 'duplicate', id: 'block-2' });
    const [original, copy] = duplicated.blocks.slice(1, 3) as [BlockOf<'facts'>, BlockOf<'facts'>];

    expect(copy.id).toBe('block-5');
    expect(copy.data).toEqual(original.data);
    expect(copy.data.items).not.toBe(original.data.items);
  });

  it('перемещает блок', () => {
    expect(idsOf(pageReducer(initial, { type: 'move', from: 0, to: 2 }))).toEqual([
      'block-2',
      'block-3',
      'block-1',
      'block-4',
    ]);
  });

  it('обновляет только поля выбранного блока', () => {
    const updated = pageReducer(initial, { type: 'update', id: 'block-1', data: { title: 'Новый заголовок' } });
    const hero = updated.blocks[0] as BlockOf<'hero'>;

    expect(hero.data.title).toBe('Новый заголовок');
    expect(hero.data.subtitle).toBe((initial.blocks[0] as BlockOf<'hero'>).data.subtitle);
    expect(updated.blocks[1]).toBe(initial.blocks[1]);
  });

  it('не мутирует исходное состояние', () => {
    const snapshot = structuredClone(initial);

    pageReducer(initial, { type: 'add', blockType: 'text' });
    pageReducer(initial, { type: 'move', from: 0, to: 3 });
    pageReducer(initial, { type: 'remove', id: 'block-1' });

    expect(initial).toEqual(snapshot);
  });
});

describe('moveItem', () => {
  it('ограничивает индекс границами списка', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 10)).toEqual(['b', 'c', 'a']);
    expect(moveItem(['a', 'b', 'c'], 2, -5)).toEqual(['c', 'a', 'b']);
  });
});

describe('parsePage', () => {
  it('восстанавливает сохранённую страницу и пересчитывает счётчик id', () => {
    const page = pageReducer(createInitialPage(), { type: 'add', blockType: 'text' });
    const restored = parsePage(serializePage(page));

    expect(restored?.blocks).toEqual(page.blocks);
    expect(restored?.nextId).toBe(6);
    expect(restored?.selectedId).toBeNull();
  });

  it.each([
    ['пусто', null],
    ['не JSON', '{oops'],
    ['не тот формат', '{"items": []}'],
    ['неизвестный тип блока', '{"blocks":[{"id":"block-1","type":"video","data":{}}]}'],
    ['неполные данные', '{"blocks":[{"id":"block-1","type":"hero","data":{"title":"А"}}]}'],
    [
      'повтор id',
      `{"blocks":[${JSON.stringify(createBlock('text', 'block-1'))},${JSON.stringify(createBlock('cta', 'block-1'))}]}`,
    ],
  ])('отклоняет черновик: %s', (_, raw) => {
    expect(parsePage(raw)).toBeNull();
  });
});

describe('format', () => {
  it('склоняет «блок»', () => {
    expect([0, 1, 2, 5, 11, 12, 21, 22].map(formatBlocksCount)).toEqual([
      '0 блоков',
      '1 блок',
      '2 блока',
      '5 блоков',
      '11 блоков',
      '12 блоков',
      '21 блок',
      '22 блока',
    ]);
  });

  it('подпись блока в списке', () => {
    expect(getBlockSummary(createBlock('facts', 'block-1'))).toBe('24 этажа · 312 квартир · 2028 год сдачи');
  });
});
