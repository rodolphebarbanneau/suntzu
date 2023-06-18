import { debounce } from 'lodash';

import type { Matchroom } from '../../shared/helpers/matchroom';

export default debounce(async (matchroom: Matchroom) => {
  console.log('player-metrics');
}, 300);
