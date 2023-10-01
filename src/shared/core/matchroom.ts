import type { MetricsOptions, MetricsData } from './metrics';
import type { MatchApiResponse, PlayerApiResponse, MetricsModel } from '../types';
import { FACEIT_MATCHROOM_ROUTES, } from '../settings';
import { MatchesOption, PlayersOption, TimeSpanOption } from '../types';
import { Api } from './api';
import { Metrics } from './metrics';
import { Storage, StorageNamespace, storageOptions, storageRecord } from './storage';

/**
 * The matchroom states.
 * @property {number} Voting - State when players are voting for the match settings. This typically
 * includes settings such as map selection.
 * @property {number} Configuring - State after voting has concluded and the match settings are
 * being finalized. This typically include server configuration and setting up the match with the
 * chosen options from the voting phase.
 * @property {number} Ready - State when the match has been configured and is ready to begin.
 * Players can join the match at this stage.
 * @property {number} Finished - State after the match has concluded. The final scores, stats, and
 * other post-match data can be accessed in this state.
 */
export enum MatchroomState {
  Voting,
  Configuring,
  Ready,
  Finished,
}

/**
 * A matchroom map.
 * It represents a map in a matchroom. This contains details about the map such as the map's id
 * (lower case) and the container. The name is the identifier used for the map within the game, and
 * the container is the HTML element that encapsulates the map's information.
 */
export interface MatchroomMap {
  /* The matchroom map id */
  readonly id: string;
  /* The matchroom map name */
  readonly name: string;
  /* The matchroom map container */
  readonly container: HTMLDivElement;
}


/**
 * A matchroom team.
 * It represents a team in a matchroom. It contains details about the team such as the team's id.
 */
export interface MatchroomTeam {
  /* The matchroom team id */
  readonly id: string;
  /* The matchroom team name */
  readonly name: string;
}

/**
 * A matchroom player.
 * It represents a player in a matchroom. It contains details about the player such as the
 * player's id and container. The id is the in-game nickname used by the player (lower case), and
 * the container is the HTML element that encapsulates the player's information.
 */
export interface MatchroomPlayer {
  /* The matchroom player id */
  readonly id: string;
  /* The matchroom player name */
  readonly name: string;
  /* The matchroom player container */
  readonly container: HTMLDivElement;
}

/**
 * Matchroom options.
 * It is used to define the matchroom options for the metrics computation. It includes options for
 * matches, players, and time span. These options are required to compute metrics effectively.
 */
@storageOptions({ name: 'matchroom', sync: false })
export class MatchroomOptions extends StorageNamespace implements MetricsOptions {
  /* The matchroom matches option */
  @storageRecord matches = MatchesOption.Maximum20;
  /* The matchroom players option */
  @storageRecord players = PlayersOption.Any;
  /* The matchroom time span option */
  @storageRecord timeSpan = TimeSpanOption.ThreeMonths;
}

/**
 * A matchroom.
 * It contains various details of a matchroom like document, url, api, details and metrics. It also
 * provides methods to initialize a matchroom, validate a matchroom, and access various properties
 * of the matchroom such as players, maps, and metrics.
 */
export class Matchroom {
  /* The matchroom document */
  private readonly _document: Document;

  /* The matchroom url */
  private readonly _url: string;

  /* The application programming interface used to fetch data */
  private readonly _api = new Api();

  /* The matchroom listeners */
  private readonly _listeners = new Set<(metrics: MetricsData) => void>();

  /* The matchroom user */
  private _user: PlayerApiResponse | null = null;

  /* The matchroom match */
  private _match: MatchApiResponse | null = null;

  /* The matchroom state */
  private _state: MatchroomState | null = null;

  /* The matchroom options */
  private _options: MatchroomOptions | null = null;

  /* The matchroom metrics */
  private _metrics: Metrics | null = null;

  /* Create a matchroom */
  private constructor() {
    // initialize
    this._document = document;
    this._url = document.location.href;
  }

  /* Get the matchroom document */
  get document(): Document {
    return this._document;
  }

  /* Get the matchroom url */
  get url(): string {
    return this._url;
  }

  /* Get the matchroom id */
  get id(): string {
    const match = this._url.match(/\/room\/(.*?)(?:\?|\/|$)/);
    return match ? match[1] : '';
  }

  /* Get the application programming interface used to fetch data */
  get api(): Api {
    return this._api;
  }

  /* Get the matchroom listeners */
  get listeners(): Set<(metrics: MetricsData) => void> {
    return this._listeners;
  }

  /* Get the matchroom user */
  get user(): PlayerApiResponse {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._user!;
  }

