import styles from './metrics.module.scss';

/* Metric data */
interface MetricData {
  /* Metric title */
  title?: string,
  /* Main metric value */
  main: MetricValue,
  /* Sub metric value used for comparison */
  sub: MetricValue,
}

/* Metric value */
interface MetricValue {
  /* Metric value */
  value?: string,
  /* Metric value indicator icon */
  icon?: 'greater' | 'less' | 'equal',
}

/* Metrics */
export const Metrics = (
  { caption, feature, data }: {
    caption?: string,
    feature: 'map' | 'player',
    data: MetricData[],
  },
) => {
  // header builder
  const buildHeader = () => (
    <tr key='header'>
      {data.map((metric, i) => <th key={i}>{metric.title}</th>)}
    </tr>
  );

  // row builder
  const buildRow = (index: 'main' | 'sub') => {
    // check if data is available
    if (data.every((metric) => !metric[index].value)) return null;

    return (
      <tr key={index}>
        {
          data.map((metric, i) => {
            const value = metric[index];
            return (
              <td key={i}>
                {
                  value.icon
                    ? <span className={styles[value.icon]}>{value.value}</span>
                    : value.value
                }
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
