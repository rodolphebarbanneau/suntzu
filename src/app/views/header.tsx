import svgSuntzu from 'src/assets/suntzu.svg';

export const Header = () => (
  <header>
    <img src={svgSuntzu} alt="Suntzu (logo)" />
    <h1 style={{ marginTop: "10px" }}>Suntzu</h1>
  </header>
);

export default Header;
