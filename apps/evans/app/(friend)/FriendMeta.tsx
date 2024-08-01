import React from 'react';
import cx from 'classnames';

interface Props {
  title: string;
  color: 'green' | 'blue' | 'maroon' | 'gold';
  className?: string;
  children: React.ReactNode;
}

const FriendMeta: React.FC<Props> = ({ children, title, color, className }) => (
  <aside
    className={cx(className, `text-white px-6 py-12`, {
      'bg-flgreen': color === `green`,
      'bg-flblue': color === `blue`,
      'bg-flmaroon': color === `maroon`,
      'bg-flgold': color === `gold`,
    })}
  >
    <h4 className="text-center font-sans uppercase tracking-wider mb-8">{title}</h4>
    <ul className="body-text text-white ml-6 leading-snug [&>li]:before:text-white [&>li]:before:content-['◆'] [&>li]:before:ml-[-1.4rem] [&>li]:before:pr-[0.65rem] [&>li]:before:text-[0.9em] [&>li]:before:inline-block [&>li]:before:-translate-y-0.5 [&>li]:pl-[0.45em] [&>li]:mb-[0.45em]">
      {children}
    </ul>
  </aside>
);

export default FriendMeta;
