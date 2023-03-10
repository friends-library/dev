import { useDispatch as RDXUseDispatch, createSelectorHook } from 'react-redux';
import type { Action, AnyAction, Dispatch as RDXDispatch } from '@reduxjs/toolkit';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';
import type { State } from './root-reducer';
import { initialState as prefsInitialState } from './preferences';
import { initialState as networkInitialState } from './network';
import { initialState as ephemeralInitialState } from './ephemeral';
import { initialState as dimensionsInitialState } from './dimensions';
import { initialState as resumeInitialState } from './resume';
import { initialState as audioInitialState } from './audio/audio-root-reducer';
import { initialState as ebookInitialState } from './ebook/ebook-root-reducer';

export const INITIAL_STATE: State = {
  version: 2,
  audio: audioInitialState,
  ebook: ebookInitialState,
  preferences: prefsInitialState,
  network: networkInitialState,
  ephemeral: ephemeralInitialState,
  dimensions: dimensionsInitialState,
  resume: resumeInitialState,
};

export type { State };
// this type derived from looking at `type of store.dispatch`
export type Dispatch = ThunkDispatch<any, unknown, AnyAction> &
  ThunkDispatch<any, unknown, AnyAction> &
  RDXDispatch<AnyAction>;
export type Thunk = ThunkAction<void, State, unknown, Action<string>>;
export const useSelector = createSelectorHook<State>();
export const useDispatch = (): Dispatch => RDXUseDispatch<Dispatch>();

export type PropSelector<OwnProps, Props> = (
  ownProps: OwnProps,
  dispatch: Dispatch,
) => (state: State) => null | Props;
