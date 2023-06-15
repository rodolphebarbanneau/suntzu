/* eslint-disable @typescript-eslint/naming-convention */

/** Match stats model (faceit response). */
export interface MatchStatsModel {
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
}
