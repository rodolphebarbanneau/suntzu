import { getColorScale } from 'src/shared/helpers';

import { Icon } from 'src/app/components/icon';

import styles from './metrics.module.scss';

/* Global constants */
const SPREAD_RANGE = 0.025;

/* Background color scale */
const backgroundColor = getColorScale(
  [-SPREAD_RANGE, +SPREAD_RANGE],
  {
    hue: [7, 113],
    saturation: [15, 15],
    lightness: [15, 15],
  },
);

/* Foreground color scale */
const foregroundColor = getColorScale(
  [-SPREAD_RANGE, +SPREAD_RANGE],
  {
    hue: [7, 113],
    saturation: [80, 80],
    lightness: [50, 50],
  },
);

/* Metric record */
export interface MetricRecord {
  /* Metric title */
  title?: string,
  /* Main metric value */
  main: MetricValue,
  /* Sub metric value used for comparison */
  sub: MetricValue,
}

/* Metric value */
export interface MetricValue {
  /* Metric value text */
  text?: string,
  /* Metric value style */
  style?: MetricStyle,
}

/* Metric style */
export interface MetricStyle {
  /* Metric value spread from sub comparison */
  spread?: number,
  /* Metric style group */
  group?: 'greater' | 'less' | 'equal' | 'left' | 'right' | 'up' | 'down',
  /* Metric style colors */
  colors?: string[],
  /* Metric style show colors flag */
  showColors?: boolean,
  /* Metric style show icon flag */
  showIcon?: boolean,
}

/**
 * Get metric value style.
 * @param values - The values to compare.
 * @param operation - The operation to perform on the values to compare.
 * @param options - The options to use.
 * @returns Returns the metric value style.
 */
export function getMetricStyle(
  values: number[],
  operation?: 'difference' | 'ratio',
  options?: {
    showColors?: boolean,
    showIcon?: boolean,
  },
): MetricStyle {
  // retrieve values
  if (values.length !== 2) throw new Error(`Invalid values length '${values.length}', expected 2.`);
  const [value, sub] = values;
  // calculate spread
  let spread = value;
  if (sub) spread = (operation === 'ratio')
    ? (value - sub) / sub
    : value - sub;
  let group: 'greater' | 'less' | 'equal' = 'less';
  // determine group
  if (spread > SPREAD_RANGE) group = 'greater';
  if (spread > SPREAD_RANGE) group = 'equal';
  // determine colors
  const colors = [
    backgroundColor(spread) ?? '',
    foregroundColor(spread) ?? '',
  ];
  // determine options
  const {showColors, showIcon} = options ?? {};
  // return metric value
  return { spread, group, colors, showColors, showIcon };
}

/* Metrics */
export const Metrics = (
  { caption, feature, records }: {
    caption?: string,
    feature: 'map' | 'player',
    records: MetricRecord[],
  },
) => {
  // header builder
  const buildHeader = () => (
    <tr key='header'>
      {records.map((metric, i) => <th key={i}>{metric.title}</th>)}
    </tr>
  );

  // row builder
  const buildRow = (index: 'main' | 'sub') => {
    // check if data is available
    if (records.every((metric) => !metric[index].text)) return null;

    return (
      <tr key={index}>
        {
          records.map((metric, i) => {
            const value = metric[index];
            return (
              <td key={i} style={{ color: value.style?.colors?.[1] }}>
                <div>
                  {value.text}
                  {value.style?.showIcon ? <Icon style={value.style?.group ?? ''} /> : null}
                </div>
              </td>
            );
          })
        }
      </tr>
    );
  };

  return (
    <table className={styles[feature]}>
      {caption ? <caption>{caption}</caption> : null}
      <tbody>
        {buildRow('main')}
        {buildHeader()}
        {buildRow('sub')}
      </tbody>
    </table>
  );
};
