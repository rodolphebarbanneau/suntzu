import type {
  MetricsRange,
  MetricsMapModel,
  MetricsPlayerModel,
  SourceModel,
  SourceMatchModel,
  SourceMatchStatsModel,
  SourceMatchVetoModel,
} from '../types';
import type { Api } from './api';

import { METRICS_RANGE } from '../consts';

/**
 * Matchroom metrics.
 */
export class Metrics {
  /* The application programming interface used to fetch data. */
  private readonly _api: Api;

  /* The matchroom id. */
  private readonly _matchId: string;

  /* The matchroom metrics range. */
  private readonly _range: MetricsRange;

  /* The source data. */
  private _source?: SourceModel | null;

  /* The map metrics. */
  private _maps?: MetricsMapModel | null;

  /* The player metrics. */
  private _players?: MetricsPlayerModel | null;

  /**
   * Create matchroom metrics.
   * @param api - The application programming interface used to fetch data.
   * @param matchId - The matchroom id.
   * @param range - The matchroom metrics range.
   */
  private constructor(
    api: Api,
    matchId: string,
    range?: MetricsRange,
  ) {
    // initialize
    this._api = api;
    this._matchId = matchId;
    this._range = range ?? METRICS_RANGE;
  }

  /* Get the application programming interface used to fetch data. */
  get api(): Api { return this._api; }

  /* Get the matchroom id. */
  get matchId(): string { return this._matchId; }

  /* Get the matchroom metrics range. */
  get range(): MetricsRange { return this._range; }

  /* Get the source data. */
  get source(): SourceModel | null { return this._source ?? null; }

  /* Get the map metrics. */
  get maps(): MetricsMapModel | null { return this._maps ?? null; }

  /* Get the player metrics. */
  get players(): MetricsPlayerModel | null { return this._players ?? null; }

  /**
   * Initialize matchroom metrics.
   * @param api - The application programming interface used to fetch data.
   * @param matchId - The matchroom id.
   * @param range - The matchroom metrics range.
   * @returns A matchroom metrics instance.
   */
  public static async initialize(
    api: Api,
    matchId: string,
    range?: MetricsRange,
  ): Promise<Metrics> {
    // create metrics
    const metrics = new Metrics(api, matchId, range);
    // initialize
    metrics._source = await metrics.getSource();
    return metrics;
  }

  /**
   * Get the matchroom metrics range as a number tuple. The first element is the offset value and
   * the second element is the limit value.
   * @returns The matchroom match metrics range.
   */
  public getMatchRange(): [number, number] {
    switch (this._range.match) {
      case '10':  return [0, 10];
      case '20':  return [0, 20];
      case '50':  return [0, 50];
      case '100': return [0, 100];
      default:    return [0, 100];
    }
  }

  /**
   * Get the matchroom metrics range as a number tuple. The first element is the start time and
   * the second element is the end time specified as a Unix timestamp.
   * @returns The matchroom time metrics range.
   */
  public getTimeRange(): [number, number] {
    const end = Math.floor(Date.now() / 1000);
    switch (this._range.time) {
      case '1W': return [end -   (7 * 24 * 60 * 60), end];
      case '2W': return [end -  (14 * 24 * 60 * 60), end];
      case '1M': return [end -  (30 * 24 * 60 * 60), end];
      case '3M': return [end -  (90 * 24 * 60 * 60), end];
      case '6M': return [end - (180 * 24 * 60 * 60), end];
      default:   return [end - (180 * 24 * 60 * 60), end];
    }
  }

