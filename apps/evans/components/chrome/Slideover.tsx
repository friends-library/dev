import React from 'react';
import cx from 'classnames';
import SlideoverMenu from './SlideoverMenu';

interface Props {
  close(): unknown;
  isOpen: boolean;
}

const Slideover: React.FC<Props> = ({ close, isOpen }) => (
  <div
    className={cx(
      `fixed top-0 overflow-hidden overflow-y-auto h-full transition-transform duration-200 z-50 w-[375px] md:w-[450px] shadow-xl`,
      isOpen ? `translate-x-0` : `-translate-x-full`,
    )}
  >
    <SlideoverMenu onClose={close} />
  </div>
);

export default Slideover;
