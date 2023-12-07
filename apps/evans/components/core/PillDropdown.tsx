import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  pillText: string;
  className?: string;
  autoHide?: boolean;
  children: React.ReactNode;
}

const PillDropdown: React.FC<Props> = ({
  className,
  pillText,
  children,
  autoHide = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const click: (event: any) => unknown = (event) => {
      if (
        ref.current &&
        (!ref.current.contains(event.target) || (autoHide && dropdownVisible))
      ) {
        setDropdownVisible(false);
      }
    };
    const escape: (e: KeyboardEvent) => unknown = ({ keyCode }) => {
      keyCode === 27 && setDropdownVisible(false);
    };
    document.addEventListener(`click`, click);
    document.addEventListener(`keydown`, escape);
    return () => {
      document.removeEventListener(`click`, click);
      window.removeEventListener(`keydown`, escape);
    };
  }, [dropdownVisible, autoHide]);

  return (
    <div
      ref={ref}
      className={cx(
        className,
        `rounded-full w-64 bg-white hover:bg-gray-50 transition duration-100 relative h-12 cursor-pointer`,
      )}
      onClick={() => setDropdownVisible(!dropdownVisible)}
    >
      <div
        className={cx(
          `border border-flgray-400 rounded-full subtle-focus`,
          `h-12 w-64 pt-3 text-center select-none`,
          `text-flgray-500 antialiased font-sans tracking-widest`,
        )}
      >
        {pillText}
      </div>
      <div className="h-12 w-12 absolute top-0 right-0 flex justify-center items-center">
        <ChevronDownIcon
          className={cx(
            `h-6 text-flgray-400 transition duration-150`,
            dropdownVisible && `-rotate-180`,
          )}
        />
      </div>
      {dropdownVisible && children}
    </div>
  );
};

export default PillDropdown;
