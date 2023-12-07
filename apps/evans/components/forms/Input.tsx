import React from 'react';
import cx from 'classnames';

interface Props {
  valid: boolean;
  placeholder: string;
  invalidMsg: string;
  wrapClassName?: string;
  inputClassName?: string;
  value?: string;
  onChange(newVal: string): unknown;
  onBlur?(): unknown;
  onFocus?(): unknown;
  autofocus?: boolean;
  type?: string;
  autoComplete?: string;
  name?: string;
}

const Input: React.FC<Props> = ({
  valid,
  autofocus,
  placeholder,
  invalidMsg,
  value,
  onChange,
  onBlur,
  onFocus,
  inputClassName,
  autoComplete,
  name,
  wrapClassName,
  type = `text`,
}) => (
  <div className={cx(`relative`, wrapClassName)}>
    <input
      name={name}
      autoComplete={autoComplete}
      autoFocus={autofocus}
      className={cx(inputClassName, `CartInput`, { invalid: !valid })}
      type={type}
      placeholder={valid ? placeholder : invalidMsg}
      value={value || ``}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur || (() => {})}
      onFocus={onFocus || (() => {})}
    />
    {!valid && value && <InvalidOverlay>{invalidMsg}</InvalidOverlay>}
  </div>
);

export default Input;

export const InvalidOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="absolute text-red-600 top-0 right-0 text-xs p-1 font-normal leading-tight">
    {children}
  </span>
);
