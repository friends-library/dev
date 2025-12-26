import React from 'react';
import cx from 'classnames';

interface CommonProps {
  className?: string;
  tabIndex?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  small?: boolean;
  children: React.ReactNode;
}

type Props =
  | ({ type: `submit` } & CommonProps)
  | ({ type: `button`; onClick: () => unknown } & CommonProps)
  | ({ type: `link`; to: string } & CommonProps);

const Button: React.FC<Props> = ({
  className,
  tabIndex,
  fullWidth,
  disabled,
  children,
  secondary,
  small,
  ...props
}) => {
  const classes = cx(
    fullWidth ? `w-full flex` : `inline-flex`,
    fullWidth && small && `px-1.5`,
    !fullWidth && small && `px-5`,
    fullWidth && !small && `px-4`,
    !fullWidth && !small && `px-10`,
    !disabled && !secondary && `text-white bg-flblue-600 hover:bg-flblue-700`,
    !disabled && secondary && `bg-white text-gray-500 ring-1 ring-gray-300`,
    !disabled && secondary && `hover:text-gray-700 hover:bg-gray-50`,
    !disabled && `focus:ring-2 focus:ring-offset-2 focus:ring-flblue-500`,
    disabled && `text-white bg-gray-300 cursor-not-allowed`,
    small ? `py-2 text-xs` : `py-3 text-sm`,
    `justify-center text-md border border-transparent uppercase tracking-wider antialiased font-bold rounded-lg shadow-sm focus:outline-none`,
    className,
  );
  if (props.type !== `link`) {
    return (
      <button
        type={props.type}
        disabled={disabled}
        className={classes}
        {...(tabIndex ? { tabIndex } : {})}
        {...(props.type === `button` ? { onClick: props.onClick } : {})}
      >
        {children}
      </button>
    );
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href={disabled ? `#` : props.to}
      className={classes}
      {...(disabled ? { onClick: (e) => e.preventDefault() } : {})}
      {...(tabIndex ? { tabIndex } : {})}
    >
      {children}
    </a>
  );
};

export default Button;
