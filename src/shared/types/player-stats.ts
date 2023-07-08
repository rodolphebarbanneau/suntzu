/* eslint-disable @typescript-eslint/naming-convention */

/* Player match stats (faceit api response) */
export type PlayerMatchesStatsApiResponse = {
  _id: {
    matchId: string;
    playerId: string;
  };
  created_at: string;
  updated_at: string;
  nickname: string;
  playerId: string;
  teamId: string;
  premade: boolean;
  bestOf: string;
  competitionId: string;
  date: number;
  game: string;
  gameMode: string;
  matchId: string;
  matchRound: string;
  played: string;
  status: string;
  elo: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}[];

/* Player overall stats (faceit api response) */
export type PlayerStatsApiResponse = {
  lifetime: {
    _id: {
      game: string;
      playerId: string;
    };
    pendingStats: string[];
    rev: number;
    created_at: number;
    updated_at: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  segments: {
    segments: {
      [key: string]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
    };
    _id: {
      game: string;
      gameMode: string;
      segmentId: string;
      playerId: string;
    };
  }[];
};

/* Player overall stats (faceit open api response) */
export type PlayerStatsOpenResponse = {
  game_id: string;
  lifetime: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  player_id: string;
  segments: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[];
};
