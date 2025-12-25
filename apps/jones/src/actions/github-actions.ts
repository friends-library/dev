import smalltalk from 'smalltalk';
import { lintFix as fixLints } from '@friends-library/adoc-lint';
import type { Task, ReduxThunk, Dispatch, State } from '../type';
import * as gh from '../lib/github-api';
import { lintOptions } from '../lib/lint';
import { LANG } from '../lib/github-api';

export function deleteTask(id: string): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch({
      type: `DELETE_TASK`,
      payload: id,
    });

    const { tasks, repos, github } = getState();
    const task = tasks.present[id];
    if (github.token === null || !task) {
      return;
    }

    const repo = repos.find((r) => r.id === task.repoId);
    if (!repo) {
      return;
    }

    try {
      gh.deleteBranch(github.user, repo.slug, `task-${id}`);
    } catch {
      // ¯\_(ツ)_/¯
    }
  };
}

export function syncPullRequestStatus(task: Task): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    if (!task.pullRequest) {
      return;
    }

    const state = getState();
    const repo = state.repos.find((r) => r.id === task.repoId);
    if (!repo) {
      return;
    }

    try {
      const status = await gh.pullRequestStatus(repo.slug, task.pullRequest.number);
      dispatch({
        type: `UPDATE_PULL_REQUEST_STATUS`,
        payload: {
          id: task.id,
          status,
        },
      });
    } catch {
      // ¯\_(ツ)_/¯
    }
  };
}

export function submitTask(task: Task): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { github } = getState();
    if (github.token === null) throw new Error(`Github user not authenticated`);

    const fixedTask = lintFix(task, dispatch, getState);
    dispatch({ type: `SUBMITTING_TASK` });
    const pr = await tryGithub(
      async () => {
        return await gh.createNewPullRequest(fixedTask, github.user);
      },
      `SUBMIT_TASK`,
      dispatch,
    );
    if (pr) {
      dispatch({
        type: `TASK_SUBMITTED`,
        payload: {
          id: task.id,
          prNumber: pr.number,
          parentCommit: pr.commit,
        },
      });
    }
  };
}

function lintFix(task: Task, dispatch: Dispatch, getState: () => State): Task {
  Object.keys(task.files).forEach((path) => {
    const file = task.files[path];
    if (typeof file.editedContent !== `string` || file.editedContent === file.content) {
      return;
    }

    const { fixed } = fixLints(file.editedContent, lintOptions(file.path));
    if (
      !fixed ||
      typeof fixed !== `string` ||
      fixed.length < 8 ||
      fixed === file.editedContent
    ) {
      return;
    }

    dispatch({
      type: `UPDATE_FILE`,
      payload: { id: task.id, path, adoc: fixed },
    });
  });

  return getState().tasks.present[task.id];
}

export function resubmitTask(task: Task): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { github } = getState();
    if (github.token === null) throw new Error(`Github user not authenticated`);

    const fixedTask = lintFix(task, dispatch, getState);
    dispatch({ type: `RE_SUBMITTING_TASK` });
    const sha = await tryGithub(
      async () => {
        return await gh.addCommit(fixedTask /*, github.user */);
      },
      `SUBMIT_TASK`,
      dispatch,
    );
    if (sha) {
      dispatch({
        type: `TASK_RE_SUBMITTED`,
        payload: {
          id: task.id,
          parentCommit: sha,
        },
      });
    }
  };
}

export function checkout(task: Task): ReduxThunk {
  return async (dispatch: Dispatch) => {
    dispatch({ type: `START_CHECKOUT` });
    const data: {
      documentTitles: Record<string, string>;
      parentCommit: string;
      files: Record<string, gh.GitFile>;
    } = await tryGithub(
      async () => {
        const repoSlug = await gh.getRepoSlug(task.repoId);
        const parentCommit = await gh.getHeadSha(repoSlug, `master`);
        const fileArray = await gh.getAdocFiles(repoSlug, parentCommit);
        const files = fileArray.reduce(
          (acc, file) => {
            acc[file.path] = file;
            return acc;
          },
          {} as Record<string, gh.GitFile>,
        );
        const docResponse = await window.fetch(`/.netlify/functions/get-documents`);
        const allDocumentTitles: Record<string, string> = await docResponse.json();
        const documentTitles = Object.entries(allDocumentTitles).reduce<
          Record<string, string>
        >((acc, [key, title]) => {
          if (key.startsWith(`${LANG}/${repoSlug}`)) {
            acc[key.replace(`${LANG}/${repoSlug}/`, ``)] = title;
          }
          return acc;
        }, {});
        return { documentTitles, files, parentCommit };
      },
      `CHECKOUT`,
      dispatch,
    );

    if (data) {
      dispatch({
        type: `UPDATE_TASK`,
        payload: {
          id: task.id,
          data,
        },
      });
      dispatch({ type: `END_CHECKOUT` });
    } else {
      dispatch({ type: `CHANGE_SCREEN`, payload: `TASKS` });
    }
  };
}

export function fetchFriendRepos(): ReduxThunk {
  return async (dispatch: Dispatch) => {
    dispatch({ type: `REQUEST_FRIEND_REPOS` });
    try {
      const friendRepos = await gh.getFriendRepos();
      dispatch({ type: `RECEIVE_FRIEND_REPOS`, payload: friendRepos });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      dispatch({ type: `NETWORK_ERROR` });
      return;
    }
  };
}

export function requestGitHubUser(): ReduxThunk {
  return async (dispatch: Dispatch) => {
    dispatch({ type: `REQUEST_GITHUB_USER` });
    const { data: user } = await gh.req(`/user`);
    dispatch({
      type: `RECEIVE_GITHUB_USER`,
      payload: {
        name: user.name,
        avatar: user.avatar_url,
        user: user.login,
      },
    });
  };
}

async function tryGithub(
  fn: () => any,
  errorType: string,
  dispatch: Dispatch,
): Promise<any> {
  let result;
  try {
    result = await fn();
  } catch {
    dispatch({ type: `NETWORK_ERROR` });
    alertGithubError(errorType);
    return false;
  }
  return result;
}

function alertGithubError(type: string): void {
  smalltalk.alert(`😬 <b style="color: red;">Network Error</b>`, ghErrorMsgs[type]);
}

const ghErrorMsgs: { [key: string]: string } = {
  SUBMIT_TASK: `There was an error submitting your task to GitHub. Probably just a temporary glitch on their end. None of your work was lost, try submitting again in a few seconds. 🤞`,
  CHECKOUT: `There was an error retrieving source files to edit. Probably just a temporary glitch with GitHub. Try again in a few seconds. 🤞`,
};
