import { useState, useEffect } from 'react';

import styles from './tooltip.module.scss';

/* Tooltip */
export const Tooltip = ({ message }: { message: string }) => {
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
      {hover && show && <div className={styles['tooltip-box']} >{message}</div>}
    </div>
  );
};

export default Tooltip;
