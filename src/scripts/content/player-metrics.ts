import { debounce } from 'lodash';

import type { Matchroom } from '../../shared/helpers/matchroom';

export default debounce(async (matchroom: Matchroom) => {
  console.log(matchroom.details?.status ?? 'matchroom is not live');
}, 300);
