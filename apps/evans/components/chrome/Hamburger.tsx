import React from 'react';
import cx from 'classnames';

interface Props {
  onClick: () => any;
  className?: string;
}

const Component: React.FC<Props> = ({ onClick, className }) => (
  <div
    className={cx(
      className,
      `w-[70px] h-[70px] pl-[18px] flex flex-col justify-center bg-flprimary hover:bg-flprimary-800 transition-colors duration-150 cursor-pointer`,
    )}
    onClick={onClick}
  >
    <div className="h-0.5 w-[27px] mb-[5px] bg-white" />
    <div className="h-0.5 w-8 mb-[5px] bg-white" />
    <div className="h-0.5 w-[18px] mb-[5px] bg-white" />
  </div>
);

export default Component;
