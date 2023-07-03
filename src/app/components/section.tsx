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
  { title, key }: {
    title: string;
    key?: K;
  },
) => {
  const [option, setFeature] = useStorage(CONFIG, key);

  return (
    <header>
      <h2>{title}</h2>
      {
        key !== undefined
          ? (option === null
            ? <Loading />
            : <Toggle isToggled={option} onToggle={() => setFeature(!option)} />
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
