import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom } from 'src/shared/core';
import { Feature } from 'src/shared/core';
import { getColorScale } from 'src/shared/helpers';

import { Cell, Column, Grid } from 'src/app/components/grid';
import { Tooltip } from 'src/app/components/tooltip';

import styles from './player.module.scss';
import stylesheet from './player.module.scss?inline';

/* Player feature */
export const PlayerFeature = (matchroom: Matchroom) => new Feature('player',
  (feature) => {
    console.log('todo');
  },
);

// todo both: retrieve/update metrics on range change

// todo map
// map.container.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
// maps.forEach((map) => {
//   const mapContainer = document.createElement('div');
//   mapContainer.id = `${EXTENSION_NAME}-map-metrics`;
//   map.container.append(mapContainer)
//   const mapRoot = createRoot(mapContainer);
//   mapRoot.render(
//     <DropCell value={100} />
//   );
//   const h = 120, // Hue for green // 60 yellow, 0 red
//         s = 15, // Saturation
//         l = 15; // Lightness - reduce by darkness factor
//   map.container.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
//   //map.container.style.opacity = '0.1';
//
// });

// todo player
// import type { ReactNode } from 'react';
// import { useState, useEffect } from 'react';
// import { default as ReactShadowRoot } from 'react-shadow';
//
// import styles from './map.module.scss';
// import stylesheet from './map.module.scss?inline';


// export const InfoBox = () => {
//   const [hover, setHover] = useState(false);
//   const [show, setShow] = useState(false);
//
//   let timer: NodeJS.Timeout;
//
//   const handleMouseEnter = () => {
//     setHover(true);
//     timer = setTimeout(() => setShow(true), 100);
//   };
//
//   const handleMouseLeave = () => {
//     setHover(false);
//     clearTimeout(timer);
//     setShow(false);
//   };
//
//   useEffect(() => {
//     return () => {
//       clearTimeout(timer);
//     };
//   }, []);
//
//   return (
//     <div
//       className={styles.infobutton}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       i
//       {hover && show && <div className={styles.infobox} >This is some info</div>}
//     </div>
//   );
// };
//
// export const DropCell = ({ value }: { value: number }) => (
//     <ReactShadowRoot.Div>
//       {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
//       <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
//       <div>
//         <DropDown />
//         <div>
//
//           <div>
//             <InfoBox />
//             <div className={styles.cell}>{value}%</div>
//           </div>
//
//           <div>
//             <InfoBox />
//             <div className={styles.cell}>{value}%</div>
//           </div>
//
//         </div>
//       </div>
//     </ReactShadowRoot.Div>
// );
//
//
// export const Bar = ({ value }: { value: number }) => (
//   <ReactShadowRoot.Div>
//     {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
//     <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
//     <div className={styles.bar}></div>
//   </ReactShadowRoot.Div>
// );
//
//
// //style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: red; opacity: 0.5; z-index: 1000;"
