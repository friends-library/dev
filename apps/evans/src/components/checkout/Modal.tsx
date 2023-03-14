import React from 'react';
import { t } from '@friends-library/locale';

interface Props {
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ children, onClose }) => (
  <div className="px-8 py-10 sm:px-12 sm:py-12 sm:pb-16">
    <div className="lg:max-w-4xl lg:mx-auto">
      <CloseButton onClick={onClose} />
      {children}
    </div>
  </div>
);

export default Modal;

export const CloseButton: React.FC<{ onClick: () => unknown }> = ({ onClick }) => {
  return (
    <button
      className="absolute top-0 right-0 px-4 -mt-3 -mr-0.5 py-2 subtle-focus"
      onClick={onClick}
    >
      <span className="sr-only">{t`Close`}</span>
      <span aria-hidden className="text-flprimary text-4xl">
        &times;
      </span>
    </button>
  );
};
