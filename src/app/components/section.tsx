import type { ReactNode } from 'react';

import type { SuntzuFeature } from 'src/shared/features';
import { useFeature } from '../hooks/use-feature';
import { Loading } from './loading';
import { Toggle } from './toggle';

import styles from './section.module.scss';

export const Section = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <section className={styles['section']}>
    {children}
  </section>
);

export const SectionHeader = (
  { title, feature }: {
    title: string;
    feature?: SuntzuFeature;
  },
) => {
  const [option, setFeature] = useFeature(feature);

  return (
    <header>
      <h2>{title}</h2>
      {
        feature !== undefined ?
          (option === null
            ? <Loading />
            : <Toggle isToggled={option} onToggle={() => setFeature(!option)} />
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
