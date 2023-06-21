import { About } from './views/about';
import { Header } from './views/header';
import { MapSettings } from './views/map-settings';
import { PlayerSettings } from './views/player-settings';

import styles from './app.module.scss';

export const App = () => {
  return (
    <div id="app" className={styles.app}>
      <Header />
      <MapSettings />
      <PlayerSettings />
      <About />
    </div>
  );
}

export default App;