  /**
   * Get the source model.
   * @returns The source model.
   */
  public async getSource(): Promise<SourceModel | null> {
    // fetch matchroom
    const matchroom = await this._api.fetchMatch(this._matchId);
    // check matchroom
    if (!matchroom) return null;
    // fetch teams
    const teams = await Promise.all(
      Object.entries(matchroom.teams ?? {}).map(async ([faction, team]) => {
        // fetch roster
        const roster = await Promise.all(team.roster.map(async (player) => {
          // fetch matches
          const matches = await this.getPlayerMatches(player.player_id, matchroom.game);
          // return player matches
          return {
            player_id: player.player_id,
            nickname: player.nickname,
            matches: matches ?? [],
          };
        }));
        // return team
        return [
          faction,
          {
            faction_id: team.faction_id,
            name: team.name,
            leader: team.leader,
            roster: roster ?? [],
          },
        ];
      }),
    );
    // return teams
    return {
      match_id: matchroom.match_id,
      teams: Object.fromEntries(teams ?? []),
    };
  }

  /**
   * Get the player matches source model for the specified player.
   * @param playerId - The player id.
   * @param gameId - The game id.
   * @returns The player matches source model.
   */
  public async getPlayerMatches(
    playerId: string,
    gameId: string,
  ): Promise<SourceMatchModel[] | null> {
    // retrieve ranges
    const matchRange = this.getMatchRange();
    const timeRange = this.getTimeRange();
    // fetch matches
    const matches = await this._api.fetchPlayerMatches(
      playerId,
      gameId,
      timeRange[0],
      timeRange[1],
      matchRange[0],
      matchRange[1],
    );
    // check matches
    if (!matches) return null;
    // return player matches
    return (
      await Promise.all(matches.items.map((match) =>
        this.getPlayerMatch(playerId, match.match_id)
      ))
    ).filter((match) => match !== null) as SourceMatchModel[];
  }

  /**
   * Get the player match source model for the specified match.
   * @param playerId - The player id.
   * @param matchId - The match id.
   * @returns The player match source model.
   */
  public async getPlayerMatch(
    playerId: string,
    matchId: string,
  ): Promise<SourceMatchModel | null> {
    // fetch in parallel match, stats, and vetos
    const [match, stats, vetos] = await Promise.all([
      this._api.fetchMatch(matchId),
      this.getPlayerMatchStats(matchId, playerId),
      this.getPlayerMatchVetos(matchId),
    ]);
    // check match
    if (!match) return null;
    // retrieve player team
    const [faction, team] = Object
      .entries(match.teams ?? {})
      .find(([, team]) => team.roster.some(
        (player) => player.player_id === playerId
      )) ?? [];
    // return player match
    return {
      match_id: matchId,
      timestamp: match.finished_at,
      map_pick: match.voting.map.pick[0],
      is_winner: match.results.winner === faction,
      is_leader: team?.leader === playerId ?? false,
      roster: team?.roster.map((player) => ({
        player_id: player.player_id,
        nickname: player.nickname,
      })) ?? [],
      stats: stats ?? {},
      vetos: vetos?.filter(
        (veto) => !veto.random && veto.selected_by === faction
      ) ?? [],
    };
  }

  /**
   * Get the player stats source model for the specified match.
   * @param playerId - The player id.
   * @param matchId - The match id.
   * @returns The player stats source model.
   */
  public async getPlayerMatchStats(
    playerId: string,
    matchId: string,
  ): Promise<SourceMatchStatsModel | null> {
    // fetch stats
    const stats = await this._api.fetchMatchStats(matchId);
    // check stats
    if (!stats) return null;
    // return player stats
    for (const team of stats.rounds[0].teams) {
      for (const player of team.players) {
        if (player.player_id === playerId) {
          return player.player_stats;
        }
      }
    }
    return null;
  }

  /**
   * Get the map vetos source model for the specified match.
   * @param matchId - The match id.
   * @returns The map vetos source model.
   */
  public async getPlayerMatchVetos(
    matchId: string,
  ): Promise<SourceMatchVetoModel[] | null> {
    // fetch vetos
    const vetos = await this._api.fetchMatchVetos(matchId);
    // check vetos
    if (!vetos) return null;
    // return player vetos
    return vetos.tickets
      .find((ticket) => ticket.entity_type === 'map')?.entities ?? null;
  }
}
