import type { MatchModel } from '../types';
import type { Feature } from './feature';
import { BROWSER } from '../browser';
import { FACEIT_MATCHROOM_ROUTES } from '../settings';
import { SuntzuRange } from '../ranges';
import { Api } from './api';
import { MatchroomPlayer } from './matchroom-player';
import { MatchroomMap } from './matchroom-map';
import { Metrics } from './metrics';

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

export interface MatchroomOptions {
  match: string;
  player: string;
  time: string;
}

/**
 * A matchroom.
 * It contains various details of a matchroom like document, url, api, details and metrics. It also
 * provides methods to initialize a matchroom, validate a matchroom, and access various properties
 * of the matchroom such as players, maps, and metrics.
 */
export class Matchroom {
  /* The matchroom document. */
  private readonly _document: Document;

  /* The matchroom url. */
  private readonly _url: string;

  /* The application programming interface used to fetch data. */
  private readonly _api: Api;

  /* The matchroom listeners. */
  private readonly _listeners: { [ key: string]: (() => void)[] } = {};

  /* The matchroom features. */
  private readonly _features: { [key: string]: Feature } = {};

  /* The matchroom details. */
  private _details: MatchModel | null = null;

  /* The matchroom metrics. */
  private _metrics: Metrics | null = null;

  /* The matchroom metrics token (used to cancel the metrics promise). */
  private _metricsToken: string | null = null;

  /**
   * Create a matchroom.
   */
  private constructor() {
    // initialize
    this._document = document;
    this._url = document.location.href;
    this._api = new Api();
  }

  /* Get the matchroom document. */
  get document(): Document {
    return this._document;
  }

  /* Get the matchroom url. */
  get url(): string {
    return this._url;
  }

  /* Get the matchroom id. */
  get id(): string {
    const match = this._url.match(/\/room\/(.*?)(?:\/|$)/);
    return match ? match[1] : '';
  }

  /* Get the application programming interface used to fetch data. */
  get api(): Api {
    return this._api;
  }

  /* Get the matchroom listeners. */
  get listeners(): { [ key: string]: (() => void)[] } {
    return this._listeners;
  }

  /* Get the matchroom features. */
  get features(): { [key: string]: Feature } {
    return this._features;
  }

  /* Get the matchroom details. */
  get details(): MatchModel | null {
    return this._details;
  }

  /* Get the matchroom metrics. */
  get metrics(): Metrics | null {
    return this._metrics;
  }

  /**
   * Initialize matchroom.
   * @returns A promise that resolves with the matchroom instance.
   */
  static async initialize(): Promise<Matchroom> {
    // create matchroom
    const matchroom = new Matchroom();
    // initialize
    if (matchroom.isValid()) {
      // eslint-disable-next-line no-underscore-dangle
      matchroom._details = await matchroom.api.fetchMatch(matchroom.id);
    }
    // listen for storage changes
    BROWSER.storage.local.onChanged.addListener(
      (changes: { [range: string]: chrome.storage.StorageChange }) => {
        Object.values(SuntzuRange).forEach((key) => {
          if (key in changes) {
            matchroom.buildMetrics();
          }
        });
      },
    );
    // return matchroom
    return matchroom;
  }

  /**
   * Add a feature to the matchroom.
   * @param feature - The feature to add.
   */
  addFeature(feature: Feature): void {
    this._features[feature.name] = feature;
  }

  /**
   * Add a matchroom listener.
   * @param type - The matchroom listener type.
   * @param listener - The matchroom listener callback.
   */
  addListener(type: string, listener: () => void): void {
    this._listeners[type].push(listener);
  }

  /**
   * Remove a matchroom listener.
   * @param type - The matchroom listener type.
   * @param listener - The matchroom listener callback.
   */
  removeListener(type: string, listener: () => void): void {
    // check if type listeners exists
    if (!(type in this._listeners)) return;
    // remove type listener
    const index = this._listeners[type].indexOf(listener);
    if (index > -1) {
      this._listeners[type].splice(index, 1);
    }
    // delete type listeners if empty
    if (this._listeners[type].length === 0) {
      delete this._listeners[type];
    }
  }

