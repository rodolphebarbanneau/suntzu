import type {
  MatchesOption,
  PlayersOption,
  TimeSpanOption,
  MetricsModel,
  SkillMetricsModel,
  OtherMetricsModel,
  DropMetricsModel,
  SourceModel,
  MatchSourceModel,
  MatchStatsSourceModel,
  MatchVotingSourceModel,
} from '../types';
import type { Api } from './api';
import { getTimestamp } from '../helpers';
import { StatsKey } from '../types';

/**
 * Metrics options.
 * It is used to define the metrics options for a match source model. It includes options for
 * matches, players, and time span. These options are required to fetch data for the match source
 * model effectively.
 */
export interface MetricsOptions {
  /* The metrics matches option */
  matches: MatchesOption;
  /* The metrics players option */
  players: PlayersOption;
  /* The metrics time span option */
  timeSpan: TimeSpanOption;
}

/**
 * Metrics data.
 * It is used to define the metrics data for a match source. It includes data for players and teams.
 */
export interface MetricsData {
  /* The players metrics data */
  players: Record<string, MetricsModel>;
  /* The teams metrics data */
  teams: Record<string, MetricsModel>;
}

/**
 * Metrics.
 * It is responsible for aggregating and managing metrics related to a specific match, including
 * source data, maps metrics, players metrics, and more. This class makes use of an API to fetch and
 * provide access to these metrics, with specific options.
 */
export class Metrics {
  /* The application programming interface used to fetch data */
  private readonly _api: Api;

  /* The source match id */
  private readonly _matchId: string;

  /* The metrics options */
  private readonly _options: MetricsOptions;

  /* The build tokens (used to handle the metrics build promise races) */
  private _tokens: Record<string, string> = {};

  /* The source data */
  private _source: SourceModel | null = null;

  /* The players metrics */
  private _players: Record<string, MetricsModel> | null = null;

  /* The teams metrics */
  private _teams: Record<string, MetricsModel> | null = null;

  /**
   * Create metrics.
   * @param api - The application programming interface used to fetch data.
   * @param matchId - The source match id.
   * @param options - The metrics options.
   */
  private constructor(
    api: Api,
    matchId: string,
    options: MetricsOptions,
  ) {
    // initialize
    this._api = api;
    this._matchId = matchId;
    this._options = options;
  }

  /* Get the application programming interface used to fetch data. */
  get api(): Api {
    return this._api;
  }

  /* Get the source match id */
  get matchId(): string {
    return this._matchId;
  }

  /* Get the metrics options. */
  get options(): MetricsOptions {
    return this._options;
  }

  /* Get the source data */
  get source(): SourceModel | null {
    return this._source;
  }

  /* Get the players metrics */
  get players(): Record<string, MetricsModel> | null {
    return this._players;
  }

  /* Get the teams metrics */
  get teams(): Record<string, MetricsModel> | null {
    return this._teams;
  }

  /* Get the metrics data */
  get data(): MetricsData {
    return {
      players: this._players ?? {},
      teams: this._teams ?? {},
    };
  }

  /**
   * Initialize metrics.
   * @param api - The application programming interface used to fetch data.
   * @param matchId - The source match id.
   * @param options - The metrics options.
   * @returns A metrics instance.
   */
  static async initialize(
    api: Api,
    matchId: string,
    options: MetricsOptions,
  ): Promise<Metrics> {
    // create metrics
    const metrics = new Metrics(api, matchId, options);
    // initialize
    if (!(await metrics.buildSource())) throw new Error('Failed to build source data');
    if (!(await metrics.buildMetrics())) throw new Error('Failed to build metrics data');
    return metrics;
  }

  /**
   * Get the metrics range of matches as a tuple of 2 numbers. The first element is the offset value
   * and the second element is the limit value.
   * @param option - The matches option (optional).
   * @returns The metrics range of matches.
   */
  getMatchesRange(option?: MatchesOption): [number, number] {
    switch (option) {
      case '10':  return [0, 10];
      case '20':  return [0, 20];
      case '50':  return [0, 50];
      case '100': return [0, 100];
      default:    return [0, 100];
    }
  }

  /**
   * Get the metrics range of players as a tuple of 2 numbers. The elements are respectively the
   * minimum and maximum number of team players that must be present in a match to be considered for
   * the metrics.
   * @param option - The players option (optional).
   * @returns The metrics range of players.
   */
  getPlayersRange(option?: PlayersOption): [number, number] {
    switch (option) {
      case 'ANY':   return [1, 5];
      case 'MIN:2': return [2, 5];
      case 'MIN:3': return [3, 5];
      case 'MIN:4': return [4, 5];
      case 'ALL':   return [5, 5];
      default:      return [1, 5];
    }
  }

