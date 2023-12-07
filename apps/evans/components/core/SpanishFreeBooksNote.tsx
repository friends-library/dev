import React, { useContext } from 'react';
import cx from 'classnames';
import { LANG } from '@/lib/env';
import { AppDispatch } from '@/lib/app-state';

const SpanishFreeBooksNote: React.FC<{ className?: string; bookTitle?: string }> = ({
  className,
  bookTitle = ``,
}) => {
  const dispatch = useContext(AppDispatch);
  if (LANG === `en`) return null;
  return (
    <p className={cx(className, `text-center italic`)}>
      Si deseas un ejemplar impreso pero, por razones económicas o de otro tipo, no puedes
      hacer un pedido en línea,{` `}
      <button
        onClick={() => dispatch({ type: `show--modal:request-free`, book: bookTitle })}
        className="italic subtle-link hover:border-solid"
      >
        haz clic aquí
      </button>
      {` `}
      para solicitarlo gratuitamente.
    </p>
  );
};

export default SpanishFreeBooksNote;
