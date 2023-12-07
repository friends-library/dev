import React from 'react';
import cx from 'classnames';

interface Props {
  onClick(): unknown;
  className?: string;
}

const CartBadge: React.FC<Props> = ({ onClick, className }) => (
  <div
    className={cx(
      `w-10 h-10 rounded-full border-flprimary border-solid border flex flex-row items-center justify-center relative cursor-pointer`,
      `after:absolute after:rounded-full after:top-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-[rgb(200,52,98)]`,
      `before:absolute before:rounded-full before:top-[-1px] before:right-[-1px] before:w-[14px] before:h-[14px] before:bg-[rgb(200,52,98)] before:opacity-50`,
      className,
    )}
    onClick={onClick}
  >
    <Icon />
  </div>
);

export default CartBadge;

const Icon: React.FC = () => (
  <svg
    height="22px"
    width="22px"
    className="text-flprimary fill-current"
    viewBox="0 0 100 100"
  >
    <path d="M81,91H19a3,3,0,0,1-3-3.21l4-56A3,3,0,0,1,23,29H77a3,3,0,0,1,3,2.79l4,56A3,3,0,0,1,81,91ZM22.22,85H77.78L74.21,35H25.79Z"></path>
    <path d="M64,26a3,3,0,0,1-3-3,11,11,0,0,0-22,0,3,3,0,0,1-6,0,17,17,0,0,1,34,0A3,3,0,0,1,64,26Z"></path>
    <path d="M36,50a3,3,0,0,1-3-3V23a3,3,0,0,1,6,0V47A3,3,0,0,1,36,50Z"></path>
    <path d="M64,50a3,3,0,0,1-3-3V23a3,3,0,0,1,6,0V47A3,3,0,0,1,64,50Z"></path>
  </svg>
);
