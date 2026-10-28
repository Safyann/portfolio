import type { ChangeEvent } from 'react';

import type { NumberRange } from '../model/types';
import styles from './ApartmentPicker.module.scss';

type RangeFieldProps = {
  id: string;
  legend: string;
  unit: string;
  value: NumberRange;
  bounds: { min: number; max: number };
  onChange: (range: NumberRange) => void;
  step?: number;
};

function toNumber(rawValue: string): number | undefined {
  if (rawValue === '') {
    return undefined;
  }

  const parsed = Number(rawValue.replace(',', '.'));

  return Number.isFinite(parsed) ? parsed : undefined;
}

export function RangeField({ id, legend, unit, value, bounds, onChange, step = 1 }: RangeFieldProps) {
  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, min: toNumber(event.target.value) });
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, max: toNumber(event.target.value) });
  };

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        {legend}, {unit}
      </legend>
      <div className={styles.range}>
        <label className={styles.rangeInput}>
          <span className={styles.rangeLabel}>от</span>
          <input
            id={`${id}-min`}
            type="number"
            inputMode="decimal"
            min={0}
            step={step}
            placeholder={String(bounds.min)}
            value={value.min ?? ''}
            onChange={handleMinChange}
          />
        </label>
        <label className={styles.rangeInput}>
          <span className={styles.rangeLabel}>до</span>
          <input
            id={`${id}-max`}
            type="number"
            inputMode="decimal"
            min={0}
            step={step}
            placeholder={String(bounds.max)}
            value={value.max ?? ''}
            onChange={handleMaxChange}
          />
        </label>
      </div>
    </fieldset>
  );
}
