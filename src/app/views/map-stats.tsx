import { SuntzuFeature } from '../../shared/settings';
import { Section, SectionHeader, SectionBody } from '../components/section';

export const MapStats = () => (
  <Section>
    <SectionHeader
      title="Map stats"
      feature={SuntzuFeature.MapStats}
    />
    <SectionBody description="Display map statistics (win rate, average kills, headshots, kills/death, and kills/round) for each map in the matchroom map cards." />
  </Section>
);

export default MapStats;
