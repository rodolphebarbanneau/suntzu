import browser from 'webextension-polyfill';
import { memDecorator } from 'mem';

import type {
  MatchApiResponse,
  MatchOpenResponse,
  MatchStatsApiResponse,
  MatchStatsOpenResponse,
  MatchVotingApiResponse,
  PlayerApiResponse,
  PlayerOpenResponse,
  PlayerMatchesApiResponse,
  PlayerMatchesOpenResponse,
  PlayerMatchesStatsApiResponse,
  PlayerStatsApiResponse,
  PlayerStatsOpenResponse,
} from '../types';
import {
  FACEIT_API_BASE_URL,
  FACEIT_API_TOKEN,
  FACEIT_OPEN_BASE_URL,
  FACEIT_OPEN_TOKEN,
} from '../settings';
import { formatTimestamp } from '../helpers';

/* The application programming interface cache */
export const API_CACHE = new Map();
export const API_CACHE_TIME = 3600000; // 60 minutes

/**
 * An application programming interface request.
 */
export interface ApiRequest {
  /* The request method */
  method: 'GET';
  /* The request endpoint */
  endpoint: URL;
  /* The request headers */
  headers: Record<string, string>;
}

/**
 * An application programming interface response.
 * @typeParam T - The response data type.
 */
export interface ApiResponse<T> {
  /* The response status */
  status: number;
  /* The response data */
  data?: T;
  /* The response error */
  error?: string;
}

/**
 * A response wrapped data.
 * @typeParam T - The wrapped data payload type.
 */
export interface WrappedData<T> {
  /* The wrapped data code */
  code?: string;
  /* The wrapped data result */
  result?: string;
  /* The wrapped data payload */
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
  /** The api tokens */
  private readonly _tokens: Map<string, string>;

  /** The last api error */
  private _error: FetchError<unknown> | null = null;

  /**
   * Create an application programming interface.
   * @param tokens - The api tokens.
   */
  constructor(tokens?: Map<string, string>) {
    // initialize default api tokens
    const defaults = new Map<string, string>();
    if (FACEIT_API_TOKEN) defaults.set(FACEIT_API_BASE_URL, FACEIT_API_TOKEN);
    if (FACEIT_OPEN_TOKEN) defaults.set(FACEIT_OPEN_BASE_URL, FACEIT_OPEN_TOKEN);
    // initialize api tokens
    this._tokens = new Map([...defaults, ...(tokens || [])]);
  }

  /* Get the last api error */
  get error(): FetchError<unknown> | null {
    return this._error;
  }

  /**
   * Get the api token.
   * @returns The api token.
   */
  static async getLocalToken(): Promise<string | null> {
    const cookie = await browser?.cookies?.get({
      name: 't',
      url: 'https://faceit.com',
    });
    return cookie?.value || localStorage.getItem('token');
  }

  /**
   * Fetch data from `url` and `base` endpoint with specified `searchParams`.
   * @param url - The pathname url to fetch data from.
   * @param options - The url options.
   * @param options.base - The base url to fetch data from.
   * @param options.token - The api token to use for authentication.
   * @param options.searchParams - The url search parameters.
   * @param options.unwrap - Whether to unwrap the response data.
   * @returns A response promise or null if error.
   */
  @memDecorator({
    cache: API_CACHE,
    maxAge: API_CACHE_TIME,
    cacheKey: (args) => {
      const key = JSON.stringify(args);
      return key;
    },
  })
  async fetch<T>(
    options: {
      url: string;
      base: string;
      token?: string;
      searchParams?: Record<string, string>;
      unwrap?: boolean;
    },
  ): Promise<T | null> {
    // retrieve options
    const url = options.url;
    const base = options.base;
    const token = options.token ?? this._tokens.get(base) ?? await Api.getLocalToken();
    const searchParams = options.searchParams ?? {};
    const unwrap = options.unwrap ?? false;

    // build endpoint
    const endpoint = new URL(url, base);
    Object.entries(searchParams).forEach(([name, value]) => {
      endpoint.searchParams.append(name, value);
    });
    // build headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    // build request
    const request: ApiRequest = {
      method: 'GET',
      headers,
      endpoint,
    }

    // fetch data
    try {
      const response: ApiResponse<T | WrappedData<T>> = await browser.runtime?.sendMessage(request);
      // check response error
      if (!response || !response.data) {
        throw new FetchError(
          `Data fetch operation failed (received undefined): ${response.error ?? 'unknown'}`,
          request,
          response,
        );
      }
      if (response.error) {
        throw new FetchError(
          `Data fetch operation failed (received invalid): ${response.error}`,
          request,
          response,
        );
      }
      // unwrap response data
      if (unwrap) {
        const { code, result, payload } = response.data as WrappedData<T>;
        // check if unwrapped data is valid
        if (payload === undefined) {
          throw new FetchError(
            'Unwrapped data is invalid (missing payload)',
            request,
            response,
          );
        }
        // check for response errors
        if ((code && code.toUpperCase() !== 'OPERATION-OK')
          || (result && result.toUpperCase() !== 'OK')
        ) {
          throw new FetchError(
            'Data fetch operation failed (received an invalid response)',
            request,
            response,
          );
        }
        return payload;
      }
      return response.data as T;
    } catch (error) {
      // log and return null if error
      if (error instanceof FetchError) {
        this._error = error;
        // eslint-disable-next-line no-console
        console.error(error.message, error.request, error.response)
      }
      else {
        // eslint-disable-next-line no-console
        console.error(error)
      }
      return null;
    }
  }

