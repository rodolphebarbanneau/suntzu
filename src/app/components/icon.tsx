import styles from './icon.module.scss';

/* Icon */
export const Icon = (
  { style }: {
    style: string;
  },
) => {
  return (
    <span className={styles['icon'] + ' ' + styles[style]} />
  );
};

export default Icon;
