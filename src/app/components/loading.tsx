import styles from './loading.module.scss';

export const Loading = () => (
  <div className={styles['loading-wrapper']}>
    <div className={styles['loading-dot']}></div>
    <div className={styles['loading-dot']}></div>
    <div className={styles['loading-dot']}></div>
    <div className={styles['loading-dot']}></div>
  </div>
);

export default Loading;
