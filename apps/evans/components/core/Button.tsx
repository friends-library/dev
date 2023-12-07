import React from 'react';
import cx from 'classnames';
import Link from 'next/link';

interface Props {
  className?: string;
  to?: string;
  onClick?(): unknown;
  disabled?: boolean;
  shadow?: boolean;
  width?: number | string;
  textColor?: string;
  style?: Record<string, string | number>;
  bg?: 'gold' | 'blue' | 'green' | 'maroon' | 'primary' | null;
  children?: React.ReactNode;
}

const Button: React.FC<Props> = ({
  className,
  to,
  onClick,
  disabled,
  children,
  shadow,
  bg,
  textColor = `white`,
  style = {},
  width = 280,
}) => {
  const props = {
    style: { ...style, width },
    className: cx(
      `rounded-full font-sans text-center uppercase tracking-wider h-[60px] [line-height:60px] transition-colors duration-200 ease-out block focus:outline-none focus:ring`,
      className,
      `text-${textColor}`,
      {
        [`bg-fl${bg || `primary`}`]: bg !== null,
        [`hover:bg-fl${bg || `primary`}-800`]: bg !== null,
        'shadow-btn': shadow,
        'opacity-25': disabled,
        'cursor-pointer': !disabled,
        'cursor-not-allowed': disabled,
      },
    ),
    ...(onClick && !disabled ? { onClick } : {}),
  };

  if (typeof to === `string`) {
    return (
      <Link href={to} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button {...props} {...(disabled ? { disabled } : {})}>
      {children}
    </button>
  );
};

export default Button;
