import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom } from 'src/shared/core';
import { Feature } from 'src/shared/core';

import { Option } from 'src/app/components/option';
import { Toolbar, ToolbarHeader, ToolbarBody } from 'src/app/components/toolbar';
import { Tooltip } from 'src/app/components/tooltip';

import stylesheet from './toolbar.module.scss?inline';

/* Toolbar feature */
export const ToolbarFeature = (matchroom: Matchroom) => new Feature('toolbar',
  (feature) => {
    // retrieve matchroom information
    const info = matchroom.getInformation();
    // do nothing if matchroom information is not available
    if (!info) return;

    // create component
    feature.add(
      <ReactShadowRoot.Div>
        {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Toolbar>
          <ToolbarHeader>
          <a
            href="https://suntzu.gg"
            target="_blank"
            rel="noreferrer"
            title="Suntzu"
          >
            <svg id="uuid-a695e3b8-14e2-4780-bc42-14f1c599ed65" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 4415">
              <defs><style>.uuid-33083721-81c8-4303-a0fe-a9985838a625{"fill:#f0eff4;"}</style></defs>
              <path className="uuid-33083721-81c8-4303-a0fe-a9985838a625" d="m896.38,3638.12l-63.61-583.2c-4.6-42.18,9-84.49,37.32-116.07,28.32-31.58,68.9-49.7,111.31-49.7h173.75c61.18-77.34,137.42-145.68,225.18-202.09-29.35-15.87-57.07-33.05-83.04-51.52-156.34-111.23-250.89-266.11-282.34-461.71-21.13,15.73-47.09,24.74-74.26,24.74-9.52,0-19.18-1.1-28.82-3.4h0c-32.3-7.71-59.66-27.53-77.06-55.82-9.84-16-15.81-33.63-17.76-51.77l-16.42-3.92c-93.19-22.22-172.15-79.42-222.34-161.04-50.18-81.62-65.59-177.92-43.37-271.13,34.31-143.95,151.43-246.94,288.8-270.48-1.17-27.49.48-55.21,5.06-82.97,25.2-152.72,134.68-280.61,278.93-325.85,226.12-240.71,546.32-387.18,892.44-387.18,369.56,0,708.81,166.24,936.08,435.79,124.59,54.35,214.77,160.73,239.98,286.65,4.96,24.79,7.33,49.75,7.16,74.76,134.5,25.67,248.43,127.65,282.19,269.28,45.86,192.43-73.34,386.3-265.72,432.18h0l-16.42,3.92c-1.95,18.14-7.92,35.77-17.76,51.77-17.4,28.29-44.77,48.11-77.06,55.82h0c-9.64,2.3-19.31,3.4-28.83,3.4-15.98,0-31.54-3.12-45.95-8.87-34.64,196.07-132.13,349.96-291.06,458.75-31.18,21.34-64.77,40.82-100.61,58.41,75.37,52.35,141.38,113.79,195.58,182.3h201.32c42.41,0,82.99,18.12,111.31,49.7,28.32,31.59,41.93,73.89,37.32,116.07l-63.57,582.87c525.43-354.91,870.89-956.01,870.89-1637.79,0-1090.76-884.24-1975-1975-1975S25,909.24,25,2000c0,681.99,345.68,1283.25,871.38,1638.12Z"/>
              <ellipse className="uuid-33083721-81c8-4303-a0fe-a9985838a625" cx="2394.06" cy="1833.23" rx="109.86" ry="153.87"/>
              <ellipse className="uuid-33083721-81c8-4303-a0fe-a9985838a625" cx="1606.39" cy="1833.23" rx="109.86" ry="153.87"/>
            </svg>
          </a>
            <h1 style={{ marginLeft: ".3rem" }}>Suntzu</h1>
            <Tooltip message={'test'} />
          </ToolbarHeader>
          <ToolbarBody>
            <Option title="Match" matchroom={matchroom} key="matches" />
            <Option title="Time" matchroom={matchroom} key="timeSpan" />
            <Option title="Player" matchroom={matchroom} key="players" />
          </ToolbarBody>
        </Toolbar>
      </ReactShadowRoot.Div>
    ).prependTo(info);
  },
);
