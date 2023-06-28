import type { ReactNode } from 'react';

import styles from './grid.module.scss';

/* Cell */
export const Cell = ({ children }: { children?: ReactNode }) => (
  <div className={styles['cell']}>
    {children}
  </div>
);

/* Column */
export const Column = (
  { width, children }: {
    width?: string,
    children?: ReactNode | ReactNode[],
  },
) => (
  <div
    className={styles['column']}
    style={{ width: width }}
  >
    {children}
  </div>
);

/* Grid */
export const Grid = ({ children }: { children?: ReactNode | ReactNode[] }) => (
  <div className={styles['grid']}>
    {children}
  </div>
);
