/* eslint-disable @typescript-eslint/naming-convention */

/* Source model (extension) */
export interface SourceModel {
  match_id: string;
  teams: {
    [key: string]: TeamSourceModel;
  };
};

/* Team source model (extension) */
export interface TeamSourceModel {
  faction_id: string;
  name: string;
  leader: string;
  roster: PlayerSourceModel[];
};

/* Player source model (extension) */
export interface PlayerSourceModel {
  player_id: string;
  nickname: string;
  matches: MatchSourceModel[];
};

/* Match source model (extension) */
export interface MatchSourceModel {
  match_id: string;
  timestamp: number;
  map_pick: string;
  is_winner: boolean;
  is_leader: boolean;
  roster: {
    player_id: string;
    nickname: string;
  }[];
  stats: MatchStatsSourceModel;
  vetos: MatchVetoSourceModel[];
};

/* Match stats source model (extension) */
export interface MatchStatsSourceModel {
  [key: string]: string;
};

/* Match veto source model (extension) */
export interface MatchVetoSourceModel {
  guid: string;
  status: string;
  random: boolean;
  round: number;
  selected_by: string;
};
