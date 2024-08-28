import React from 'react';
import cx from 'classnames';
import PopUnder from '@/components/core/PopUnder';

interface Props {
  top?: number;
  left?: number;
  children: React.ReactNode;
}

const ChoiceWizard: React.FC<Props> = ({ top, left, children }) => (
  <PopUnder
    className={cx(
      `ChoiceWizard z-50 top-0 left-0 w-[22rem] max-w-[100vw] !absolute translate-x-[-50%]`,
    )}
    style={{
      top: top || 0,
      left: left || 0,
    }}
    bgColor="flblue"
  >
    {children}
  </PopUnder>
);

export default ChoiceWizard;
