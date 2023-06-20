import styles from './loading.module.scss';

export const Loading = () => (
  <div className={styles.loading}>
    <div className={styles.loadingdot}></div>
    <div className={styles.loadingdot}></div>
    <div className={styles.loadingdot}></div>
    <div className={styles.loadingdot}></div>
  </div>
);

export default Loading;
