import { EXTENSION_VERSION } from 'src/shared/settings';

import { Link } from '../components/link';

import styles from '../app.module.scss';

import svgSuntzu from 'src/assets/suntzu.svg';

/* Header */
export const Header = () => (

  <header>
    <div className={styles['container']}>
      <img className={styles['logo']} src={svgSuntzu} alt="Suntzu (logo)" />
      <div className={styles['text']}>
        <h1><a className={styles['title']} href="https://suntzu.gg" target="_blank" rel="noreferrer" title="Suntzu.gg">Suntzu</a></h1>
        <div className={styles['version']}>
          <Link
            url="https://github.com/rodolphebarbanneau/suntzu/releases"
            title="Project's GitHub releases"
            text={EXTENSION_VERSION}
          />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
