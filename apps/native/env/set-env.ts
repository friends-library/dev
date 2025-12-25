import * as fs from 'fs';
import * as path from 'path';
import exec from 'x-exec';
import { MAROON_HEX, GOLD_HEX } from '@friends-library/theme';
import type { Lang } from '@friends-library/types';
import { BUILD_SEMVER_STRING, BUILD_NUM } from './build-constants';

const ENV_DIR = __dirname;
const APP_DIR = path.resolve(ENV_DIR, `..`);
const GENERATED_FILE = `${ENV_DIR}/index.ts`;
const [LANG, MODE] = getEnv();
const APP_NAME = LANG === `en` ? `Friends Library` : `Biblioteca de los Amigos`;
const PRIMARY_COLOR_HEX = LANG === `en` ? MAROON_HEX : GOLD_HEX;
const APP_IDENTIFIER = getAppIdentifier();

function main(): void {
  exec.exit(`printf "// auto-generated, do not edit\n" > ${GENERATED_FILE}`);
  exec.exit(
    `printf "import type { Lang } from '@friends-library/types';\n\n" >> ${GENERATED_FILE}`,
  );
  exec.exit(`cat ${ENV_DIR}/build-constants.ts >> ${GENERATED_FILE}`);

  const API_URL =
    MODE === `dev` ? `http://192.168.10.227:8080` : `https://api.friendslibrary.com`;

  // @see https://xkcd.com/1638/
  const constants = [
    `export const LANG: Lang = \\\`${LANG}\\\`;`,
    `export const PRIMARY_COLOR_HEX = \\\`${PRIMARY_COLOR_HEX}\\\`;`,
    `export const APP_NAME = \\\`${APP_NAME}\\\`;`,
    `export const MODE: \\\`release\\\` | \\\`beta\\\` | \\\`dev\\\` = \\\`${MODE}\\\`;`,
    `export const API_URL = \\\`${API_URL}\\\`;`,
  ];

  exec.exit(`printf "${constants.join(`\n`)}\n" >> ${GENERATED_FILE}`);

  exec.exit(`mkdir -p ${APP_DIR}/android/app/src/debug/java/com/friendslibrary`);
  exec.exit(`mkdir -p ${APP_DIR}/android/app/src/main/java/com/friendslibrary`);
  exec.exit(`mkdir -p ${APP_DIR}/android/app/src/release/java/com/friendslibrary`);

  // android
  copyFileWithEnv(`android/build.gradle`, `android/app/build.gradle`);
  copyFileWithEnv(`android/colors.xml`, `android/app/src/main/res/values/colors.xml`);
  copyFileWithEnv(`android/strings.xml`, `android/app/src/main/res/values/strings.xml`);
  copyFileWithEnv(
    `android/MainApplication.java`,
    `android/app/src/main/java/com/friendslibrary/MainApplication.java`,
  );
  copyFileWithEnv(
    `android/MainActivity.java`,
    `android/app/src/main/java/com/friendslibrary/MainActivity.java`,
  );
  copyFileWithEnv(
    `android/SplashActivity.java`,
    `android/app/src/main/java/com/friendslibrary/SplashActivity.java`,
  );
  copyFileWithEnv(
    `android/ReactNativeFlipper.debug.java`,
    `android/app/src/debug/java/com/friendslibrary/ReactNativeFlipper.java`,
  );
  copyFileWithEnv(
    `android/ReactNativeFlipper.release.java`,
    `android/app/src/release/java/com/friendslibrary/ReactNativeFlipper.java`,
  );
  const resDirs = [
    `layout`,
    `drawable`,
    `mipmap-hdpi`,
    `mipmap-mdpi`,
    `mipmap-xhdpi`,
    `mipmap-xxhdpi`,
    `mipmap-xxxhdpi`,
  ];
  resDirs.forEach((dir) => copyDir(`android/${LANG}/${dir}`, `android/app/src/main/res`));

  // ios
  copyFileWithEnv(`ios/Info.plist`, `ios/FriendsLibrary/Info.plist`);
  copyFileWithEnv(
    `ios/${LANG}/LaunchScreen.storyboard`,
    `ios/FriendsLibrary/LaunchScreen.storyboard`,
  );

  copyDir(`ios/${LANG}/${MODE}/AppIcon.appiconset`, `ios/FriendsLibrary/Images.xcassets`);
  copyDir(`ios/${LANG}/SplashIcon.imageset`, `ios/FriendsLibrary/Images.xcassets`);

  const workspacePath = `${APP_DIR}/ios/FriendsLibrary.xcodeproj/project.pbxproj`;
  const workspaceCode = fs.readFileSync(workspacePath, `utf8`);
  const updatedCode = workspaceCode.replace(
    /PRODUCT_BUNDLE_IDENTIFIER = "com\.friendslibrary\..+";/g,
    `PRODUCT_BUNDLE_IDENTIFIER = "${APP_IDENTIFIER}";`,
  );
  fs.writeFileSync(workspacePath, updatedCode);
}

