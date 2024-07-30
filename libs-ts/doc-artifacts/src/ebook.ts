// @ts-ignore
import Zip from 'node-zip';
// @ts-ignore
import epubCheck from 'epub-check';
import fs from 'fs-extra';
import { red } from 'x-chalk';
import type { EbookOptions, FileManifest } from './types';
import { dirs } from './dirs';
import format from './format';

export async function writeEbookManifest(
  manifest: FileManifest,
  filenameNoExt: string,
  opts: EbookOptions,
): Promise<string> {
  const { ARTIFACT_DIR, SRC_DIR } = dirs(opts);
  fs.ensureDirSync(SRC_DIR);

  const zip = new Zip();
  const promises: Promise<void>[] = [];

  Object.keys(manifest).forEach((path) => {
    const formatted = format(path, manifest[path]);
    zip.file(path, formatted);
    promises.push(
      fs.outputFile(
        `${SRC_DIR}/${path}`,
        formatted,
        path.endsWith(`.png`) ? `binary` : undefined,
      ),
    );
  });

  const binary = zip.generate({ base64: false, compression: `DEFLATE` });
  const basename = `${filenameNoExt}.epub`;
  const epubPath = `${ARTIFACT_DIR}/${basename}`;
  promises.push(fs.writeFile(epubPath, binary, `binary`));
  await Promise.all(promises);

  if (opts.check) {
    const check: { pass: boolean; messages: unknown[] } = await epubCheck(SRC_DIR);
    if (!check.pass && check.messages.length > 0) {
      logEpubCheckFail(basename, check.messages);
      throw new Error(`epubCheck failed for ${basename}`);
    }
  }

  return epubPath;
}

function logEpubCheckFail(filename: string, warnings: any[]): void {
  const simplified = warnings.map((msg) => ({
    location: `${msg.file.replace(/^\.\//, ``)}:${msg.line} (${msg.col})`,
    error: `${msg.msg} ${msg.type}`,
  }));
  red(`EpubCheck failed for "${filename}" warnings below:`);
  red(JSON.stringify(simplified, null, 2));
}
