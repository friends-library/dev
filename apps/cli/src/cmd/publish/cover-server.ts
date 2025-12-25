import { exec, execSync } from 'child_process';
import puppeteer from 'puppeteer';
import xExec from 'x-exec';
import env from '@friends-library/env';
import { green } from 'x-chalk';

// @ts-ignore
import Png from 'png-js';

export async function start(): Promise<number> {
  xExec.exit(`which serve`);
  const port = 51515;
  const { DEV_APPS_PATH } = env.require(`DEV_APPS_PATH`);
  green(`Building cover app...`);
  execSync(`cd ${DEV_APPS_PATH}/cover-web-app && npm run build`);
  green(`Serving cover app`);
  stop(port);
  exec(`serve -l ${port} ${DEV_APPS_PATH}/cover-web-app/dist`);
  await new Promise((res) => setTimeout(res, 1000));
  return port;
}

export function stop(port: number): void {
  execSync(`lsof -t -i tcp:${port} | xargs kill`);
}

export interface ScreenshotTaker {
  (path: string, type: `ebook` | `audio` | `threeD`): Promise<Buffer>;
}

interface BrowserCloser {
  (): Promise<void>;
}

export async function screenshot(
  port: number,
): Promise<[ScreenshotTaker, BrowserCloser]> {
  const browser = await puppeteer.launch({
    // NOTE: need PUPPETEER_PRODUCT=firefox when installing npm
    product: `firefox`,
    headless: true, // false to see what it's doing
    dumpio: false, // true to see verbose console stuff in terminal
    slowMo: undefined, // set to number like `500` to slow it down
    timeout: 5000,
  });
  const page = await browser.newPage();

  return [
    async (path: string, type: `ebook` | `audio` | `threeD`): Promise<Buffer> => {
      // @TODO, get these magic numbers from API, until then, must keep in sync with API
      const widthThreeD = 1120.0;
      const heightThreeD = widthThreeD / (1120.0 / 1640.0);
      await page.setViewport(
        type === `threeD`
          ? { width: widthThreeD, height: Math.floor(heightThreeD) }
          : { width: 1600, height: 2400 },
      );
      const clip = type === `audio` ? { clip: getAudioImageClip() } : {};
      const url = `http://localhost:${port}?capture=${type}&path=${path}`;
      await page.goto(url, { timeout: 5000 });
      const buffer = (await page.screenshot({ ...clip, encoding: `binary` })) as Buffer;
      if (await isEmptyImage(buffer)) {
        throw new Error(`Got an empty ${type} image from url: ${url}`);
      }
      return buffer;
    },
    async () => await browser.close(),
  ];
}

function getAudioImageClip(): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  // height (in px) of top white bar, which we clip out
  const TOP_WHITE_BAR_HEIGHT = 451;

  // quasi-arbitrary value that tightens in on the main title square
  const ZOOM = 200;

  // a little extra room beyond the height of the top white bar, to center better
  const Y_PADDING = ZOOM / 10;

  // actual width (in px) of full ebook screenshot cover element
  const FULL_WIDTH = 1600;

  return {
    x: ZOOM / 2,
    y: TOP_WHITE_BAR_HEIGHT + Y_PADDING + ZOOM / 2,
    width: FULL_WIDTH - ZOOM,
    height: FULL_WIDTH - ZOOM,
  };
}

async function isEmptyImage(pngBuffer: Buffer): Promise<boolean> {
  const pixelBuffer: Buffer = await new Promise((res) => new Png(pngBuffer).decode(res));
  let currentPixelRgba = pixelBuffer.subarray(0, 4);
  let lastPixelRgba = currentPixelRgba;
  let index = 0;
  while (currentPixelRgba.length === 4) {
    index += 4;
    if (!lastPixelRgba) {
      lastPixelRgba = currentPixelRgba;
    } else if (currentPixelRgba.length < 4) {
      return true;
    } else if (currentPixelRgba.toString() !== lastPixelRgba.toString()) {
      return false;
    } else {
      lastPixelRgba = currentPixelRgba;
      currentPixelRgba = pixelBuffer.subarray(index, index + 4);
    }
  }
  return true;
}
