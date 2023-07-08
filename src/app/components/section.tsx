import type { ReactNode } from 'react';

import { CONFIG } from 'src/shared/settings';

import { useStorage } from '../hooks/use-storage';
import { Loading } from './loading';
import { Toggle } from './toggle';

import styles from './section.module.scss';

/* Section */
export const Section = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <section className={styles['section']}>
    {children}
  </section>
);

/* Section header */
export const SectionHeader = <K extends keyof Awaited<typeof CONFIG>>(
  { title, storageKey }: {
    title: string;
    storageKey?: K;
  },
) => {
  const [option, setOption] = useStorage(CONFIG, storageKey);

  return (
    <header>
      <h2>{title}</h2>
      {
        storageKey !== undefined
          ? (option === undefined
            ? <Loading />
            : <Toggle isToggled={!!option} onToggle={() => setOption(!option)} />
          )
          : null
      }
    </header>
  );
};

/* Section body */
export const SectionBody = ({ description }: { description: string }) => (
  <p>{description}</p>
);
