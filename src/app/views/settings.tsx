import { Section, SectionHeader, SectionBody } from '../components/section';

/* Map settings */
export const MapSettings = () => (
  <Section>
    <SectionHeader
      title="Map metrics"
      configKey="showMap"
    />
    <SectionBody description="Display map metrics (matches, win rate, average kills, headshots, kills/death, and kills/round) for each map card in the matchroom." />
  </Section>
);

/* Player settings */
export const PlayerSettings = () => (
  <Section>
    <SectionHeader
      title="Player metrics"
      configKey="showPlayer"
    />
    <SectionBody description="Display players metrics (matches, win rate, average kills, headshots, kills/death, and kills/round) for selected map in the matchroom." />
  </Section>
);
