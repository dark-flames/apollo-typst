import './typst.css';

import * as Typst from '@myriaddreamin/typst.ts/dist/esm/main.mjs';

import './render';
import breakpoints from '../breakpoints.json';

export default {
  ...Typst,
};

/**
 * Width          Device                    Scale   MarginWidth    MaxAppWidth   DataWidth
 * 0   ~ 320  px	Smartwatches               ~1.0    40            280           280
 * 321 ~ 420  px	Smaller devices            ~1.0    40            380           380
 * 421 ~ 599  px	Phones                     ~1.0    40            559           559
 * 600 ~ 767  px	Tablets and Large Phones   1.0     52            715           715
 * 768 ~ 991  px	Tablets                    ~       64            927
 * 992 ~ 1119 px	Laptops and Desktops       ~       64            1000         
 * 1200 ~      px	Monitors, Desktops         1.5     64            1000              
 */
window.calcScale = function (appWidth) {
  const maxDataWidth = breakpoints[breakpoints.length - 1];
  if (appWidth >= maxDataWidth) {
    return appWidth / maxDataWidth;
  } else {
    let dataWidth = breakpoints[0];
    for(const breakpoint of breakpoints) {
      if (breakpoint > appWidth) {
        break;
      } else {
        dataWidth = breakpoint;
      }
    }
    console.log(`Scale: app: ${appWidth}, data: ${dataWidth}, scale = ${appWidth / dataWidth}`);
    return appWidth / dataWidth;
  }
}
