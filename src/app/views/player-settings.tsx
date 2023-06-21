import { SuntzuFeature } from 'src/shared/features';
import { Section, SectionHeader, SectionBody } from '../components/section';

export const PlayerSettings = () => (
  <Section>
    <SectionHeader
      title="Player metrics"
      feature={SuntzuFeature.PlayerFeature}
    />
    <SectionBody description="Display players metrics (win rate, average kills, headshots, kills/death, and kills/round) for all and each map in the matchroom." />
  </Section>
);

export default PlayerSettings;
