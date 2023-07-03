import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom } from 'src/shared/core';
import { Feature } from 'src/shared/core';
import { getColorScale } from 'src/shared/helpers';

import { Metrics } from 'src/app/components/metrics';
import { Tooltip } from 'src/app/components/tooltip';

import styles from './player.module.scss';
import stylesheet from './player.module.scss?inline';

/* Player feature */
export const PlayerFeature = (matchroom: Matchroom) => new Feature('player',
  (feature) => {
    console.log('todo');
  },
);
