import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import SparkMD5 from 'spark-md5';
import { API_URL, BUILD_NUM, BUILD_SEMVER_STRING, LANG } from '../env';

export default async function logError(
  error: unknown,
  ...details: string[]
): Promise<unknown> {
  let platform: string = Platform.OS;
  if (Platform.OS === `ios`) {
    platform = JSON.stringify({
      os: Platform.OS,
      version: Platform.Version,
      isPad: Platform.isPad,
      isTV: Platform.isTV,
      interfaceIdiom: Platform.constants.interfaceIdiom,
      osVersion: Platform.constants.osVersion,
      systemName: Platform.constants.systemName,
    });
  } else if (Platform.OS === `android`) {
    platform = JSON.stringify({
      os: Platform.OS,
      version: Platform.Version,
      isTV: Platform.isTV,
      release: Platform.constants.Release,
      model: Platform.constants.Model,
      brand: Platform.constants.Brand,
      manufacturer: Platform.constants.Manufacturer,
      constantsVersion: Platform.constants.Version,
    });
  }
  try {
    const installId = await uid(platform);
    await fetch(`${API_URL}/pairql/native/ReportError`, {
      method: `POST`,
      headers: { 'Content-Type': `application/json` },
      body: JSON.stringify({
        buildSemver: BUILD_SEMVER_STRING,
        buildNumber: BUILD_NUM,
        lang: LANG,
        detail: details.join(`\n`),
        platform,
        installId,
        errorMessage: error instanceof Error ? error.message : null,
        errorStack: error instanceof Error ? error.stack : null,
      }),
    });
  } catch {
    return;
  }
  return;
}

async function uid(platform: string): Promise<string> {
  const path = RNFS.DocumentDirectoryPath + `/uid.txt`;
  try {
    return await RNFS.readFile(path, `utf8`); // throws if not found
  } catch {
    try {
      const uid = SparkMD5.hash(`${platform}${Date.now()}${Math.random()}`);
      await RNFS.writeFile(path, uid, `utf8`);
      return uid;
    } catch {
      return `uid-create-fail--${platform}`;
    }
  }
}

export function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return `not-json.stringifyable--` + String(value);
  }
}
