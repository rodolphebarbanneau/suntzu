import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom } from 'src/shared/core';
import { Feature } from 'src/shared/core';
import { getColorScale } from 'src/shared/helpers';

import { Metrics } from 'src/app/components/metrics';
import { Tooltip } from 'src/app/components/tooltip';

import stylesheetLink from 'src/app/components/link.module.scss?inline';
import stylesheetMetrics from 'src/app/components/metrics.module.scss?inline';
import stylesheetTooltip from 'src/app/components/tooltip.module.scss?inline';

import stylesheet from './player.module.scss?inline';
import styles from './player.module.scss';

/* Player feature */
export const PlayerFeature = (matchroom: Matchroom) => new Feature('player',
  (feature) => {
    console.log('todo');
  },
);
