import type { ReactNode } from 'react';

import { Link } from '../components/link';
import { Section, SectionHeader, SectionBody } from '../components/section';

import svgBug from 'src/assets/bug.svg';
import svgDiscord from 'src/assets/discord.svg';
import svgFaceit from 'src/assets/faceit.svg';
import svgGithub from 'src/assets/github.svg';

/* About column */
const AboutColumn = (
  { title, children }: {
    title: string;
    children: ReactNode | ReactNode[];
  },
) => (
  <div>
    <h3 style={{ marginBottom: "10px" }}>{title}</h3>
    {children}
  </div>
);

/* About */
export const About = () => (
  <Section>
    <SectionHeader title="About" />
    <SectionBody description="Display players's individual and team map-related stats in the matchroom to make more educated decisions during the voting process." />
    <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0 5px 0" }}>
      <AboutColumn title="Reach out">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", gap: "5px"}}>
          <Link
            url="https://discord.gg/eXqmagTNrr"
            title="Suntzu Discord"
            text="Discord"
            children={svgDiscord}
          />
          <Link
            url="https://github.com/rodolphebarbanneau/suntzu/issues"
            title="Project's GitHub issues"
            text="Report an issue..."
            style="color"
            children={svgBug}
          />
        </div>
      </AboutColumn>
      <AboutColumn title="Authors">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
            <Link
              url="https://www.faceit.com/en/players/erunosaurus"
              title="Creator's FACEIT account (ERU)"
              text="ERU"
              children={svgFaceit}
            />
            <Link
              url="https://github.com/rodolphebarbanneau"
              title="Creator's GitHub account (ERU)"
              children={svgGithub}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
            <Link
              url="https://www.faceit.com/en/players/Skayzr"
              title="Creator's FACEIT account (Skayzr)"
              text="Skayzr"
              children={svgFaceit}
            />
            {/*
            <Link
              url="https://github.com/lbrbn"
              title="Creator's GitHub account (Skayzr)"
              children={svgGithub}
            />
            */}
          </div>
        </div>
      </AboutColumn>
    </div>
  </Section>
);

export default About;
