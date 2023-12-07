import React from 'react';
import cx from 'classnames';
import { ThreeD } from '@friends-library/cover-component';
import { toCoverProps, type CoverData } from '@/lib/cover';
import Rotate from '@/components/custom-icons/Rotate';

type Perspective = 'back' | 'front' | 'spine' | 'angle-front' | 'angle-back';

interface Props {
  coverData: CoverData;
  className?: string;
}

interface State {
  perspective: Perspective;
  shouldRotate: boolean;
  controlled: boolean;
  showBackTimeout?: number;
  backToFrontTimeout?: number;
}

export default class RotatableCover extends React.Component<Props, State> {
  public override state: State = {
    perspective: `angle-front`,
    controlled: false,
    shouldRotate: false,
  };

  public override componentDidMount(): void {
    if (window.CSS && window.CSS.supports(`writing-mode`, `vertical-lr`)) {
      this.setState({ shouldRotate: true });
    } else {
      return;
    }

    const showBackTimeout = window.setTimeout(
      () => this.setState({ perspective: `angle-back` }),
      10000,
    );
    this.setState({ showBackTimeout });
    const backToFrontTimeout = window.setTimeout(
      () => this.setState({ perspective: `angle-front` }),
      14000,
    );
    this.setState({ backToFrontTimeout });
  }

  public override componentWillUnmount(): void {
    const { showBackTimeout, backToFrontTimeout } = this.state;
    [showBackTimeout, backToFrontTimeout].forEach(clearTimeout);
  }

  public override render(): JSX.Element {
    const { className, coverData } = this.props;
    const { perspective, shouldRotate, showBackTimeout, backToFrontTimeout } = this.state;
    return (
      <div className={cx(className, `flex flex-col items-center`)}>
        <div className="hidden xl:block">
          <ThreeD
            {...toCoverProps(coverData)}
            perspective={perspective}
            scaler={4 / 5}
            scope="4-5"
          />
        </div>
        <div className="xl:hidden">
          <ThreeD
            {...toCoverProps(coverData)}
            perspective={perspective}
            scaler={3 / 5}
            scope="3-5"
          />
        </div>
        <button
          className={cx(
            `transition-transform duration-100 active:scale-95 focus:outline-none pt-1`,
            !shouldRotate && `hidden`,
          )}
          onClick={() => {
            [showBackTimeout, backToFrontTimeout].forEach(clearTimeout);
            this.setState({
              perspective: nextPerspective(perspective),
              controlled: true,
              showBackTimeout: undefined,
              backToFrontTimeout: undefined,
            });
          }}
        >
          <Rotate />
        </button>
      </div>
    );
  }
}

function nextPerspective(perspective: Perspective): Perspective {
  switch (perspective) {
    case `angle-front`:
      return `spine`;
    case `spine`:
      return `angle-back`;
    case `angle-back`:
      return `back`;
    case `back`:
      return `front`;
    default:
      return `angle-front`;
  }
}
