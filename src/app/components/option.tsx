import { useEffect, useRef, useState } from 'react';

import type { StorageNamespace } from 'src/shared/core';

import { useStorage } from '../hooks/use-storage';

import styles from './option.module.scss';

/* Option */
export const Option = <T extends StorageNamespace, K extends keyof T>(
  { title, namespace, namespaceKey, options }: {
    title: string;
    namespace: T | Promise<T>,
    namespaceKey: K;
    options: T[K][],
  },
) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [option, setOption] = useStorage(namespace, namespaceKey);

  // state to determine if the option items should be shown
  const [isSelecting, setSelecting] = useState(false);

  // handle clicking on an option item
  const onClick = (value: T[K]) => {
    if (value === option) return;
    setOption(value)
    setSelecting(false);
  };

  // handle clicking outside of the wrapper
  const onClickOutside = (event: Event) => {
    // check if clicking outside of the wrapper
    if (wrapper.current && !event.composedPath().includes(wrapper.current)) {
      setSelecting(false);
    }
  };

  // add event listeners
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
      <div className={styles['option-wrapper']} ref={wrapper}>
        <h2>{title}</h2>
        <div
          className={
            `${styles.selection} ${isSelecting ? styles.selecting : ''}`
          }
          onMouseDown={() => setSelecting(!isSelecting)}
        >
          {option as string}
        </div>
        <div className={`${styles['option-items']} ${isSelecting ? '' : styles.hide}`}>
          {options.map((value, index) => (
            <div
              key={index}
              onMouseUp={() => onClick(value as T[K])}
              className={value === option ? styles.selected : ''}
            >
              {value as string}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Option;
