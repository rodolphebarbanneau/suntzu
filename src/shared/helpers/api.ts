import mem from 'mem';
import pRetry, { AbortError } from 'p-retry';

import type {
  MatchModel,
  MatchStatsModel,
  MatchVetoModel,
  PlayerModel,
  PlayerMatchesModel,
  PlayerStatsModel,
  UserModel,
} from '../types';
import { CACHE_TIME, FACEIT_API_BASE_URL } from '../consts';
import { getCookie } from './cookie';

/**
 * A response wrapped data.
 * @typeParam T - The wrapped data payload type. Default to unknown.
 * @property code - The wrapped data code.
 * @property result - The wrapped data result.
 * @property payload - The wrapped data payload.
 */
export interface WrappedData<T = unknown> {
  code?: string;
  result?: string;
  payload: T;
}

/**
 * An application programming interface.
 */
export class Api {
  /** The api token. */
  private readonly _token: string | null;

  /**
   * Create an application programming interface.
   */
  constructor() {
    // initialize token
    this._token = Api.getLocalToken();

    // initialize memoized
    this.fetch = mem(this.fetch, {
      maxAge: CACHE_TIME,
      cacheKey: (arguments_) => JSON.stringify(arguments_),
    });
  }

  /**
   * Get the api token.
   * @returns The api token.
   */
  static getLocalToken(): string | null {
    return getCookie('t') || localStorage.getItem('token');
  }

  /**
   * Fetch data from `url` and `base` endpoint with specified `searchParams`.
   * @param url - The pathname url to fetch data from.
   * @param options - The url options.
   * @param options.base - The base url to fetch data from.
   * @param options.searchParams - The url search parameters.
   * @returns A response promise or null if error.
   */
  async fetch<T>(
    options: {
      url: string,
      base?: string,
      searchParams?: Record<string, string>,
      unwrap?: boolean,
    },
  ): Promise<T | null> {
    // initialize options
    const url = options.url;
    const base = options.base || FACEIT_API_BASE_URL;
    const searchParams = options.searchParams || {};
    const unwrap = options.unwrap || true;
    // build headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._token}`,
    };
    // build endpoint
    const endpoint = new URL(url, base);
    Object.entries(searchParams).forEach(([name, value]) => {
      endpoint.searchParams.append(name, value);
    });

    // fetch json data from url
    try {
      const response = await pRetry(
        async () => {
          const res = await fetch(endpoint, { method: 'GET', headers });
          if (res.status === 404) {
            throw new AbortError(res.statusText);
          }
          return res;
        },
        { retries: 3 }
      );
      // check network error
      if (!response.ok) throw new Error(
        'Data fetch operation failed. Received an invalid response.'
      );
      // unwrap response data
      if (unwrap) {
        const data: WrappedData<T> = await response.json();
        const { code, result, payload } = data;
        // check for response errors
        if ((code && code.toUpperCase() !== "OPERATION-OK")
          || (result && result.toUpperCase() !== "OK")
        ) throw new Error(
          'Data fetch operation failed. Received an invalid response.'
        );
        return payload;
      }
      return await response.json() as T;
    } catch (err) {
      // log and return null if error
      console.error(err)
      return null;
    }
  }

  /**
   * Fetch the current user.
   * @returns The current user data model.
   */
  async fetchMe(): Promise<UserModel | null> {
    return this.fetch({
      url: '/users/v1/sessions/me',
    });
  }

  /**
   * Fetch match by match id.
   * @param matchId - The match id.
   * @returns The match data model.
   */
  async fetchMatch(matchId: string): Promise<MatchModel | null> {
    return this.fetch({
      url: `/data/v4/matches/${matchId}`,
    });
  }

  /**
   * Fetch match stats by match id.
   * @param matchId - The match id.
   * @returns The match stats data model.
   */
  async fetchMatchStats(matchId: string): Promise<MatchStatsModel | null> {
    return this.fetch({
      url: `/data/v4/matches/${matchId}/stats`,
    });
  }

  /**
   * Fetch match veto by match id.
   * @param matchId - The match id.
   * @returns The match veto data model.
   */
  async fetchMatchVeto(matchId: string): Promise<MatchVetoModel | null> {
    return this.fetch({
      url: `/democracy/v1/${matchId}/history`,
    });
  }

  /**
   * Fetch player by player id.
   * @param playerId - The player id.
   * @returns The player data model.
   */
  async fetchPlayer(playerId: string): Promise<PlayerModel | null> {
    return this.fetch({
      url: `/data/v4/players/${playerId}`,
    });
  }

  /**
   * Fetch player matches by player id.
   * @param playerId - The player id.
   * @returns The player matches data model.
   */
  async fetchPlayerMatches(playerId: string): Promise<PlayerMatchesModel | null> {
    return this.fetch({
      url: `/data/v4/players/${playerId}/history`,
    });
  }

  /**
   * Fetch player stats by player id.
   * @param playerId - The player id.
   * @returns The player stats data model.
   */
  async fetchPlayerStats(playerId: string): Promise<PlayerStatsModel | null> {
    return this.fetch({
      url: `/data/v4/players/${playerId}/stats/csgo`,
    });
  }
}
