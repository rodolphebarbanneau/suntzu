import svgSuntzu from 'src/assets/suntzu.svg';

import { Link } from '../components/link';

/* Header */
export const Header = () => (
  <header>
    <img src={svgSuntzu} alt="Suntzu (logo)" />
    <div style={{ display: "flex", marginTop: "10px"  }}>
      <h1><a href="https://suntzu.gg" target="_blank" rel="noreferrer" title="Suntzu.gg">Suntzu</a></h1>
      <div style={{ margin: "5px 0 0 5px"}}>
        <Link
          url="https://github.com/rodolphebarbanneau/suntzu"
          title="Project's GitHub repository"
          text="0.1.0-beta.1"
        />
      </div>
    </div>
  </header>
);

export default Header;
