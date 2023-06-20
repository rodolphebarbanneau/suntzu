import type { ReactNode } from 'react';

import type { SuntzuFeature } from '../../shared/settings';
import { useOption } from '../hooks/use-option';
import { Loading } from './loading';
import { Toggle } from './toggle';

import styles from './section.module.scss';

export const Section = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <section className={styles.section}>
    {children}
  </section>
);

export const SectionHeader = (
  { title, feature }: {
    title: string;
    feature?: SuntzuFeature;
  },
) => {
  const [option, setOption] = useOption(feature);

  return (
    <header>
      <h2>{title}</h2>
      {
        feature !== undefined ?
          (option === null
            ? <Loading />
            : <Toggle isToggled={option} onToggle={() => setOption(!option)} />
          )
        : null
      }
    </header>
  );
};

export const SectionBody = ({ description }: { description: string }) => (
  <p>{description}</p>
);

export default Section;
