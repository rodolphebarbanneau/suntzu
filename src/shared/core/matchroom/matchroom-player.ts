/**
 * A matchroom player.
 * It represents a player in a matchroom. It contains details about the player such as the container
 * and the player's nickname. The container is the HTML element that encapsulates the player's
 * information, and the nickname is the in-game name used by the player.
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

  /* Get the matchroom player id. */
  get id(): string {
    return this.nickname?.toLowerCase() ?? '';
  }

  /* Get the matchroom player nickname. */
  get nickname(): string | null | undefined {
    return (
      this._container.querySelector('span + div') ||
      this._container.firstChild?.childNodes[1].firstChild?.firstChild
    )?.textContent;
  }
}
