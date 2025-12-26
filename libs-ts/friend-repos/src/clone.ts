import { promises as fs } from 'fs';
import { exec as nodeExec } from 'child_process';
import { promisify } from 'util';
import exec from 'x-exec';
import { log, c } from 'x-chalk';
import pLimit from 'p-limit';
import data from './data';

export default async function cloneAll(
  rootPath: string,
  deleteExisting = false,
): Promise<void> {
  rootPath = rootPath.replace(/\/$/, ``);
  if (deleteExisting) {
    exec.exit(`rm -rf ./en`, rootPath);
    exec.exit(`rm -rf ./es`, rootPath);
  }

  const isCI = !!process.env.CI;
  const limit = pLimit(isCI ? 100 : 200);
  const pExec = promisify(nodeExec);
  await Promise.all([
    fs.mkdir(`${rootPath}/en`, { recursive: true }),
    fs.mkdir(`${rootPath}/es`, { recursive: true }),
  ]);

  let alreadyCloned = 0;
  const repos = await data();
  const promises = repos.map(({ lang, slug, sshCloneUrl, httpsCloneUrl }) => {
    return limit(async () => {
      const langRoot = `${rootPath}/${lang}`;
      const repoPath = `${langRoot}/${slug}`;
      if (await dirExists(repoPath)) {
        alreadyCloned++;
        return Promise.resolve();
      }
      log(c`📡 Cloning missing repo {green ${lang}/${slug}}`);
      return pExec(`git clone ${isCI ? httpsCloneUrl : sshCloneUrl}`, { cwd: langRoot });
    });
  });

  await Promise.all(promises);

  if (alreadyCloned > 0) {
    log(c`👌 Skipped {green ${alreadyCloned}} repos already cloned.`);
  }
}

async function dirExists(path: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch {
    return false;
  }
}
