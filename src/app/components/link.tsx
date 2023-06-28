import type { ReactNode } from 'react';

import styles from './link.module.scss';

/* Link */
export const Link = (
  { url, title, text, children }: {
    url: string;
    title: string;
    text?: string;
    children?: string | ReactNode;
  },
) => (
  <a
    href={url}
    className={`${styles.link} ${text ? styles.large : styles.small}`}
    target="_blank"
    rel="noreferrer"
    title={title}
  >
    {typeof children === 'string' ? <img src={children} alt={title}></img> : children}
    {text && <p>{text}</p>}
  </a>
);

export default Link;
