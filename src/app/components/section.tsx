import { ReactNode } from 'react';

import { SuntzuFeature } from '../../shared/settings';
import { useOption } from '../hooks/use-option';

import { Loading } from './loading';
import { Toggle } from './toggle';

export const Section = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <section>{children}</section>
);

export const SectionHeader = ({
  title,
  feature,
}: {
  title: string;
  feature?: SuntzuFeature;
}) => {
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
