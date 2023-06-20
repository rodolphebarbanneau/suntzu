import { About } from './views/about';
import { Header } from './views/header';
import { MapFeature } from './views/map-feature';
import { PlayerFeature } from './views/player-feature';

import styles from './app.module.scss';

export const App = () => {
  return (
    <div id="app" className={styles.app}>
      <Header />
      <MapFeature />
      <PlayerFeature />
      <About />
    </div>
  );
}

export default App;
