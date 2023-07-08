/* Source model (extension) */
export interface SourceModel {
  matchId: string;
  teams: {
    [key: string]: TeamSourceModel;
  };
}

/* Team source model (extension) */
export interface TeamSourceModel {
  factionId: string;
  name: string;
  leader: string;
  roster: PlayerSourceModel[];
}

/* Player source model (extension) */
export interface PlayerSourceModel {
  playerId: string;
  nickname: string;
  matches: MatchSourceModel[];
}

/* Match source model (extension) */
export interface MatchSourceModel {
  matchId: string;
  timestamp: number;
  mapPick: string;
  isWinner: boolean;
  isLeader: boolean;
  faction: string;
  roster: {
    playerId: string;
    nickname: string;
  }[];
  stats: MatchStatsSourceModel;
  voting?: MatchVotingSourceModel[];
}

/* Match stats source model (extension) */
export interface MatchStatsSourceModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/* Match voting source model (extension) */
export interface MatchVotingSourceModel {
  guid: string;
  status: string;
  random: boolean;
  round: number;
  selectedBy: string;
}
