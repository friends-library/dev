import React from 'react';
import cx from 'classnames';

type Screen = `sm` | `md` | `lg` | `xl`;

const Heading: React.FC<{
  className?: string;
  darkBg?: boolean;
  left?: true | Screen[];
  children?: React.ReactNode;
}> = ({ children, className, darkBg, left }) => (
  <h1
    className={cx(
      className,
      `mb-[2.5rem] font-sans uppercase text-center text-2xl mb-5 sm:text-3xl tracking-wider font-black`,
      `after:block after:mt-[1rem] after:w-[200px] after:ml-auto after:mr-auto after:h-[2px]`,
      `sm:mb-[3rem] sm:after:mt-[2rem]`,
      {
        'after:bg-white': darkBg,
        'after:bg-gray-900': !darkBg,
        'ml-0': left === true,
        'sm:after:ml-0': Array.isArray(left) && left.includes(`sm`),
        'md:after:ml-0': Array.isArray(left) && left.includes(`md`),
        'lg:after:ml-0': Array.isArray(left) && left.includes(`lg`),
        'xl:after:ml-0': Array.isArray(left) && left.includes(`xl`),
      },
    )}
  >
    {children}
  </h1>
);

export default Heading;
