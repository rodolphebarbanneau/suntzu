import { Settings } from 'src/shared/features';
import { Section, SectionHeader, SectionBody } from '../components/section';

export const MapSettings = () => (
  <Section>
    <SectionHeader
      title="Map metrics"
      feature={Settings.MapFeature}
    />
    <SectionBody description="Display map metrics (win rate, average kills, headshots, kills/death, and kills/round) for each map in the matchroom map cards." />
  </Section>
);

export const PlayerSettings = () => (
  <Section>
    <SectionHeader
      title="Player metrics"
      feature={Settings.PlayerFeature}
    />
    <SectionBody description="Display players metrics (win rate, average kills, headshots, kills/death, and kills/round) for all and each map in the matchroom." />
  </Section>
);
