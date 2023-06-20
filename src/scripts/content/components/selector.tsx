import { useEffect, useState, useRef } from 'react';

import styles from './selector.module.scss';
import stylesheet from './selector.module.scss?inline';

export const Selector = (
  { title, options, value }: {
    title: string;
    options: string[];
    value?: string;
  },
) => {
  // check if the value is in the options
  if (value && !options.includes(value[0])) {
    throw new Error('The value is not in the options');
  }

  const wrapper = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState(value ?? options[0]);
  const [isSelecting, setSelecting] = useState(false);

  const onClick = (option: string) => {
    setSelection(option);
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
          {selection}
        </div>
        <div className={`${styles['selector-items']} ${isSelecting ? '' : styles.hide}`}>
          {options.map((option, index) => (
            <div
              key={index}
              onMouseUp={() => onClick(option)}
              className={option === selection ? styles.selected : ''}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Selector;
