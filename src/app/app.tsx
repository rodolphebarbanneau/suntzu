import { About } from './views/about';
import { Header } from './views/header';
import { MapSettings, PlayerSettings } from './views/settings';

import styles from './app.module.scss';

/* Application */
export const App = () => {
  return (
    <div id="app" className={styles['app']}>
      <Header />
      <MapSettings />
      <PlayerSettings />
      <About />
    </div>
  );
}

export default App;
