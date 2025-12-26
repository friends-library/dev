import React from 'react';
import cx from 'classnames';

interface Props {
  bgColor: `flblue` | `flprimary`;
  className?: string;
  style?: Record<string, string | number>;
  alignRight?: boolean;
  children: React.ReactNode;
}

const PopUnder: React.FC<Props> = ({
  className,
  children,
  alignRight,
  style,
  bgColor,
}) => (
  <div
    {...(style ? { style } : {})}
    className={cx(
      // bg-blue bg-flprimary text-blue text-flprimary
      // after:bg-flblue after:bg-flprimary
      className,
      `bg-${bgColor}`,
      `text-${bgColor}`,
      `rounded-lg shadow-direct relative flex flex-col`,
      alignRight
        ? `after:right-[19px] sm:after:right-[23px]`
        : `after:left-[calc(50%-10px)]`,
      `after:w-6 after:h-6 after:bg-${bgColor} after:absolute after:-top-2 after:rotate-45 z-10`,
    )}
  >
    {children}
  </div>
);

export default PopUnder;
