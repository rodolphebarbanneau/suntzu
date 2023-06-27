import { debounce } from 'lodash';

import type { Matchroom } from 'src/shared/helpers/matchroom';

export default debounce(async (matchroom: Matchroom) => {
  console.log(matchroom.details?.status ?? 'matchroom is not live');
}, 250);





import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { default as ReactShadowRoot } from 'react-shadow';

import styles from './map.module.scss';
import stylesheet from './map.module.scss?inline';


export const InfoBox = () => {
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(false);

  let timer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    setHover(true);
    timer = setTimeout(() => setShow(true), 100);
  };

  const handleMouseLeave = () => {
    setHover(false);
    clearTimeout(timer);
    setShow(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={styles.infobutton}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      i
      {hover && show && <div className={styles.infobox} >This is some info</div>}
    </div>
  );
};

export const DropCell = ({ value }: { value: number }) => (
    <ReactShadowRoot.Div>
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      <div>
        <DropDown />
        <div>

          <div>
            <InfoBox />
            <div className={styles.cell}>{value}%</div>
          </div>

          <div>
            <InfoBox />
            <div className={styles.cell}>{value}%</div>
          </div>

        </div>
      </div>
    </ReactShadowRoot.Div>
);


export const Bar = ({ value }: { value: number }) => (
  <ReactShadowRoot.Div>
    {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    <div className={styles.bar}></div>
  </ReactShadowRoot.Div>
);


//style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: red; opacity: 0.5; z-index: 1000;"
