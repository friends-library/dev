import React from 'react';

type AppState =
  | { view: `app` }
  | { view: `modal:checkout` }
  | { view: `modal:request-free`; book: string };

export type AppAction =
  | { type: `show--app` }
  | { type: `show--modal:checkout` }
  | { type: `show--modal:request-free`; book: string };

export const appInitialState: AppState = { view: `app` };

export const AppDispatch = React.createContext<React.Dispatch<AppAction>>(() => {});

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case `show--app`:
      return { view: `app` };
    case `show--modal:checkout`:
      return { view: `modal:checkout` };
    case `show--modal:request-free`:
      return { view: `modal:request-free`, book: action.book };
  }
}
