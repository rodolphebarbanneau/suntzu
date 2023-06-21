import mem from 'mem';
import pRetry, { AbortError } from 'p-retry';

import type {
  MatchModel,
  MatchStatsModel,
  MatchVetosModel,
  PlayerModel,
  PlayerMatchesModel,
  PlayerStatsModel,
  UserModel,
} from '../types';
import {
  CACHE_TIME,
  FACEIT_OPEN_API_KEY,
  FACEIT_OPEN_BASE_URL,
  FACEIT_API_BASE_URL,
} from '../settings';
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
 * The application programming interface for managing HTTP requests.
 * It is mainly used for fetching data from the Faceit Open API and the regular Faceit API. It also
 * utilizes the `pRetry` package for robustness against network errors, retrying requests multiple
 * times before ultimately failing. Results are also cached for a specific amount of time defined in
 * the settings to minimize unnecessary network usage.
 */
export class Api {
  /** The api token. */
  private readonly _token: string | null;

  /**
   * Create an application programming interface.
   * @param token - The api token.
   */
  constructor(token?: string) {
    // initialize token
    this._token = token ?? Api.getLocalToken();

    // initialize memoized
    this.fetch = mem(this.fetch, {
      maxAge: CACHE_TIME,
      cacheKey: (args) => JSON.stringify(args),
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
      url: string;
      base?: string;
      searchParams?: Record<string, string>;
      unwrap?: boolean;
    },
  ): Promise<T | null> {
    // initialize options
    const url = options.url;
    const base = options.base ?? FACEIT_OPEN_BASE_URL;
    const searchParams = options.searchParams ?? {};
    const unwrap = options.unwrap ?? true;
    // build headers
    const bearer = base === FACEIT_OPEN_BASE_URL ? FACEIT_OPEN_API_KEY : this._token;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
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
        if ((code && code.toUpperCase() !== 'OPERATION-OK')
          || (result && result.toUpperCase() !== 'OK')
        ) throw new Error(
          'Data fetch operation failed. Received an invalid response.'
        );
        return payload;
      }
      return await response.json() as T;
    } catch (err) {
      // log and return null if error
      // eslint-disable-next-line no-console
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
      base: FACEIT_API_BASE_URL,
    });
  }

  /**
   * Fetch match by match id.
   * @param matchId - The match id.
   * @returns The match data model.
   */
  async fetchMatch(
    matchId: string,
  ): Promise<MatchModel | null> {
    return this.fetch({
      url: `/data/v4/matches/${matchId}`,
    });
  }

  /**
   * Fetch match stats by match id.
   * @param matchId - The match id.
   * @returns The match stats data model.
   */
  async fetchMatchStats(
    matchId: string,
  ): Promise<MatchStatsModel | null> {
    return this.fetch({
      url: `/data/v4/matches/${matchId}/stats`,
    });
  }

  /**
   * Fetch match vetos by match id.
   * @param matchId - The match id.
   * @returns The match vetos data model.
   */
  async fetchMatchVetos(
    matchId: string,
  ): Promise<MatchVetosModel | null> {
    return this.fetch({
      url: `/democracy/v1/${matchId}/history`,
      base: FACEIT_API_BASE_URL,
    });
  }

  /**
   * Fetch player by player id.
   * @param playerId - The player id.
   * @returns The player data model.
   */
  async fetchPlayer(
    playerId: string,
  ): Promise<PlayerModel | null> {
    return this.fetch({
      url: `/data/v4/players/${playerId}`,
    });
  }

  /**
   * Fetch player matches by player id.
   * @param playerId - The player id.
   * @returns The player matches data model.
   */
  async fetchPlayerMatches(
    playerId: string,
    game: string,
    from = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60),
    to = Math.floor(Date.now() / 1000),
    offset = 0,
    limit = 20,
  ): Promise<PlayerMatchesModel | null> {
    return this.fetch({
      url: `/data/v4/players/${playerId}/history`
        + `/?game=${game}&from=${from}&to=${to}&offset=${offset}&limit=${limit}`,
    });
  }

  /**
   * Fetch player stats by player id.
   * @param playerId - The player id.
   * @returns The player stats data model.
   */
  async fetchPlayerStats(
    playerId: string,
    gameId: string,
  ): Promise<PlayerStatsModel | null> {
    return this.fetch({
      url: `/data/v4/players/${playerId}/stats/${gameId}`,
    });
  }
}