function copyDir(src: string, dest: string): void {
  if (!dest) throw new Error(`Unexpected unsafe destination!`);
  const destPath = `${APP_DIR}/${dest}`;
  exec.exit(`rm -rf ${destPath}/${src.split(`/`).pop()}`);
  exec.exit(`mkdir -p ${destPath}`);
  exec.exit(`cp -r ${ENV_DIR}/files/${src} ${destPath}`);
}

function copyFileWithEnv(src: string, dest: string): void {
  let code = fs.readFileSync(`${ENV_DIR}/files/${src}`, `utf8`);

  const replacements: [string, string][] = [
    [`{LANG}`, LANG],
    [`{APP_NAME}`, APP_NAME],
    [`{BUILD_NUM}`, String(BUILD_NUM)],
    [`{APP_IDENTIFIER}`, APP_IDENTIFIER],
    [`{ANDROID_APP_IDENTIFIER}`, MODE !== `dev` ? APP_IDENTIFIER : `com.friendslibrary`],
    [`{BUILD_SEMVER_STRING}`, BUILD_SEMVER_STRING],
    [`{PRIMARY_COLOR_HEX}`, PRIMARY_COLOR_HEX],
    [`{ALLOW_INSECURE_LOCALHOST}`, ALLOW_INSECURE_LOCALHOST],
  ];

  for (const [pattern, value] of replacements) {
    code = code.replace(new RegExp(pattern, `g`), value);
  }

  let slashComment = ``;
  if (src.endsWith(`.gradle`) || src.endsWith(`.java`)) {
    slashComment = `// auto-generated, do not edit\n`;
  }

  let xmlComment = ``;
  if (src.endsWith(`.xml`) || src.endsWith(`.plist`) || src.endsWith(`.storyboard`)) {
    xmlComment = `\n<!-- auto-generated, do not edit -->`;
  }

  // insert xml on second line (comments not valid above xml declaration)
  const lines = code.split(`\n`);
  lines[0] = `${slashComment}${lines[0]}${xmlComment ? xmlComment : ``}`;
  code = lines.join(`\n`);

  fs.writeFileSync(`${APP_DIR}/${dest}`, code);
}

function getAppIdentifier(): string {
  const base = `com.friendslibrary.FriendsLibrary`;
  if (MODE === `beta` && LANG === `en`) {
    return base; // match original bundle id for ios english test flight
  }
  return `${base}.${LANG}.${MODE}`;
}

function getEnv(): [Lang, `dev` | `beta` | `release`] {
  const env = fs.readFileSync(`${APP_DIR}/.env`, `utf8`).trim();
  const langMatch = env.match(/LANG=(\w+)/);
  if (!langMatch || !langMatch[1]) {
    throw new Error(`Invalid .env file: ${env}, missing LANG`);
  }

  const lang = langMatch[1];
  if (lang !== `en` && lang !== `es`) {
    throw new Error(`Invalid lang: ${langMatch[1]}`);
  }

  const modeMatch = env.match(/MODE=(\w+)/);
  if (!modeMatch || !modeMatch[1]) {
    throw new Error(`Invalid .env file: ${env}, missing MODE`);
  }

  const mode = modeMatch[1];
  if (mode !== `dev` && mode !== `beta` && mode !== `release`) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  return [lang, mode];
}

const ALLOW_INSECURE_LOCALHOST =
  MODE !== `dev`
    ? `<!-- omit localhost http exception for release/beta -->`
    : `<key>NSExceptionDomains</key>
       <dict>
         <key>localhost</key>
         <dict>
           <key>NSExceptionAllowsInsecureHTTPLoads</key>
           <true/>
         </dict>
       </dict>`;

main();