  /**
   * Get the metrics range of time span as a tuple of 2 number. The first element is the start of
   * the time interval and the second element is the end of the time interval specified as a Unix
   * timestamp.
   * @param option - The time span option (optional).
   * @returns The metrics range of time span.
   */
  getTimeSpanRange(option?: TimeSpanOption): [number, number] {
    const end = Math.floor(Date.now() / 1000);
    switch (option) {
      case '1W': return [end -   (7 * 24 * 60 * 60), end];
      case '2W': return [end -  (14 * 24 * 60 * 60), end];
      case '1M': return [end -  (30 * 24 * 60 * 60), end];
      case '3M': return [end -  (90 * 24 * 60 * 60), end];
      case '6M': return [end - (180 * 24 * 60 * 60), end];
      default:   return [end - (180 * 24 * 60 * 60), end];
    }
  }

  /**
   * Get the player matches source model for the specified player and game.
   * @param playerId - The player id.
   * @param gameId - The game id.
   * @returns The player matches source model.
   */
  async getPlayerMatches(
    playerId: string,
    gameId: string,
  ): Promise<MatchSourceModel[] | null> {
    // retrieve ranges
    const matchesRange = this.getMatchesRange();
    const timeSpanRange = this.getTimeSpanRange();
    // fetch in parallel matches and stats
    const [matches, stats] = await Promise.all([
      this._api.fetchPlayerMatches(
        playerId,
        gameId,
        timeSpanRange[0],
        timeSpanRange[1],
        matchesRange[0],
        matchesRange[1],
      ),
      this._api.fetchPlayerMatchesStats(
        playerId,
        gameId,
        matchesRange[1],
      ),
    ]);
    // check matches
    if (!matches) return null;
    // return player matches
    return matches.map((match) => {
      // retrieve stats
      const stat = stats?.find((s) => s.matchId === match.matchId);
      // check stats
      if (!stat) return null;
      // retrieve player team
      const [faction, team] = Object
        .entries(match.teams ?? {})
        .find(([, target]) => target.roster.some(
          (player) => player.id === playerId
        )) ?? [];
      // build player match
      return {
        matchId: match.matchId,
        timestamp: getTimestamp(match.finishedAt),
        mapPick: stat[StatsKey.Map] as string,
        isWinner: match.winner === faction,
        isLeader: team?.leader === playerId ?? false,
        faction: faction ?? '',
        roster: team?.roster.map((player) => ({
          playerId: player.id,
          nickname: player.nickname,
        })) ?? [],
        stats: Object.fromEntries(
          Object.entries(stat).filter(
            ([key]) => Object.values(StatsKey).includes(key as StatsKey)
          )
        ),
      };
    }).filter((match): match is MatchSourceModel => match !== null);
  }

  /**
   * Get the player match source model for the specified player and match.
   * @param playerId - The player id.
   * @param matchId - The match id.
   * @returns The player match source model.
   */
  async getPlayerMatch(
    playerId: string,
    matchId: string,
  ): Promise<MatchSourceModel | null> {
    // fetch in parallel match, stats, and voting
    const [match, stats, voting] = await Promise.all([
      this._api.fetchMatch(matchId),
      this.getPlayerMatchStats(matchId, playerId),
      this.getPlayerMatchVoting(matchId),
    ]);
    // check match
    if (!match) return null;
    // retrieve player team
    const [faction, team] = Object
      .entries(match.teams ?? {})
      .find(([, target]) => target.roster.some(
        (player) => player.id === playerId
      )) ?? [];
    // return player match
    return {
      matchId: matchId,
      timestamp: getTimestamp(match.finishedAt),
      mapPick: match.voting.map.pick[0],
      isWinner: match.summaryResults.winner === faction,
      isLeader: team?.leader === playerId ?? false,
      faction: faction ?? '',
      roster: team?.roster.map((player) => ({
        playerId: player.id,
        nickname: player.nickname,
      })) ?? [],
      stats: stats ?? {},
      voting: voting?.filter(
        (vote) => !vote.random && vote.selectedBy === faction
      ) ?? [],
    };
  }

  /**
   * Get the player match stats source model for the specified player and match.
   * @param playerId - The player id.
   * @param matchId - The match id.
   * @returns The player stats source model.
   */
  async getPlayerMatchStats(
    playerId: string,
    matchId: string,
  ): Promise<MatchStatsSourceModel | null> {
    // fetch stats
    const stats = await this._api.fetchMatchStats(matchId);
    // check stats
    if (!stats) return null;
    // return player stats
    for (const team of stats[0].teams) {
      for (const player of team.players) {
        if (player.player_id === playerId) {
          return player.player_stats;
        }
      }
    }
    return null;
  }

