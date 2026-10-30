import type { ReactNode } from 'react';

import { BLOCK_DEFINITIONS } from '../lib/blocks';
import type { Block, BlockDataMap, BlockType, Fact } from '../model/types';
import styles from './PageBuilder.module.scss';

const MAX_FACTS = 4;

type BlockInspectorProps = {
  block: Block;
  onChange: (data: Partial<BlockDataMap[BlockType]>) => void;
};

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isMultiline?: boolean;
};

function TextField({ label, value, onChange, isMultiline }: TextFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {isMultiline ? (
        <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function FactsEditor({ items, onChange }: { items: Fact[]; onChange: (items: Fact[]) => void }) {
  const updateItem = (index: number, patch: Partial<Fact>) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className={styles.facts}>
      {items.map((item, index) => (
        <fieldset key={index} className={styles.fact}>
          <legend className={styles.fieldLabel}>Факт {index + 1}</legend>
          <TextField label="Значение" value={item.value} onChange={(value) => updateItem(index, { value })} />
          <TextField label="Подпись" value={item.label} onChange={(label) => updateItem(index, { label })} />
          <button
            type="button"
            className={styles.textButton}
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            disabled={items.length === 1}
          >
            Удалить факт {index + 1}
          </button>
        </fieldset>
      ))}
      {items.length < MAX_FACTS ? (
        <button
          type="button"
          className={styles.textButton}
          onClick={() => onChange([...items, { value: '0', label: 'подпись' }])}
        >
          + Добавить факт
        </button>
      ) : null}
    </div>
  );
}

function renderFields(block: Block, onChange: BlockInspectorProps['onChange']): ReactNode {
  switch (block.type) {
    case 'hero':
      return (
        <>
          <TextField label="Заголовок" value={block.data.title} onChange={(title) => onChange({ title })} />
          <TextField
            label="Подзаголовок"
            value={block.data.subtitle}
            onChange={(subtitle) => onChange({ subtitle })}
            isMultiline
          />
        </>
      );
    case 'text':
      return <TextField label="Текст" value={block.data.text} onChange={(text) => onChange({ text })} isMultiline />;
    case 'facts':
      return <FactsEditor items={block.data.items} onChange={(items) => onChange({ items })} />;
    case 'cta':
      return (
        <>
          <TextField label="Надпись" value={block.data.label} onChange={(label) => onChange({ label })} />
          <TextField label="Ссылка" value={block.data.href} onChange={(href) => onChange({ href })} />
        </>
      );
  }
}

export function BlockInspector({ block, onChange }: BlockInspectorProps) {
  return (
    <form className={styles.inspectorForm} onSubmit={(event) => event.preventDefault()}>
      <h3 className={styles.panelTitle}>{BLOCK_DEFINITIONS[block.type].label}</h3>
      {renderFields(block, onChange)}
    </form>
  );
}
