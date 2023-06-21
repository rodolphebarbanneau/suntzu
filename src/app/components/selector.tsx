import { useEffect, useState, useRef } from 'react';

import { SuntzuRange, MatchRange, PlayerRange, TimeRange } from 'src/shared/ranges';
import { useRange } from '../hooks/use-range';

import styles from './selector.module.scss';
import stylesheet from './selector.module.scss?inline';

export const Selector = (
  { title, range }: {
    title: string;
    range: SuntzuRange;
  },
) => {
  const [option, setRange] = useRange(range);
  // retrieve options based on the provided range type
  const options: string[] = [];
  switch (range) {
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
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      <div className={styles['selector-wrapper']} ref={wrapper}>
        <h2>{title}</h2>
        <div
          className={
            `${styles.selection} ${isSelecting ? styles.selecting : ''}`
          }
          onMouseDown={() => setSelecting(!isSelecting)}
        >
          {option}
        </div>
        <div className={`${styles['selector-items']} ${isSelecting ? '' : styles.hide}`}>
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

export default Selector;
