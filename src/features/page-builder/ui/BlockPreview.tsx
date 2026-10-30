import type { Block } from '../model/types';
import styles from './PageBuilder.module.scss';

type BlockPreviewProps = {
  block: Block;
};

// Как блок выглядит на странице. Внутри холста он не интерактивен: кнопка — только картинка.
export function BlockPreview({ block }: BlockPreviewProps) {
  switch (block.type) {
    case 'hero':
      return (
        <div className={styles.previewHero}>
          <p className={styles.previewTitle}>{block.data.title || 'Без заголовка'}</p>
          {block.data.subtitle ? <p className={styles.previewSubtitle}>{block.data.subtitle}</p> : null}
        </div>
      );
    case 'text':
      return <p className={styles.previewText}>{block.data.text || 'Пустой абзац'}</p>;
    case 'facts':
      return (
        <dl className={styles.previewFacts}>
          {block.data.items.map((item, index) => (
            <div key={index}>
              <dt className={styles.previewFactValue}>{item.value}</dt>
              <dd className={styles.previewFactLabel}>{item.label}</dd>
            </div>
          ))}
        </dl>
      );
    case 'cta':
      return <span className={styles.previewButton}>{block.data.label || 'Кнопка'}</span>;
  }
}
