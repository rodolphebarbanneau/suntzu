import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';

import styles from './tooltip.module.scss';

/* Tooltip */
export const Tooltip = ({ children, position }: {
  children: ReactNode | ReactNode[],
  position?: 'top' | 'bottom' | 'left' | 'right',
}) => {
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(false);

  let timer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    setHover(true);
    timer = setTimeout(() => setShow(true), 100);
  };

  const handleMouseLeave = () => {
    setHover(false);
    clearTimeout(timer);
    setShow(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={styles['tooltip-button']}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      i
      {
        hover && show && <div
          className={styles['tooltip-box'] + ' ' + styles[`tooltip-box-${position ?? 'top'}`]}
        >
          {children}
        </div>
      }
    </div>
  );
};

export default Tooltip;
