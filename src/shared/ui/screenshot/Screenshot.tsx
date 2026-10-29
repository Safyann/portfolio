import styles from './Screenshot.module.scss';

type ScreenshotProps = {
  name: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

// Обычный <img>, а не next/image: при статическом экспорте оптимизатор картинок недоступен,
// а два заранее подготовленных размера в srcset дают тот же выигрыш.
export function Screenshot({ name, alt, sizes, priority }: ScreenshotProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const src = `${basePath}/cases/${name}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.image}
      src={`${src}-1440.jpg`}
      srcSet={`${src}-720.jpg 720w, ${src}-1440.jpg 1440w`}
      sizes={sizes}
      width={1440}
      height={700}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
