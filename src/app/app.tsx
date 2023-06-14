import { About } from './views/about';
import { Header } from './views/header';
import { MapStats } from './views/map-stats';
import { PlayerStats } from './views/player-stats';

export function App() {
  return (
    <div className="app">
      <Header />
      <MapStats />
      <PlayerStats />
      <About />
    </div>
  );
}

export default App;
