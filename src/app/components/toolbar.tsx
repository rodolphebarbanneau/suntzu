import type { ReactNode } from 'react';

import styles from './toolbar.module.scss';

export const Toolbar = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <div className={styles['toolbar']}>
    {children}
  </div>
);

export const ToolbarHeader = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <div className={styles['toolbar-header']}>
      {children}
    </div>
);

export const ToolbarBody = ({ children }: { children: ReactNode | ReactNode[] }) => (
    <div className={styles['toolbar-body']}>
      {children}
    </div>
);
