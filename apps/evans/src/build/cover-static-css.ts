import fs from 'fs';
import { css } from '@friends-library/cover-component';

const destPath = `${__dirname}/../css/cover.css`;
const coverCss = `${css.allStatic(false)}\n${css.allDynamic()}`;
fs.writeFileSync(destPath, coverCss);
