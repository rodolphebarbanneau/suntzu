/**
 * A matchroom map.
 * It represents a map in a matchroom. This contains details about the map such as the container and
 * the map's name. The container is the HTML element that encapsulates the map's information, and
 * the name is the identifier used for the map within the game.
 */
export class MatchroomMap {
  /* The matchroom map container. */
  private readonly _container: HTMLDivElement;

  /**
   * Create a matchroom map.
   * @param container - The matchroom map container.
   */
  constructor(container: HTMLDivElement) {
    this._container = container;
  }

  /* Get the matchroom map container. */
  get container(): HTMLDivElement {
    return this._container;
  }

  /* Get the matchroom map name. */
  get name(): string | null | undefined {
    return this._container.querySelector('div > span')?.textContent;
  }
}
