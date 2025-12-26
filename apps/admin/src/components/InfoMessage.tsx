import React from 'react';
import cx from 'classnames';

interface Props {
  type: `error` | `success`;
  className?: string;
  children: React.ReactNode;
}

const InfoMessage: React.FC<Props> = ({ type, className, children }) => (
  <p
    className={cx(
      type === `error` && `bg-red-200 text-red-900`,
      type === `success` && `bg-green-200 text-green-900`,
      ` text-center antialiased text-sm p-2 rounded-md`,
      className,
    )}
  >
    {children}
  </p>
);

export default InfoMessage;
