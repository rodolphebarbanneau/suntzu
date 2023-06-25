import { useEffect, useState, useRef } from 'react';

import { SuntzuRange, MatchRange, PlayerRange, TimeRange } from 'src/shared/ranges';
import { useRange } from '../hooks/use-range';

import styles from './range.module.scss';

export const Range = (
  { title, type }: {
    title: string;
    type: SuntzuRange;
  },
) => {
  const [option, setRange] = useRange(type);
  // retrieve options based on the provided range type
  const options: string[] = [];
  switch (type) {
    case SuntzuRange.MatchRange:
      options.push(...Object.values(MatchRange));
      break;
    case SuntzuRange.PlayerRange:
      options.push(...Object.values(PlayerRange));
      break;
    case SuntzuRange.TimeRange:
      options.push(...Object.values(TimeRange));
      break;
  }

  const wrapper = useRef<HTMLDivElement>(null);
  const [isSelecting, setSelecting] = useState(false);

  const onClick = (value: string) => {
    if (value === option) return;
    setRange(value)
    setSelecting(false);
  };

  const onClickOutside = (event: Event) => {
    // check if clicking outside of the wrapper
    if (wrapper.current && !event.composedPath().includes(wrapper.current)) {
      setSelecting(false);
    }
  };

  useEffect(() => {
    // add event listener to detect clicking outside of the wrapper
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('mouseup', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('mouseup', onClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles['range-wrapper']} ref={wrapper}>
        <h2>{title}</h2>
        <div
          className={
            `${styles.selection} ${isSelecting ? styles.selecting : ''}`
          }
          onMouseDown={() => setSelecting(!isSelecting)}
        >
          {option}
        </div>
        <div className={`${styles['range-items']} ${isSelecting ? '' : styles.hide}`}>
          {options.map((value, index) => (
            <div
              key={index}
              onMouseUp={() => onClick(value)}
              className={value === option ? styles.selected : ''}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Range;
