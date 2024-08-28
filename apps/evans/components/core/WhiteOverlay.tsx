import React from 'react';
import cx from 'classnames';

const WhiteOverlay: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cx(
      `bg-white text-center py-12 md:py-16 lg:py-20 px-10 sm:px-16 my-6 max-w-screen-md mx-auto`,
      className,
    )}
  >
    {children}
  </div>
);

export default WhiteOverlay;