  /* Get the matchroom match */
  get match(): MatchApiResponse {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._match!;
  }

  /* Get the matchroom state */
  get state(): MatchroomState {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._state!;
  }

  /* Get the matchroom options */
  get options(): MatchroomOptions {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._options!;
  }

  /* Get the matchroom metrics */
  get metrics(): Metrics {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._metrics!;
  }

  /**
   * Initialize matchroom.
   * @returns A promise that resolves with the matchroom instance.
   */
  static async initialize(): Promise<Matchroom | null> {
    // check url
    if (!Matchroom.isValidUrl()) return null;
    // create matchroom
    const matchroom = new Matchroom();
    await matchroom.update();
    /* eslint-disable no-underscore-dangle */
    matchroom._options = await MatchroomOptions.initialize();
    matchroom._metrics = await Metrics.initialize(matchroom.api, matchroom.id, matchroom.options);
    /* eslint-enable no-underscore-dangle */
    // listen for storage changes
    Storage.addListener([matchroom.options, async () => {
      await matchroom.metrics.buildMetrics();
      matchroom.notifyListeners(matchroom.metrics.data);
    }]);
    // return matchroom
    return matchroom;
  }

  /**
   * Checks if the document url is a valid matchroom route.
   * @returns True if the document url is a valid matchroom route, false otherwise.
   */
  static isValidUrl(): boolean {
    return FACEIT_MATCHROOM_ROUTES.some(
      (route) => document.location.href.includes(`/${route}/room/`),
    );
  }

  /**
   * Update the matchroom details.
   * @returns An empty promise that resolves when the matchroom details are updated.
   */
  async update(): Promise<void> {
    // fetch user
    const user = await this._api.fetchMe();
    this._user = user;
    // fetch match
    const match = await this._api.fetchMatch(this.id);
    this._match = match;
    // retrieve matchroom state
    switch (match?.state) {
      case 'VOTING':
        this._state = MatchroomState.Voting;
        return;
      case 'CONFIGURING':
        this._state = MatchroomState.Configuring;
        return;
      case 'READY':
        this._state = MatchroomState.Ready;
        return;
      default:
        this._state = MatchroomState.Finished;
        return;
    }
  }

  /**
   * Check if the document matchroom is ready.
   * @returns True if the document matchroom is ready, false otherwise.
   */
  isReady(): boolean {
    return !!this.getContainer();
  }

  /**
   * Add a matchroom listener.
   * @param listener - The matchroom callback listener.
   */
  addListener(listener: (metrics: MetricsData) => void): void {
    if (this._listeners.has(listener)) return;
    this._listeners.add(listener);
  }

  /**
   * Remove a matchroom listener.
   * @param listener - The matchroom callback listener.
   */
  removeListener(listener: (metrics: MetricsData) => void): void {
    this._listeners.delete(listener);
  }

  /**
   * Notify the matchroom listeners with the given metrics.
   * @param metrics - The matchroom metrics data.
   */
  notifyListeners(metrics: MetricsData): void {
    this._listeners.forEach((listener) => {
      listener(metrics);
    });
  }

  /**
   * Get the document matchroom container.
   * @returns The document matchroom container.
   */
  getContainer(): HTMLDivElement | null {
    return document.querySelector('div#parasite-container div#MATCHROOM-OVERVIEW');
  }

  /**
   * Get the document matchroom information.
   * @returns The document matchroom information.
   */
  getInformation(): HTMLDivElement | null | undefined {
    const container = this.getContainer();
    return container?.querySelector('[name="info"]');
  }

  /**
   * Get the document matchroom information.
   * @returns The document matchroom information.
   */
  getInformationWrapper(): HTMLDivElement | null | undefined {
    const container = this.getInformation();
    const wrapper = Array.from(container?.children || []).find(child =>
      child.tagName === 'DIV' && !child.id
    )
    return wrapper?.firstElementChild as HTMLDivElement | null | undefined;
  }

