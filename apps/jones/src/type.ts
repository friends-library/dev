import type { ActionCreator } from 'redux';
import type { EditionType } from '@friends-library/types';

export type Dispatch = ActionCreator<any>;

export type DateString = string;

export interface Action {
  type: string;
  payload?: any;
}

export type GitHub =
  | {
      token: null;
    }
  | {
      token: string;
      name?: string;
      avatar: string;
      user: string;
    };

export interface SearchResultContext {
  lineNumber: number;
  content: string;
}

export interface SearchResult {
  documentSlug: string;
  editionType: string;
  path: string;
  filename: string;
  dismissed?: true;
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
  context: SearchResultContext[];
}

export interface File {
  sha: string;
  path: string;
  content: string;
  editedContent: string | null;
}

export interface Task {
  id: string;
  name: string;
  created: DateString;
  updated: DateString;
  repoId: number;
  isNew: boolean;
  pullRequest?: {
    number: number;
    status?: `open` | `merged` | `closed`;
  };
  collapsed: { [key: string]: boolean };
  sidebarOpen: boolean;
  sidebarWidth: number;
  documentTitles: { [key: string]: string };
  files: { [key: string]: File };
  editingFile?: string;
  parentCommit?: string;
}

export interface Repo {
  id: number;
  slug: string;
  friendName: string;
}

export interface Search {
  searching: boolean;
  regexp: boolean;
  words: boolean;
  caseSensitive: boolean;
  documentSlug?: string;
  editionType?: EditionType;
  filename?: string;
}

export interface Tasks {
  [key: string]: Task;
}

export interface Undoable<T> {
  past: T[];
  present: T;
  future: T[];
}

export type UndoableTasks = Undoable<Tasks>;

export interface BaseState {
  version: number;
  prefs: {
    editorFontSize: number;
  };
  github: GitHub;
  screen: string;
  currentTask?: string;
  repos: Repo[];
  search: Search;
  network: string[];
}

export type State = BaseState & {
  tasks: UndoableTasks;
};

export type SavedState = BaseState & {
  tasks: Tasks;
};

export type ReduxThunk = (dispatch: Dispatch, getState: () => State) => any;
