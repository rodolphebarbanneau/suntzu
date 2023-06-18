/**
 * A matchroom map.
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
