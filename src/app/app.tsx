import { About } from './views/about';
import { Header } from './views/header';
import { MapMetrics } from './views/map-metrics';
import { PlayerMetrics } from './views/player-metrics';

export function App() {
  return (
    <div className="app">
      <Header />
      <MapMetrics />
      <PlayerMetrics />
      <About />
    </div>
  );
}

export default App;
