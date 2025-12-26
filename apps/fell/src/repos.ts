import { sync as globSync } from 'glob';
import { isNotFalse } from 'x-ts-utils';
import env from '@friends-library/env';
import type { Repo } from './type';
import * as git from './git';

export async function getRepos(
  exclude: string[],
  branch?: string,
  glob?: (pattern: string) => string[],
): Promise<string[]> {
  const { DOCS_REPOS_ROOT: ROOT } = env.require(`DOCS_REPOS_ROOT`);
  const repos = (glob ?? globSync)(`${ROOT}/{en,es}/*`);
  const notExcluded = repos.filter((repo) => {
    return exclude.reduce((bool, str) => {
      return bool === false ? false : repo.indexOf(str) === -1;
    }, true as boolean);
  });

  if (!branch) {
    return notExcluded;
  }

  const branches = await Promise.all(
    notExcluded.map(async (repo) => git.getCurrentBranch(repo)),
  );

  return branches
    .map((repoBranch, idx) =>
      repoBranch === branch ? (notExcluded[idx] ?? false) : false,
    )
    .filter(isNotFalse);
}

export async function getStatusGroups(
  repos: Repo[],
): Promise<{ clean: Repo[]; dirty: Repo[] }> {
  const clean: Repo[] = [];
  const dirty: Repo[] = [];
  await Promise.all(
    repos.map(async (repo) => {
      const isClean = await git.isStatusClean(repo);
      isClean ? clean.push(repo) : dirty.push(repo);
    }),
  );
  return { dirty, clean };
}

export async function getBranchMap(repos: Repo[]): Promise<Map<string, Repo[]>> {
  const repoBranches = new Map();
  await Promise.all(
    repos.map(async (repo) => {
      const branch = await git.getCurrentBranch(repo);
      repoBranches.set(repo, branch);
    }),
  );
  return [...repoBranches.entries()].reduce((map, [repo, branch]) => {
    const current = map.get(branch);
    map.set(branch, current ? current.concat([repo]) : [repo]);
    return map;
  }, new Map());
}
