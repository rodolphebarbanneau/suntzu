import { Section, SectionHeader, SectionBody } from '../components/section';

/* Map settings */
export const MapSettings = () => (
  <Section>
    <SectionHeader
      title="Map metrics"
      key="showMap"
    />
    <SectionBody description="Display map metrics (win rate, average kills, headshots, kills/death, and kills/round) for each map in the matchroom map cards." />
  </Section>
);

/* Player settings */
export const PlayerSettings = () => (
  <Section>
    <SectionHeader
      title="Player metrics"
      key="showPlayer"
    />
    <SectionBody description="Display players metrics (win rate, average kills, headshots, kills/death, and kills/round) for all and each map in the matchroom." />
  </Section>
);
