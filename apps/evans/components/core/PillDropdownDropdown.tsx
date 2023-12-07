import React from 'react';
import { Accordion } from '@reach/accordion';
import cx from 'classnames';

interface Props {
  className?: string;
  accordion?: boolean;
  children: React.ReactNode;
}

const PillDropdownDropdown: React.FC<Props> = ({ className, accordion, children }) => {
  const Element = accordion ? Accordion : `div`;
  return (
    <Element
      className={cx(
        className,
        `relative rounded-lg bg-flgray-100 shadow-direct`,
        `after:absolute after:top-0 after:left-[50%] after:w-0 after:h-0 after:[border:10px_solid_transparent] after:[border-bottom-color:flgray-100] after:border-t-0 after:ml-[-10px] after:mt-[-10px]`,
        `mt-3 w-64 py-4 z-10`,
        `text-flgray-100 antialiased`,
      )}
    >
      {children}
    </Element>
  );
};

export default PillDropdownDropdown;
