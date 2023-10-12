import type { Matchroom, MatchroomPlayer } from 'src/shared/core';
import { Feature } from 'src/shared/core';

/* Player feature */
export const PlayerFeature = (matchroom: Matchroom, player: MatchroomPlayer) => new Feature({
  name: `player-${player.id}`,
  host: player.container,
  initialize: (feature) => {},
});
