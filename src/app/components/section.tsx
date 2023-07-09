import type { ReactNode } from 'react';

import type { Configuration } from 'src/shared/features';
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
  { title, configKey }: {
    title: string;
    configKey?: K;
  },
) => {
  const [option, setOption] = useStorage(CONFIG, configKey);

  return (
    <header>
      <h2>{title}</h2>
      {
        configKey !== undefined
          ? (option === undefined
            ? <Loading />
            : <Toggle
                isToggled={!!option}
                onToggle={() => setOption(!option as Configuration[K])}
              />
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