  /**
   * Fetch the current player from faceit api.
   * @returns The current player api response.
   */
  async fetchMe(): Promise<PlayerApiResponse | null> {
    return this.fetch<PlayerApiResponse>({
      url: '/users/v1/sessions/me',
      base: FACEIT_API_BASE_URL,
      unwrap: true,
    });
  }

  /**
   * Fetch match by match id from faceit api.
   * @param matchId - The match id.
   * @returns The match api response.
   */
  async fetchMatch(
    matchId: string,
  ): Promise<MatchApiResponse | null> {
    return this.fetch<MatchApiResponse>({
      url: `/match/v2/match/${matchId}`,
      base: FACEIT_API_BASE_URL,
      unwrap: true,
    });
  }

  /**
   * Fetch match by match id from faceit open api.
   * @param matchId - The match id.
   * @returns The match open api response.
   */
  async fetchMatchFromOpen(
    matchId: string,
  ): Promise<MatchOpenResponse | null> {
    return this.fetch<MatchOpenResponse>({
      url: `/data/v4/matches/${matchId}`,
      base: FACEIT_OPEN_BASE_URL,
      unwrap: false,
    });
  }

  /**
   * Fetch match stats by match id from faceit api.
   * @param matchId - The match id.
   * @returns The match stats api response.
   */
  async fetchMatchStats(
    matchId: string,
  ): Promise<MatchStatsApiResponse | null> {
    return this.fetch<MatchStatsApiResponse>({
      url: `/stats/v1/stats/matches/${matchId}`,
      base: FACEIT_API_BASE_URL,
      unwrap: false,
    });
  }

  /**
   * Fetch match stats by match id from faceit open api.
   * @param matchId - The match id.
   * @returns The match stats open api response.
   */
  async fetchMatchStatsFromOpen(
    matchId: string,
  ): Promise<MatchStatsOpenResponse | null> {
    return this.fetch<MatchStatsOpenResponse>({
      url: `/data/v4/matches/${matchId}/stats`,
      base: FACEIT_OPEN_BASE_URL,
      unwrap: false,
    });
  }

  /**
   * Fetch match voting by match id from faceit api.
   * @param matchId - The match id.
   * @returns The match voting api response.
   */
  async fetchMatchVoting(
    matchId: string,
  ): Promise<MatchVotingApiResponse | null> {
    return this.fetch<MatchVotingApiResponse>({
      url: `/democracy/v1/${matchId}/history`,
      base: FACEIT_API_BASE_URL,
      unwrap: true,
    });
  }

  /**
   * Fetch player by player id from faceit api.
   * @param playerId - The player id.
   * @returns The player api response.
   */
  async fetchPlayer(
    playerId: string,
  ): Promise<PlayerApiResponse | null> {
    return this.fetch<PlayerApiResponse>({
      url: `/users/v1/users/${playerId}`,
      base: FACEIT_API_BASE_URL,
      unwrap: true,
    });
  }

  /**
   * Fetch player by player id from faceit open api.
   * @param playerId - The player id.
   * @returns The player open api response.
   */
  async fetchPlayerFromOpen(
    playerId: string,
  ): Promise<PlayerOpenResponse | null> {
    return this.fetch<PlayerOpenResponse>({
      url: `/data/v4/players/${playerId}`,
      base: FACEIT_OPEN_BASE_URL,
      unwrap: false,
    });
  }

