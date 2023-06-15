import { ReactNode } from 'react';

import { Link } from '../components/link';
import { Section, SectionHeader, SectionBody } from '../components/section';

import svgFaceit from '../../assets/faceit.svg';
import svgGithub from '../../assets/github.svg';
import svgReddit from '../../assets/reddit.svg';

const AboutColumn = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode | ReactNode[];
}) => (
  <div>
    <h3 style={{ marginBottom: "10px" }}>{title}</h3>
    {children}
  </div>
);

export const About = () => (
  <Section>
    <SectionHeader title="About" />
    <SectionBody description="Display players's individual and team map-related stats in the matchroom to make more educated decisions during the veto process." />
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", marginBottom: "5px" }}>
      <AboutColumn title="Reach out">
        <Link
          url="https://www.reddit.com/r/suntzu-faceit/"
          title="Suntzu Reddit"
          text="Reddit"
          img={svgReddit}
        />
      </AboutColumn>
      <AboutColumn title="Creators">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
            <Link
              url="https://www.faceit.com/en/players/erunosaurus"
              title="Creator's FACEIT account (ERU)"
              text="ERU"
              img={svgFaceit}
            />
            <Link
              url="https://github.com/rodolphebarbanneau"
              title="Creator's GitHub account (ERU)"
              img={svgGithub}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
            <Link
              url="https://www.faceit.com/en/players/Skayzr"
              title="Creator's FACEIT account (Skayzr)"
              text="Skayzr"
              img={svgFaceit}
            />
            <Link
              url="https://github.com/lbrbn"
              title="Creator's GitHub account (Skayzr)"
              img={svgGithub}
            />
          </div>
        </div>
      </AboutColumn>
    </div>
  </Section>
);

export default About;
