import React from 'react';
import cx from 'classnames';

interface Props {
  id?: string;
  word: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const BgWordBlock: React.FC<Props> = ({ word, id, className, children, title }) => (
  <div
    {...(id ? { id } : {})}
    className={cx(className, `text-center relative overflow-x-hidden font-sans`)}
    data-bgword={word}
  >
    {title && (
      <h2 className="text-flgray-900 text-3xl tracking-widest mb-8 z-1">{title}</h2>
    )}
    {children}
    <span className="z-0 font-bold opacity-30 [letter-spacing:0.04em] absolute top-0 pt-[3.5rem] translate-x-[-50%] left-[50%] text-[130px] text-[#eaeaea]">
      {word}
    </span>
  </div>
);

export default BgWordBlock;