  /**
   * Fetch player matches by player id from faceit api.
   * @param playerId - The player id.
   * @param game - The game.
   * @param from - The start timestamp.
   * @param to - The end timestamp.
   * @param offset - The offset.
   * @param limit - The limit.
   * @returns The player matches api response.
   */
  async fetchPlayerMatches(
    playerId: string,
    game: string,
    from = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60),
    to = Math.floor(Date.now() / 1000),
    offset = 0,
    limit = 20,
  ): Promise<PlayerMatchesApiResponse | null> {
    return this.fetch<PlayerMatchesApiResponse>({
      url: `/match-history/v5/players/${playerId}/history/`
        + `?page=0&from=${formatTimestamp(from, true)}&to=${formatTimestamp(to, true)}`
        + `&offset=${offset}&size=${limit}`,
      base: FACEIT_API_BASE_URL,
      unwrap: true,
    }).then((data) => data?.filter((match) => match.game === game) ?? null);
  }

  /**
   * Fetch player matches by player id from faceit open api.
   * @param playerId - The player id.
   * @param game - The game.
   * @param from - The start timestamp.
   * @param to - The end timestamp.
   * @param offset - The offset.
   * @param limit - The limit.
   * @returns The player matches open api response.
   */
  async fetchPlayerMatchesFromOpen(
    playerId: string,
    game: string,
    from = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60),
    to = Math.floor(Date.now() / 1000),
    offset = 0,
    limit = 20,
  ): Promise<PlayerMatchesOpenResponse | null> {
    return this.fetch<PlayerMatchesOpenResponse>({
      url: `/data/v4/players/${playerId}/history`
        + `/?game=${game}&from=${from}&to=${to}&offset=${offset}&limit=${limit}`,
      base: FACEIT_OPEN_BASE_URL,
      unwrap: false,
    });
  }

  /**
   * Fetch player matches stats by player id and game id from faceit api.
   * @param playerId - The player id.
   * @param gameId - The game id.
   * @param size - The request size.
   * @returns The player stats api response.
   */
  async fetchPlayerMatchesStats(
    playerId: string,
    gameId: string,
    size: number = 20,
  ): Promise<PlayerMatchesStatsApiResponse | null> {
    return this.fetch<PlayerMatchesStatsApiResponse>({
      url: `/stats/v1/stats/time/users/${playerId}/games/${gameId}?size=${size}`,
      base: FACEIT_API_BASE_URL,
      unwrap: false,
    });
  }

  /**
   * Fetch player stats by player id and game id from faceit api.
   * @param playerId - The player id.
   * @param gameId - The game id.
   * @returns The player stats api response.
   */
  async fetchPlayerStats(
    playerId: string,
    gameId: string,
  ): Promise<PlayerStatsApiResponse | null> {
    return this.fetch<PlayerStatsApiResponse>({
      url: `/stats/v1/stats/users/${playerId}/games/${gameId}`,
      base: FACEIT_API_BASE_URL,
      unwrap: false,
    });
  }

  /**
   * Fetch player stats by player id and game id from faceit open api.
   * @param playerId - The player id.
   * @param gameId - The game id.
   * @returns The player stats open api response.
   */
  async fetchPlayerStatsFromOpen(
    playerId: string,
    gameId: string,
  ): Promise<PlayerStatsOpenResponse | null> {
    return this.fetch<PlayerStatsOpenResponse>({
      url: `/data/v4/players/${playerId}/stats/${gameId}`,
      base: FACEIT_OPEN_BASE_URL,
      unwrap: false,
    });
  }
}

/**
 * An application programming interface fetch error.
 *
 * @typeParam T - The response data type.
 * @param message - The error message.
 * @param request - The request.
 * @param response - The response.
 * @returns A fetch error.
 * @throws An error if the request or response is invalid.
 */
class FetchError<T> extends Error {
  /* The request */
  readonly request: ApiRequest;

  /* The response */
  readonly response: ApiResponse<unknown>;

  /**
   * Create an application programming interface fetch error.
   * @param message - The error message.
   * @param request - The request.
   * @param response - The response.
   */
  constructor(message: string, request: ApiRequest, response: ApiResponse<T>) {
    super(message);
    // initialize error
    this.name = "FetchError";
    this.request = request;
    this.response = response;
  }
}
