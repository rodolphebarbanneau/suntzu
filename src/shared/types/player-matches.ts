/* eslint-disable @typescript-eslint/naming-convention */

/* Player matches model (faceit response). */
export interface PlayerMatchesModel {
  end: number;
  from: number;
  items: {
    competition_id: string;
    competition_name: string;
    competition_type: string;
    faceit_url: string;
    finished_at: number;
    game_id: string;
    game_mode: string;
    match_id: string;
    match_type: string;
    max_players: number;
    organizer_id: string;
    playing_players: string[];
    region: string;
    results: {
      score: {
        [key: string]: number;
      };
      winner: string;
    };
    started_at: number;
    status: string;
    teams: {
      [key: string]: {
        avatar: string;
        nickname: string;
        players: {
          avatar: string;
          faceit_url: string;
          game_player_id: string;
          game_player_name: string;
          nickname: string;
          player_id: string;
          skill_level: number;
        }[];
        team_id: string;
        type: string;
      };
    };
    teams_size: number;
  }[];
  start: number;
  to: number;
}