  /**
   * Notify matchroom listeners.
   * @param type - The matchroom listener type.
   * @param listener - The matchroom listener callback.
   */
  notifyListeners(type: string): void {
    this._listeners[type].forEach((listener) => listener());
  }

  /**
   * Checks if the document url is a valid matchroom route.
   * @returns True if the document url is a valid matchroom route, false otherwise.
   */
  isValid(): boolean {
    return FACEIT_MATCHROOM_ROUTES.some(
      (route) => this._url.includes(route),
    );
  }

  /**
   * Get the document matchroom container.
   * @returns The document matchroom container.
   */
  getContainer(): HTMLDivElement | null {
    return document.querySelector('div#parasite-container div#MATCHROOM-OVERVIEW');
  }

  /**
   * Check if the document matchroom container exists.
   * @returns True if the document matchroom container exists, false otherwise.
   */
  hasContainer(): boolean {
    return !!this.getContainer();
  }

  /**
   * Check if the document matchroom container is loaded.
   * @returns True if the document matchroom container is loaded, false otherwise.
   */
  isContainerLoaded(): boolean {
    const matchroom = this.getContainer();
    return (
      !!matchroom
      && !!matchroom.querySelector('[name="roster1"]')
      && !!matchroom.querySelector('[name="roster2"]')
    );
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
    const container = this.getContainer();
    // retrieve the list of player elements for the specified roster.
    const retrieve = (roster: HTMLDivElement): MatchroomPlayer[] => {
      const players: MatchroomPlayer[] = [];
      // handle the different roster types
      if (roster.childElementCount === 5) {
        // independant children with no premades
        roster.childNodes.forEach((player) => {
          players.push(new MatchroomPlayer(
            player.childNodes[0].childNodes[0] as HTMLDivElement,
          ));
        });
      } else {
        // premades
        roster.childNodes.forEach((premade) => {
          // one player per premade
          if ((premade as HTMLDivElement).childElementCount === 1) {
            players.push(new MatchroomPlayer(
              premade.childNodes[0].childNodes[0] as HTMLDivElement,
            ));
          } else {
            // multiple player per premade
            premade.childNodes.forEach((player) => {
              players.push(new MatchroomPlayer(
                player.childNodes[0].childNodes[0].childNodes[0] as HTMLDivElement,
              ));
            });
          }
        });
      }
      return players;
    }

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
    const wrapper = this.getInformationWrapper();
    const state = this.getState();
    const maps: MatchroomMap[] = [];
    // retrieve the list of map elements for the active state.
    if (state === MatchroomState.Voting) {
      // voting state
      const container = wrapper?.children?.[2].children?.[0];
      container?.childNodes.forEach((map) => {
        maps.push(new MatchroomMap(
          map.childNodes[0] as HTMLDivElement,
        ));
      });
    } else if (state === MatchroomState.Configuring) {
      // configuring state
      maps.push(new MatchroomMap(
        wrapper?.children?.[2]?.children?.[0]?.children?.[3]?.children?.[0] as HTMLDivElement,
      ));
    } else {
      // ready or finished state
      const map = wrapper?.children?.[1]?.children?.[0]?.children?.[3]?.children?.[0]
        || wrapper?.children?.[0]?.children?.[0]?.children?.[3] ?.children?.[0];
      if (map) maps.push(new MatchroomMap(map as HTMLDivElement));
    }
    return maps;
  }

  /**
   * Build the matchroom metrics.
   */
  async buildMetrics(): Promise<void> {
    // build metrics token
    const token = Math.random().toString(36).substring(2, 15);
    // build metrics
    this._metricsToken = token;
    return new Promise<void>((resolve, reject) => {
      BROWSER.storage.local.get(Object.values(SuntzuRange), async (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          try {
            const metrics = await Metrics.initialize(
              this.api,
              this.id,
              {
                match: result[SuntzuRange.MatchRange],
                player: result[SuntzuRange.PlayerRange],
                time: result[SuntzuRange.TimeRange],
              },
            );
            if (this._metricsToken !== token) {
              reject(new Error('Operation cancelled!'));
            } else {
              // write metrics
              this._metrics = metrics;
              // notify listeners
              this.notifyListeners('metrics');
              resolve();
            }
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }
}
