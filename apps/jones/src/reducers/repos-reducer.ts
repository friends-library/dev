import { createReducer } from 'redux-starter-kit';
import type { Repo } from '../type';

interface GithubRepo {
  id: number;
  name: string;
  description?: string;
}

export default createReducer([], {
  RECEIVE_FRIEND_REPOS: (
    state: Repo[],
    action: { payload: GithubRepo[] },
  ): Array<{ id: number; slug: string; friendName: string }> => {
    return action.payload
      .filter((repo) => repo.name !== `dev` && repo.description !== undefined)
      .map((repo) => ({
        id: repo.id,
        slug: repo.name,
        friendName:
          repo.name === `compilations` || repo.name === `compilaciones`
            ? repo.name.replace(/^c/, `C`)
            : (repo.description
                ?.replace(/^.. (.+) source documents$/, `$1`)
                .replace(/ \((d\.|\d)[^)]*\d\)/, ``) ?? ``),
      }));
  },
});
