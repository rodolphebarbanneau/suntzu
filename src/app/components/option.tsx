import { useEffect, useState, useRef } from 'react';

import type { Matchroom, MatchroomOptions } from 'src/shared/core';
import { MatchesOption, PlayersOption, TimeSpanOption } from 'src/shared/types';

import { useStorage } from '../hooks/use-storage';

import styles from './option.module.scss';

/* Option */
export const Option = <K extends keyof MatchroomOptions>(
  { title, matchroom, key }: {
    title: string;
    matchroom: Matchroom;
    key?: K;
  },
) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [option, setOption] = useStorage(matchroom.options, key);

  // retrieve options based on the provided option key
  const options: string[] = [];
  switch (key) {
    case 'matches':
      options.push(...Object.values(MatchesOption));
      break;
    case 'players':
      options.push(...Object.values(PlayersOption));
      break;
    case 'timeSpan':
      options.push(...Object.values(TimeSpanOption));
      break;
  }

  // state to determine if the option items should be shown
  const [isSelecting, setSelecting] = useState(false);

  // handle clicking on an option item
  const onClick = (value: MatchroomOptions[K]) => {
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
          {option}
        </div>
        <div className={`${styles['option-items']} ${isSelecting ? '' : styles.hide}`}>
          {options.map((value, index) => (
            <div
              key={index}
              onMouseUp={() => onClick(value as MatchroomOptions[K])}
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

export default Option;