  /**
   * Get the list of players in the matchroom document.
   * @returns The list of players in the matchroom document.
   */
  getPlayers(): MatchroomPlayer[] {
    // handle matchroom player
    const matchroomPlayer = (player: HTMLDivElement): MatchroomPlayer => {
      // retrieve matchroom player name
      const name = (
        player.querySelector('span + div') ||
        player.firstChild?.childNodes[1].firstChild?.firstChild
      );
      // return matchroom player
      return {
        id: name?.textContent?.toLowerCase() ?? '',
        name: name?.textContent ?? '',
        container: player,
      }
    };

    // retrieve the list of player elements for the specified roster.
    const retrieve = (roster: HTMLDivElement): MatchroomPlayer[] => {
      const players: MatchroomPlayer[] = [];
      // handle the different roster types
      if (roster.childElementCount === 5) {
        // independant children with no premades
        roster.childNodes.forEach((player) => {
          players.push(matchroomPlayer(
            player.childNodes[0].childNodes[0] as HTMLDivElement,
          ));
        });
      } else {
        // premades
        roster.childNodes.forEach((premade) => {
          // one player per premade
          if ((premade as HTMLDivElement).childElementCount === 1) {
            players.push(matchroomPlayer(
              premade.childNodes[0].childNodes[0] as HTMLDivElement,
            ));
          } else {
            // multiple player per premade
            premade.childNodes.forEach((player) => {
              players.push(matchroomPlayer(
                player.childNodes[0].childNodes[0].childNodes[0] as HTMLDivElement,
              ));
            });
          }
        });
      }
      return players;
    }

    // retrieve the list of player elements for each roster.
    const container = this.getContainer();
    return [
      container?.querySelector('[name="roster1"]')?.childNodes[0],
      container?.querySelector('[name="roster2"]')?.childNodes[0],
    ].map((roster) =>
      roster ? retrieve(roster as HTMLDivElement) : []
    ).flat();
  }

  /**
   * Get the list of teams in the matchroom document.
   * @param sort - Whether to sort the teams with the matchroom user team first. Defaults to false.
   * @returns The list of teams in the matchroom document.
   */
  getTeams(sort = false): MatchroomTeam[] {
    // return raw matchroom teams if not sorted
    if (!sort) return Object.entries(this._match?.teams ?? {}).map(([key, team]) => ({
      id: key,
      name: team.name,
   }));

    // retrieve teams sorted with matchroom user team first
    const teams = Object.entries(this._match?.teams ?? {}).sort((a, b) => {
      return (a[1].roster.some((player) => player.id === this._user?.id) ? 0 : 1)
        - (b[1].roster.some((player) => player.id === this._user?.id) ? 0 : 1);
    });
    // return matchroom teams
    return teams.map(([key, team]) => ({
       id: key,
       name: team.name,
    }));
  }

  /**
   * Get the list of maps in the matchroom document.
   * @returns The list of maps in the matchroom document.
   */
  getMaps(): MatchroomMap[] {
    // handle map keys
    const mapKeys = new Set<string>();
    const addMapKeys = (metricsData?: Record<string, MetricsModel>) => {
      if (!metricsData) return;
      Object.values(metricsData).forEach((entity) => {
        Object.keys(entity.maps).forEach((mapKey) => {
          mapKeys.add(mapKey);
        });
      });
    }
    // retrieve map keys from teams and players metrics
    addMapKeys(this._metrics?.data?.teams);
    addMapKeys(this._metrics?.data?.players);

    // handle matchroom map
    const matchroomMap = (map: HTMLDivElement): MatchroomMap => {
      // retrieve matchroom map name
      const name = map.querySelector('div > div > span')?.textContent?.toLowerCase() ?? '';
      // retrieve matchroom map key
      let key = name;
      for (const mapKey of mapKeys) {
        if (mapKey.includes(name)) {
          key = mapKey;
          break;
        }
      }
      // return matchroom map
      return {
        id: key,
        name: name,
        container: map,
      }
    };

    // retrieve the list of map elements for the active state.
    const wrapper = this.getInformationWrapper();
    const maps: MatchroomMap[] = [];
    if (this._state === MatchroomState.Voting) {
      // voting state
      const container = wrapper
        ?.lastElementChild
        ?.lastElementChild;
      container?.childNodes.forEach((map) => {
        maps.push(matchroomMap(
          map as HTMLDivElement,
        ));
      });
    } else if (this._state === MatchroomState.Configuring) {
      // configuring state
      const map = wrapper
        ?.lastElementChild
        ?.lastElementChild
        ?.lastElementChild;
      if (map) maps.push(matchroomMap(map as HTMLDivElement));
    } else if (this._state === MatchroomState.Ready) {
      // ready state
      const map = wrapper
        ?.lastElementChild
        ?.lastElementChild
        ?.lastElementChild;
      if (map) maps.push(matchroomMap(map as HTMLDivElement));
    } else {
      // finished state
      const map = (
        wrapper?.firstElementChild
          ?.lastElementChild
          ?.lastElementChild
        || wrapper?.lastElementChild
          ?.lastElementChild
          ?.lastElementChild
      );
      if (map) maps.push(matchroomMap(map as HTMLDivElement));
    }
    return maps;
  }
}
