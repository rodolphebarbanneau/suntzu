/* eslint-disable @typescript-eslint/naming-convention */

/* Match model (faceit response) */
export interface MatchModel {
  best_of: number;
  broadcast_start_time: number;
  broadcast_start_time_label: string;
  calculate_elo: boolean;
  chat_room_id: string;
  competition_id: string;
  competition_name: string;
  competition_type: string;
  configured_at: number;
  demo_url: string[];
  faceit_url: string;
  finished_at: number;
  game: string;
  group: number;
  match_id: string;
  organizer_id: string;
  region: string;
  results: {
    score: {
      [key: string]: number;
    };
    winner: string;
  };
  round: number;
  scheduled_at: number;
  started_at: number;
  status: string;
  teams: {
    [key: string]: {
      avatar: string;
      faction_id: string;
      leader: string;
      name: string;
      roster: {
        anticheat_required: boolean;
        avatar: string;
        game_player_id: string;
        game_player_name: string;
        game_skill_level: number;
        membership: string;
        nickname: string;
        player_id: string;
      }[];
      substituted: boolean;
      type: string;
    };
  };
  version: number;
  voting: {
    location: {
      entities: {
        class_name: string;
        game_location_id: string;
        guid: string;
        image_lg: string;
        image_sm: string;
        name: string;
      }[];
      pick: string[];
    };
    map: {
      entities: {
        class_name: string;
        game_map_id: string;
        guid: string;
        image_lg: string;
        image_sm: string;
        name: string;
      }[];
      pick: string[];
    };
    voted_entity_types: string[];
  };
}
