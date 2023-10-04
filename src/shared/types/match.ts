/* eslint-disable @typescript-eslint/naming-convention */

/* Match (faceit api response) */
export type MatchApiResponse = {
	id: string;
	type: string;
	game: string;
	region: string;
	organizerId: string;
	entity: {
		type: string;
		id: string;
		name: string;
	};
	allowOngoingJoin: boolean;
	anticheatRequired: boolean;
	anticheatMode: string;
	calculateElo: boolean;
	skillFeedback: boolean;
	afkAction: string;
	fbiManagement: boolean;
	adminTool: boolean;
	checkIn: {
		time: number;
		totalCheckedIn: number;
		totalPlayers: number;
		endTime: string;
		checkedIn: boolean;
	};
	state: string;
	status: string;
	states: string[];
	teams: {
		[key: string]: {
			id: string;
			type: string;
			name: string;
			avatar: string;
			leader: string;
			roster: {
				id: string;
				nickname: string;
				avatar: string;
				gameId: string;
				gameName: string;
				gameSkillLevel: number;
				elo: number;
				acReq: boolean;
				partyId: string;
				membership: string[];
			}[];
			stats: {
				winProbability: number;
				skillLevel: {
					average: number;
					range: {
						min: number;
						max: number;
					};
				};
				rating: number;
			};
			substituted: boolean;
		};
	};
	spectators: string[];
	voting?: {
		voted_entity_types: string[];
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
	};
	summaryResults: {
		ascScore: boolean;
		winner: string;
		leavers: string[];
		afk: string[];
		factions: {
			[key: string]: {
				score: number;
			};
		};
	};
	results: {
		ascScore: boolean;
		winner: string;
		leavers: string[];
		afk: string[];
		factions: {
			[key: string]: {
				score: number;
			};
		};
	}[];
	demoURLs: string[];
	startedAt: string;
	configuredAt: string;
	finishedAt: string;
	timeToConnect: number;
	version: number;
	createdAt: string;
	lastModified: string;
	parties: {
		partyId: string;
		users: string[];
	}[];
  matchCustom: {
    id: string;
    overview: {
      description: { [key: string]: string };
      game: string;
      label: { [key: string]: string };
      name: string;
      region: string;
      round: {
        label: { [key: string]: string };
        id: string;
        type: string;
        to_play: number;
        to_win: number;
      };
      detections: {
        afk: boolean;
        leavers: boolean;
      };
      spectators: boolean;
      elo_mode: string;
      expire_seconds: number;
      flexible_factions: boolean;
      grouping_stats: string;
      max_players: number;
      min_players: number;
      team_size: number;
      time_to_connect: number;
      time_out_select_random: boolean;
      organizer_id: string;
      elo_type: string;
      match_configuration_type: {
        value: string;
        label: { [key: string]: string };
      };
      match_finished_type: {
        value: string;
        label: { [key: string]: string };
      };
      game_type: string;
    };
    tree: {
      game_config: {
        data_type: string;
        flags: { [key: string]: string };
        id: string;
        leaf_node: boolean;
        values: {
          value: string;
        };
      };
      location: {
        data_type: string;
        display: {
          priority: number;
        };
        flags: { [key: string]: string };
        id: string;
        label: { [key: string]: string };
        leaf_node: boolean;
        name: string;
        values: {
          multi_select: {
            memberships: string[];
            minimum: number;
          };
          value: {
            class_name: string;
            game_location_id: string;
            guid: string;
            image_lg: string;
            image_sm: string;
            name: string;
          }[];
          voting_steps: string[];
        };
      };
      map: {
        data_type: string;
        display: {
          priority: number;
        };
        flags: {
          votable: boolean;
        };
        id: string;
        label: { [key: string]: string };
        leaf_node: boolean;
        name: string;
        values: {
          multi_select: {
            memberships: string[];
            minimum: number;
          };
          value: {
            class_name: string;
            game_map_id: string;
            guid: string;
            image_lg: string;
            image_sm: string;
            name: string;
          }[];
          voting_steps: string[];
        };
      };
    };
  };
};

/* Match (faceit open api response) */
export type MatchOpenResponse = {
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
  voting?: {
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
};
