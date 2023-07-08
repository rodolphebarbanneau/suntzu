/* eslint-disable @typescript-eslint/naming-convention */

/* Match stats (faceit api response) */
export type MatchStatsApiResponse = {
  _id: string;
  created_at: number;
  updated_at: number;
  bestOf: string;
  competitionId: string;
  date: number;
  game: string;
  gameMode: string;
  matchId: string;
  matchRound: string;
  played: string;
  teams: {
    teamId: string;
    premade: boolean;
    players: {
      playerId: string;
      nickname: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[];
}[];

/* Match stats (faceit open api response) */
export type MatchStatsOpenResponse = {
  rounds: {
    best_of: string;
    game_id: string;
    game_mode: string;
    match_id: string;
    match_round: string;
    played: string;
    round_stats: {
      [key: string]: string;
    };
    teams: {
      players: {
        nickname: string;
        player_id: string;
        player_stats: {
          [key: string]: string;
        };
      }[];
      premade: boolean;
      team_id: string;
      team_stats: {
        [key: string]: string;
      };
    }[];
  }[];
};
