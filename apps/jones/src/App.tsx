import * as React from 'react';
import { connect } from 'react-redux';
import KeyEvent from 'react-keyboard-event-handler';
import { Global, css } from '@emotion/core';
import type { State, Dispatch } from './type';
import * as screens from './screens';
import * as actions from './actions';
import Login from './components/Login';
import TopNav from './components/TopNav';
import Tasks from './components/Tasks';
import EditTask from './components/EditTask';
import Work from './components/Work';
import Preview from './components/Preview';

const isDev = process.env.NODE_ENV === `development`;

const scrollCss = css`
  ::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 3px solid black;
    background-clip: content-box;
    background-color: #2e353d;
    border-color: #555;
  }

  ::-webkit-scrollbar-track {
    background-color: #555;
  }
`;

interface Props {
  loggedIn: boolean;
  screen: string;
  receiveAccessToken: Dispatch;
  hardReset: Dispatch;
}

class App extends React.Component<Props> {
  public override componentDidMount(): void {
    const { receiveAccessToken } = this.props;
    const query = new URLSearchParams(window.location.search);
    if (query.has(`access_token`)) {
      receiveAccessToken(query.get(`access_token`));
      // remove query param from url
      window.history.pushState({}, ``, `/`);
    }
  }

  protected renderScreen(): JSX.Element | null {
    const { screen } = this.props;

    switch (screen) {
      case screens.TASKS:
        return <Tasks />;
      case screens.EDIT_TASK:
        return <EditTask />;
      case screens.WORK:
        return <Work />;
      default:
        return null;
    }
  }

  public override render(): JSX.Element {
    const { loggedIn, hardReset } = this.props;
    if (!loggedIn) {
      return <Login />;
    }

    const query = new URLSearchParams(window.location.search);
    if (query.get(`preview`) && query.get(`task`) && query.get(`file`)) {
      const taskId = query.get(`task`) as string;
      const file = query.get(`file`) as string;
      return <Preview taskId={taskId} file={file} />;
    }

    return (
      <>
        <Global styles={scrollCss} />
        <TopNav />
        <div style={{ height: `calc(100vh - 50px)` }}>{this.renderScreen()}</div>
        {isDev && <KeyEvent handleKeys={[`meta+ctrl+1`]} onKeyEvent={hardReset} />}
      </>
    );
  }
}

const mapState = (state: State): Pick<Props, 'loggedIn' | 'screen'> => ({
  loggedIn: Boolean(state.github.token),
  screen: state.screen,
});

const mapDispatch = {
  receiveAccessToken: actions.receiveAccessToken,
  hardReset: actions.hardReset,
};

export default connect(mapState, mapDispatch)(App);
