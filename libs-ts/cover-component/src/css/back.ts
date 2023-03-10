import css from 'x-syntax';
import type { CoverCssModule } from './types';
import { dynamifyCss } from './helpers';
import blurbCss from './blurb';

const back: CoverCssModule = (scaler, scope) => {
  const [blurbStaticCss, blurbSizeCss] = blurbCss(scaler, scope);

  const staticCss = css`
    .Cover .back {
      overflow: hidden;
    }

    .Cover .back__safe {
      position: relative;
    }

    .Cover .back .diamond {
      left: 50%;
      top: 17%;
      transform: translateX(-50%);
      position: absolute;
      width: 12%;
      z-index: 1;
    }

    .Cover.trim--s .back .diamond {
      top: 12%;
    }

    .Cover.trim--xl .back .diamond {
      top: 19%;
    }

    .Cover .back .about-flp {
      opacity: 0.8;
      font-size: 2.83%;
      line-height: 160%;
      text-align: center;
    }

    .Cover.trim--m .back .about-flp {
      font-size: 2.25%;
    }

    .Cover.trim--xl .back .about-flp {
      font-size: 2.05%;
    }

    .Cover .back .purpose,
    .Cover .back .website {
      box-sizing: border-box;
      left: 0;
      width: 100%;
      position: absolute;
      z-index: 1;
    }

    .Cover .back .purpose {
      padding: 0 10%;
      bottom: 18%;
    }

    .Cover .back .website {
      bottom: 13%;
    }

    .Cover--scale-s .purpose,
    .Cover--scale-xs .website {
      font-size: 0;
      opacity: 0.5;
      background-size: 85% 100%;
      background-repeat: no-repeat;
    }

    .Cover--scale-s .purpose {
      height: 15%;
      background-image: url('https://flp-assets.nyc3.digitaloceanspaces.com/static/cover/purpose.png');
      background-position: center center;
    }

    .Cover--scale-xs .website {
      height: 5%;
      background-image: url('https://flp-assets.nyc3.digitaloceanspaces.com/static/cover/website.png');
      background-position: left top;
    }

    .Cover.trim--s .back .purpose {
      bottom: 20%;
      padding: 0 7%;
      line-height: 145%;
    }

    .Cover.trim--s .back .website {
      bottom: 9%;
      line-height: 142%;
      width: 65%;
      text-align: left;
      position: absolute;
    }

    .Cover .back .logo {
      color: white;
      height: 4.5%;
      position: absolute;
      bottom: 2.25%;
      left: 2.5%;
      z-index: 1;
    }

    .Cover .back .logo--spanish {
      height: 5.2%;
      bottom: 1.4%;
    }

    .Cover.trim--s .back .logo {
      bottom: 0.75%;
      left: 1%;
    }

    .Cover.trim--s .back .logo--spanish {
      bottom: -0.1%;
    }

    .Cover .back .isbn {
      box-sizing: content-box;
      background: white;
      position: absolute;
      bottom: 2.25%;
      right: 0;
    }

    .Cover.trim--s .back .isbn {
      bottom: 0.75%;
      transform: scaleX(0.9);
    }

    ${blurbStaticCss}
  `;

  const dynamicCss = css`
    .Cover .back__safe {
      margin: 0.25in;
    }

    .Cover .isbn {
      width: 1.25in;
      padding: 0.075in;
    }

    ${blurbSizeCss}
  `;

  return [staticCss, dynamifyCss(dynamicCss, scope, scaler)];
};

export default back;
