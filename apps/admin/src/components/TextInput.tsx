import React, { useState } from 'react';
import cx from 'classnames';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface Props {
  type: `text` | `email` | `textarea` | `number`;
  label: string;
  value: string | null;
  onChange: (newValue: string) => unknown;
  isValid?: (input: string) => boolean;
  invalidMessage?: string;
  className?: string;
  autoFocus?: boolean;
  optional?: boolean;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  textareaSize?: string;
}

const TextInput: React.FC<Props> = ({
  type,
  label,
  value,
  onChange,
  isValid = () => true,
  invalidMessage = `Invalid input.`,
  className,
  autoFocus,
  optional,
  prefix,
  suffix,
  placeholder,
  disabled,
  textareaSize = `h-48`,
}) => {
  const [valid, setValid] = useState(true);
  const inputClasses = cx(
    type === `number` ? `` : `pr-10`,
    !valid &&
      `border-red-400 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`,
    `block w-full focus:outline-none sm:text-sm`,
    `placeholder-gray-300 antialiased border-gray-300`,
    prefix && `rounded-tr-md rounded-br-md`,
    suffix && `rounded-tl-md rounded-bl-md`,
    !prefix && !suffix && `rounded-md`,
    disabled
      ? `bg-gray-200 text-gray-500/80 cursor-not-allowed pointer-events-none`
      : `text-gray-600`,
  );
  return (
    <div className={className}>
      <div className="flex justify-between">
        <label className="label">{label}</label>
        {optional && (
          <span className="italic opacity-70 text-sm text-gray-400 antialiased">
            *optional
          </span>
        )}
      </div>
      <div className={cx(`mt-1 flex relative rounded-md shadow-sm`)}>
        {prefix && (
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            {prefix}
          </span>
        )}
        {type !== `textarea` ? (
          <input
            type={type}
            className={inputClasses}
            value={value ?? ``}
            placeholder={placeholder}
            autoFocus={Boolean(autoFocus)}
            onFocus={() => setValid(true)}
            onBlur={() => setValid(isValid(value ?? ``))}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        ) : (
          <textarea
            autoFocus={Boolean(autoFocus)}
            onFocus={() => setValid(true)}
            onBlur={() => setValid(isValid(value ?? ``))}
            onChange={(e) => onChange(e.target.value)}
            value={value ?? ``}
            className={cx(inputClasses, textareaSize)}
            placeholder={placeholder}
          />
        )}
        {suffix && (
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            {suffix}
          </span>
        )}
        {!valid && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {!valid && <p className="mt-1 text-sm text-red-600">* {invalidMessage}</p>}
    </div>
  );
};

export default TextInput;