  /**
   * Get the map voting source model for the specified match.
   * @param matchId - The match id.
   * @returns The map voting source model.
   */
  async getPlayerMatchVoting(
    matchId: string,
  ): Promise<MatchVotingSourceModel[] | null> {
    // fetch voting
    const voting = await this._api.fetchMatchVoting(matchId);
    // check voting
    if (!voting) return null;
    // return player voting
    return voting.tickets
      .find((ticket) => ticket.entity_type === 'map')?.entities
      .map((entity) => ({
        guid: entity.guid,
        status: entity.status,
        random: entity.random,
        round: entity.round,
        selectedBy: entity.selected_by,
      })) ?? null;
  }

  /**
   * Build the source model.
   * @returns A promise resolving to true if the source model was built successfully, false
   * otherwise.
   */
  async buildSource(): Promise<boolean> {
    // set build token
    const token = Math.random().toString(36).substring(2, 15);
    this._tokens['source'] = token;
    // fetch match
    const match = await this._api.fetchMatch(this._matchId);
    // check match
    if (!match) {
      this._source = null;
      return false;
    }
    // fetch teams
    const teams = await Promise.all(
      Object.entries(match.teams ?? {}).map(async ([faction, team]) => {
        // fetch roster
        const roster = await Promise.all(team.roster.map(async (player) => {
          // fetch matches
          const matches = await this.getPlayerMatches(player.id, match.game);
          // return player matches
          return {
            playerId: player.id,
            nickname: player.nickname,
            matches: matches ?? [],
          };
        }));
        // return team
        return [
          faction,
          {
            factionId: team.id,
            name: team.name,
            leader: team.leader,
            roster: roster ?? [],
          },
        ];
      }),
    );

    // discard build if token has changed
    if (this._tokens['source'] !== token) throw new Error('Operation cancelled');
    // write source and return
    this._source = {
      matchId: match.id,
      teams: Object.fromEntries(teams ?? []),
    };
    return true;
  }

  /**
   * Build the metrics.
   * @returns Whether the metrics was built successfully.
   */
  async buildMetrics(): Promise<boolean> {
    // set build token
    const token = Math.random().toString(36).substring(2, 15);
    this._tokens['metrics'] = token;

    // check source
    if (!this._source) {
      this._players = null;
      this._teams = null;
      return false;
    };

    // add apply function helper
    const add = (value?: number, update?: number): number => {
      return (value ?? 0) + (update ?? 0)
    };

    // retrieve ranges
    const matchesRange = this.getMatchesRange(this._options.matches);
    const playersRange = this.getPlayersRange(this._options.players);
    const timeSpanRange = this.getTimeSpanRange(this._options.timeSpan);

    // initialize metrics
    const players: Record<string, MetricsModel> = {};
    const teams: Record<string, MetricsModel> = {};
    // build metrics
    for (const [faction, team] of Object.entries(this._source.teams)) {
      // initialize team metrics
      this._initializeMetrics(teams, faction);

      // retrieve team match ids
      const matchIds = [...new Set(
        team.roster.flatMap((player) => player.matches.map((match) => match.matchId))
      )];

      for (const player of team.roster) {
        // initialize player metrics
        this._initializeMetrics(players, player.nickname);

        for (let i = 0; i < player.matches.length; i++) {
          // retrieve match data
          const match = player.matches[i];
          const teammates = team.roster.filter(
            (p1) => match.roster.some((p2) => p2.playerId === p1.playerId)
          );
          // retrieve match index
          const matchIndex = matchIds.indexOf(match.matchId);
          if (matchIndex > -1) {
            matchIds.splice(matchIndex, 1);
          }

          // check matches range
          if (i < matchesRange[0] || i >= matchesRange[1]) continue;
          // check players range
          if (teammates.length < playersRange[0] || teammates.length >= playersRange[1]) continue;
          // check time span range
          if (match.timestamp < timeSpanRange[0] || match.timestamp >= timeSpanRange[1]) continue;

          // retrieve skill metrics updates
          const skillUpdates: SkillMetricsModel = {
            skillMatches: 1,
            matches: matchIndex > -1 ? 1 : 0,
            winRate: match.isWinner ? 1 : 0,
            avgKills: parseFloat(match.stats[StatsKey.Kills]) ?? 0,
            avgDeaths: parseFloat(match.stats[StatsKey.Deaths]) ?? 0,
            avgHeadshots: parseFloat(match.stats[StatsKey.Headshots]) ?? 0,
            avgKd: parseFloat(match.stats[StatsKey.KillDeathRatio]) ?? 0,
            avgKr: parseFloat(match.stats[StatsKey.KillRoundRatio]) ?? 0,
          };
          // apply skill metrics updates
          this._applyUpdates(add, players[player.nickname], 'overall', skillUpdates);
          this._applyUpdates(add, players[player.nickname].maps, match.mapPick, skillUpdates);
          this._applyUpdates(add, teams[faction], 'overall', skillUpdates);
          this._applyUpdates(add, teams[faction].maps, match.mapPick, skillUpdates);

          // retrieve other metrics updates
          const otherUpdates: OtherMetricsModel = {
            pickRate: 1,
          };
          // apply other metrics updates
          this._applyUpdates(add, players[player.nickname].maps, match.mapPick, otherUpdates);
          this._applyUpdates(add, teams[faction].maps, match.mapPick, otherUpdates);

          // retrieve drop metrics updates
          const dropUpdates: Record<string, DropMetricsModel> = {};
          if (match.voting) {
            const votingLength = match.voting.length;
            match.voting.sort((a, b) => a.round - b.round).forEach((vote, index) => {
              if (vote.selectedBy === match.faction) {
                // true if map was dropped (excluding random vetos)
                if (!vote.random && vote.status === 'drop') {
                  dropUpdates[vote.guid] = {
                    dropMatches: 1,
                    dropRate: 1,
                  };
                }
              } else {
                // false if map was picked or left
                if (index >= votingLength - 2) {
                  dropUpdates[vote.guid] = {
                    dropMatches: 1,
                    dropRate: 0,
                  };
                }
              }
            });
            // apply drop metrics updates
            for (const [map, updates] of Object.entries(dropUpdates)) {
              this._applyUpdates(add, players[player.nickname].maps, map, updates);
              this._applyUpdates(add, teams[faction].maps, map, updates);
            }
          }
        }
      }
    }
    // average player and team metrics
    this._averageMetrics(players);
    this._averageMetrics(teams);

    // discard build if token has changed
    if (this._tokens['metrics'] !== token) throw new Error('Operation cancelled');
    // write metrics and return
    this._players = players;
    this._teams = teams;
    return true;
  }

