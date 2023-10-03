import type { ReactNode } from 'react';

import type { FeaturesConfiguration } from 'src/shared/features';
import { FEATURES_CONFIG } from 'src/shared/features';

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
export const SectionHeader = <K extends keyof FeaturesConfiguration>(
  { title, configKey, isDisabled }: {
    title: string;
    configKey?: K;
    isDisabled?: boolean;
  },
) => {
  const [option, setOption] = useStorage(FEATURES_CONFIG, configKey);
  const a = !isDisabled
  return (
    <header>
      <h2>{title}</h2>
      {
        configKey !== undefined
          ? (option === undefined
            ? <Loading />
            : <Toggle
                isToggled={!!option}
                onToggle={() => setOption(!option as FeaturesConfiguration[K])}
                isDisabled={isDisabled}
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
