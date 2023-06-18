/**
 * A matchroom player.
 */
export class MatchroomPlayer {
  /* The matchroom player container. */
  private readonly _container: HTMLDivElement;

  /**
   * Create a matchroom player.
   * @param container - The matchroom player container.
   */
  constructor(container: HTMLDivElement) {
    this._container = container;
  }

  /* Get the matchroom player container. */
  get container(): HTMLDivElement {
    return this._container;
  }

  /* Get the matchroom player nickname. */
  get nickname(): string | null | undefined {
    return (
      this._container.querySelector('span + div') ||
      this._container.firstChild?.childNodes[1].firstChild?.firstChild
    )?.textContent;
  }
}
