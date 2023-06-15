/* eslint-disable @typescript-eslint/naming-convention */

/** Player stats model (faceit response). */
export interface PlayerStatsModel {
  game_id: string;
  lifetime: {
    [key: string]: string;
  };
  player_id: string;
  segments: {
    [key: string]: string;
  }[];
}
