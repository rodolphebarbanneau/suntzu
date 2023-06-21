import type { MatchModel } from '../types';
import type { MetricsRange } from './metrics';
import { FACEIT_MATCHROOM_ROUTES } from '../settings';
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
export enum MatchroomStates {
  Voting,
  Configuring,
  Ready,
  Finished,
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

  /* The matchroom details. */
  private _details: MatchModel | null | undefined;

  /* The matchroom details. */
  private _metrics: Metrics | undefined;

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

  /* Get the matchroom details. */
  get details(): MatchModel | null | undefined {
    return this._details;
  }

  /**
   * Initialize matchroom.
   * @returns A matchroom instance.
   */
  public static async initialize(): Promise<Matchroom> {
    // create matchroom
    const matchroom = new Matchroom();
    // initialize
    if (matchroom.isValid()) {
      // eslint-disable-next-line no-underscore-dangle
      matchroom._details = await matchroom.api.fetchMatch(matchroom.id);
    }
    return matchroom;
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
    return this.getInformation()?.children?.[0].children?.[0] as HTMLDivElement | undefined;
  }

  /**
   * Get the document matchroom state.
   * @returns The document matchroom state.
   */
  getState(): MatchroomStates {
    const status = this._details?.status;
    switch (status) {
      case 'VOTING':
        return MatchroomStates.Voting;
      case 'CONFIGURING':
        return MatchroomStates.Configuring;
      case 'READY':
        return MatchroomStates.Ready;
      default:
        return MatchroomStates.Finished;
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
    if (state === MatchroomStates.Voting) {
      // voting state
      const container = wrapper?.children?.[2].children?.[0];
      container?.childNodes.forEach((map) => {
        maps.push(new MatchroomMap(
          map.childNodes[0] as HTMLDivElement,
        ));
      });
    } else if (state === MatchroomStates.Configuring) {
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
   * Get the matchroom metrics.
   * @returns The matchroom metrics.
   */
  async getMetrics(range: MetricsRange): Promise<Metrics> {
    // check if metrics are already initialized
    if (!this._metrics) {
      this._metrics = await Metrics.initialize(this.api, this.id, range);
    }
    // check if metrics need to be updated
    if (Object.entries(range).some(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(this._metrics?.range, key)) {
        const check = key as keyof MetricsRange;
        return this._metrics?.range[check] !== value;
      }
      return true;
    })) {
      this._metrics = await Metrics.initialize(this.api, this.id, range);
    }
    // return the metrics
    return this._metrics;
  }
}
