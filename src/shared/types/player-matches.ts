/* eslint-disable @typescript-eslint/naming-convention */

/* Player match (faceit api response) */
export type PlayerMatchesApiResponse = {
  matchId: string;
  type: string;
  game: string;
  region: string;
  winner: string;
  startedAt: string;
  finishedAt: string;
  state: string;
  gameModeLabel: {
    [key: string]: string;
  };
  gameModeType: string;
  teams: {
    [key: string]: {
      id: string;
      leader: string;
      name: string;
      avatar: string;
      roster: {
        id: string;
        nickname: string;
        gameId: string;
        gameName: string;
        avatar: string;
        gameSkillLevel: number;
        acReq: boolean;
      }[];
    };
  };
  results: {
    winner: string;
    factions: {
      [key: string]: {
        score: number;
      };
    };
    ascScore: boolean;
    leavers: string[];
    afk: string[];
  }[];
  entityCustom: {
    queueId: string;
    parties: {
      [key: string]: string[];
    };
    matcherMatchId: string;
    partyQueueDuration: {
      [key: string]: number;
    };
    effectiveRanking: number;
  };
  competition: {
    name: string;
    type: string;
    id: string;
  };
  organizer: {
    id: string;
  };
  playingPlayers: string[];
  maxPlayers: number;
}[];


/* Player matches (faceit open api response) */
export type PlayerMatchesOpenResponse = {
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
};
