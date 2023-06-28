import type { ReactNode } from 'react';

import styles from './toolbar.module.scss';

/* Toolbar */
export const Toolbar = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <div className={styles['toolbar']}>
    {children}
  </div>
);

/* Toolbar header */
export const ToolbarHeader = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <div className={styles['toolbar-header']}>
      {children}
    </div>
);

/* Toolbar body */
export const ToolbarBody = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <div className={styles['toolbar-body']}>
      {children}
    </div>
);
