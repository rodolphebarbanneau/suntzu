import type { MatchModel } from '../types';
import type { MetricsOptions } from './metrics';
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
 * A listener for a matchroom.
 * It is used to listen to changes in the matchroom.
 */
interface MatchroomListener {
  /* The matchroom type to listen for changes. */
  type: StorageNamespace;
  /* The callback to execute when a change occurs in the matchroom. */
  callback: () => void;
};

/**
 * A matchroom map.
 * It represents a map in a matchroom. This contains details about the map such as the map's id
 * (lower case) and the container. The name is the identifier used for the map within the game, and
 * the container is the HTML element that encapsulates the map's information.
 */
interface MatchroomMap {
  /* The matchroom map id */
  readonly id: string;
  /* The matchroom map container */
  readonly container: HTMLDivElement;
}

/**
 * A matchroom player.
 * It represents a player in a matchroom. It contains details about the player such as the
 * player's id and container. The id is the in-game nickname used by the player (lower case), and
 * the container is the HTML element that encapsulates the player's information.
 */
interface MatchroomPlayer {
  /* The matchroom player id */
  readonly id: string;
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
  /* The matchroom listeners */
  private readonly _listeners: Set<MatchroomListener>;

  /* The matchroom document */
  private readonly _document: Document;

  /* The matchroom url */
  private readonly _url: string;

  /* The application programming interface used to fetch data */
  private readonly _api: Api;

  /* The matchroom options */
  private _options?: MatchroomOptions;

  /* The matchroom details */
  private _details: MatchModel | null = null;

  /* The matchroom metrics */
  private _metrics: Metrics | null = null;

  /* The matchroom metrics token (used to cancel the metrics promise) */
  private _metricsToken: string | null = null;

  /* Create a matchroom */
  private constructor() {
    // initialize
    this._listeners = new Set();
    this._document = document;
    this._url = document.location.href;
    this._api = new Api();
  }

  /* Get the matchroom listeners */
  get listeners(): Set<MatchroomListener> {
    return this._listeners;
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
    const match = this._url.match(/\/room\/(.*?)(?:\/|$)/);
    return match ? match[1] : '';
  }

  /* Get the application programming interface used to fetch data */
  get api(): Api {
    return this._api;
  }

  /* Get the matchroom options */
  get options(): MatchroomOptions {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._options!;
  }

  /* Get the matchroom details */
  get details(): MatchModel | null {
    return this._details;
  }

  /* Get the matchroom metrics */
  get metrics(): Metrics | null {
    return this._metrics;
  }

  /**
   * Initialize matchroom.
   * @returns A promise that resolves with the matchroom instance.
   */
  static async initialize(): Promise<Matchroom | null> {
    // check url
    if (Matchroom.isValidUrl()) return null;
    // create matchroom
    const matchroom = new Matchroom();
    /* eslint-disable no-underscore-dangle */
    matchroom._options = await MatchroomOptions.initialize();
    matchroom._details = await matchroom.api.fetchMatch(matchroom.id);
    /* eslint-enable no-underscore-dangle */
    // listen for storage changes
    Storage.addListener([matchroom.options, () => matchroom.buildMetrics()]);
    // return matchroom
    return matchroom;
  }

  /**
   * Checks if the document url is a valid matchroom route.
   * @returns True if the document url is a valid matchroom route, false otherwise.
   */
  static isValidUrl(): boolean {
    return FACEIT_MATCHROOM_ROUTES.some(
      (route) => document.location.href.includes(route),
    );
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
   * @param listener - The matchroom listener.
   */
  addListener(listener: MatchroomListener): void {
    if (this._listeners.has(listener)) return;
    this._listeners.add(listener);
  }

  /**
   * Remove a matchroom listener.
   * @param listener - The matchroom listener.
   */
  removeListener(listener: MatchroomListener): void {
    this._listeners.delete(listener);
  }

  /**
   * Notify matchroom listeners.
   * @param listener - The matchroom listener.
   */
  notifyListeners(type: string): void {
    this._listeners.forEach((listener) => {
      if (listener.type === type) listener.callback();
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
  getInformationWrapper(): HTMLDivElement | undefined {
    // retrieve document matchroom information children
    const children = Array.from(this.getInformation()?.children ?? []);
    // retrieve document matchroom information wrapper
    return children.find(
      (child: Element) => !child.id.startsWith('suntzu')
    )?.children?.[0] as HTMLDivElement | undefined;
  }

  /**
   * Get the document matchroom state.
   * @returns The document matchroom state.
   */
  getState(): MatchroomState {
    const status = this._details?.status;
    switch (status) {
      case 'VOTING':
        return MatchroomState.Voting;
      case 'CONFIGURING':
        return MatchroomState.Configuring;
      case 'READY':
        return MatchroomState.Ready;
      default:
        return MatchroomState.Finished;
    }
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
   * Get the list of maps in the matchroom document.
   * @returns The list of maps in the matchroom document.
   */
  getMaps(): MatchroomMap[] {
    // handle matchroom map
    const matchroomMap = (map: HTMLDivElement): MatchroomMap => {
      // retrieve matchroom map name
      const name = map.querySelector('div > span');
      // return matchroom player
      return {
        id: name?.textContent?.toLowerCase() ?? '',
        container: map,
      }
    };

    // retrieve the list of map elements for the active state.
    const wrapper = this.getInformationWrapper();
    const state = this.getState();
    const maps: MatchroomMap[] = [];
    if (state === MatchroomState.Voting) {
      // voting state
      const container = wrapper?.children?.[2].children?.[0];
      container?.childNodes.forEach((map) => {
        maps.push(matchroomMap(
          map.childNodes[0] as HTMLDivElement,
        ));
      });
    } else if (state === MatchroomState.Configuring) {
      // configuring state
      maps.push(matchroomMap(
        wrapper?.children?.[2]?.children?.[0]?.children?.[3]?.children?.[0] as HTMLDivElement,
      ));
    } else {
      // ready or finished state
      const map = wrapper?.children?.[1]?.children?.[0]?.children?.[3]?.children?.[0]
        || wrapper?.children?.[0]?.children?.[0]?.children?.[3] ?.children?.[0];
      if (map) maps.push(matchroomMap(map as HTMLDivElement));
    }
    return maps;
  }

  /**
   * Build the matchroom metrics.
   * @returns A promise resolving when the metrics are built.
   */
  async buildMetrics(): Promise<void> {
    // set metrics token
    const token = Math.random().toString(36).substring(2, 15);
    this._metricsToken = token;
    // build metrics
    const metrics = await Metrics.initialize(
      this.api,
      this.id,
      this.options,
    );
    // discard metrics if token has changed
    if (this._metricsToken !== token) throw new Error('Operation cancelled!');
    // write metrics and notify
    this._metrics = metrics;
    this.notifyListeners('metrics');
  }
}
