import { Section, SectionHeader, SectionBody } from '../components/section';

/* Map settings */
export const MapSettings = () => (
  <Section>
    <SectionHeader
      title="Map metrics"
      configKey="showMap"
    />
    <SectionBody>
      <p>Enable map metrics (matches, win rate, average kills, headshots, kills/death, and kills/round) for each map card in the matchroom.</p>
    </SectionBody>
  </Section>
);

/* Player settings */
export const PlayerSettings = () => (
  <Section>
    <SectionHeader
      title="Player metrics"
      configKey="showPlayer"
      isDisabled={true}
    />
    <SectionBody>
      <p>Enable players metrics (matches, win rate, average kills, headshots, kills/death, and kills/round) for selected map in the matchroom.</p>
    </SectionBody>
  </Section>
);
