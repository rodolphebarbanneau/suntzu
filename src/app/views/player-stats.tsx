import { SuntzuFeature } from '../../shared/settings';
import { Section, SectionHeader, SectionBody } from '../components/section';

export const PlayerStats = () => (
  <Section>
    <SectionHeader
      title="Player stats"
      feature={SuntzuFeature.PlayerStats}
    />
    <SectionBody description="Display players statistics (win rate, average kills, headshots, kills/death, and kills/round) for all and each map in the matchroom." />
  </Section>
);

export default PlayerStats;