  /**
   * An auxiliary function for initializing metrics.
   * @param obj - The object to initialize.
   * @param property - The name of the object property to initialize.
   */
  private _initializeMetrics(
    obj: Record<string, MetricsModel>,
    property: string,
  ) {
    if(!obj[property]) {
      obj[property] = { overall: {}, maps: {} };
    }
  }

  /**
   * An auxiliary function for applying updates to metrics.
   * @param apply - A function that applies an update to a value.
   * @param obj - The object to apply updates to.
   * @param property - The property to apply updates to.
   * @param updates - The updates to apply.
   */
  private _applyUpdates<T extends object, K extends keyof T>(
    apply: (value?: number, update?: number) => number,
    obj: T,
    property: K,
    updates: Partial<T[K]>,
  ): void {
    // check if property exists
    if (!obj[property]) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      obj[property] = {} as T[K];
    }
    // apply updates
    const target = obj[property] as unknown as Record<string, number | undefined>;
    for (const [key, update] of Object.entries(updates)) {
      if (typeof update !== 'number') continue;
      target[key] = (
        Object.prototype.hasOwnProperty.call(target, key) && typeof target[key] === 'number'
          ? apply(target[key], update)
          : update
      );
    }
  }

  /**
   * An auxiliary function for averaging metrics.
   * @param obj - The object to average metrics in.
   */
  private _averageMetrics(obj: Record<string, MetricsModel>) {
    // divide apply function helper
    const divide = (value?: number, update?: number): number => {
      return (value ?? 0) / (update ?? 1)
    };

    // average metrics
    for (const metrics of Object.values(obj)) {
      // average overall metrics
      const overall = metrics.overall;
      this._applyUpdates(divide, metrics, 'overall', {
        matches: overall.skillMatches ?? 1,
        winRate: overall.skillMatches ?? 1,
        avgKills: overall.skillMatches ?? 1,
        avgDeaths: overall.skillMatches ?? 1,
        avgHeadshots: overall.skillMatches ?? 1,
        avgKd: overall.skillMatches ?? 1,
        avgKr: overall.skillMatches ?? 1,
      });
      // average map metrics
      const maps = metrics.maps;
      for (const [key, map] of Object.entries(maps)) {
        this._applyUpdates(divide, maps, key, {
          matches: map.skillMatches ?? 1,
          winRate: map.skillMatches ?? 1,
          avgKills: map.skillMatches ?? 1,
          avgDeaths: map.skillMatches ?? 1,
          avgHeadshots: map.skillMatches ?? 1,
          avgKd: map.skillMatches ?? 1,
          avgKr: map.skillMatches ?? 1,
          pickRate: map.skillMatches ?? 1,
          dropRate: map.dropMatches ?? 1,
        });
      }
    }
  }
}
