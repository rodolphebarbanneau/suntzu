import { handleMatchroom } from './matchroom';

/**
 * Handle mutations.
 * @param mutations - The mutations.
 * @param observer - The observer.
 */
const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver,
) => {
  // handle matchroom
  handleMatchroom();

  // observe shadow roots
  mutations.forEach((mutation) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutation.addedNodes.forEach((addedNode: any) => {
      if (addedNode.shadowRoot) {
        observer.observe(addedNode.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    });
  });
};

/* Observe mutations */
const observer = new MutationObserver(handleMutation);
observer.observe(document.body, { childList: true, subtree: true });
