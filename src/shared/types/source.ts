/* eslint-disable @typescript-eslint/naming-convention */

/* Source model (suntzu). */
export interface SourceModel {
  match_id: string;
  teams: {
    [key: string]: SourceTeamModel;
  };
};

/* Source team model (suntzu). */
export interface SourceTeamModel {
  faction_id: string;
  name: string;
  leader: string;
  roster: SourcePlayerModel[];
};

/* Source player model (suntzu). */
export interface SourcePlayerModel {
  player_id: string;
  nickname: string;
  matches: SourceMatchModel[];
};

/* Source match model (suntzu). */
export interface SourceMatchModel {
  match_id: string;
  timestamp: number;
  map_pick: string;
  is_winner: boolean;
  is_leader: boolean;
  roster: {
    player_id: string;
    nickname: string;
  }[];
  stats: SourceMatchStatsModel;
  vetos: SourceMatchVetoModel[];
};

/* Source match stats model (suntzu). */
export interface SourceMatchStatsModel {
  [key: string]: string;
};

/* Source match veto model (suntzu). */
export interface SourceMatchVetoModel {
  guid: string;
  status: string;
  random: boolean;
  round: number;
  selected_by: string;
};
