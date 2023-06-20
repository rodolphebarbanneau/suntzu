import styles from './link.module.scss';

export const Link = (
  { url, title, text,  img }: {
    url: string;
    title: string;
    img: string;
    text?: string;
  },
) => (
  <a href={url} className={text ? styles.lg : styles.sm} target="_blank" rel="noreferrer" title={title}>
    <img src={img} alt={title}></img>
    {text && <p>{text}</p>}
  </a>
);

export default Link;
