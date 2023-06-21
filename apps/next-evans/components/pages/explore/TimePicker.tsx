import React from 'react';
import cx from 'classnames';

interface Props {
  className?: string;
  setSelected: (selected: number) => any;
  selected: number;
}

const dates = [1650, 1675, 1700, 1725, 1750, 1775, 1800, 1825, 1850];

const TimePicker: React.FC<Props> = ({ className, selected, setSelected }) => (
  <div
    className={cx(
      className,
      `TimePicker flex justify-center max-w-[1000px]`,
      `text-white font-sans text-base antialiased`,
      `border-t-4 border-white`,
    )}
  >
    {dates.map((date, idx) => (
      <div
        key={date}
        onClick={() => setSelected(date)}
        className={cx(
          `relative cursor-pointer pt-6 pb-1 px-2 sm:block`,
          `first-of-type:translate-x-[-50%] last-of-type:translate-x-[50%]`,
          `after:absolute after:top-[-0.5rem] after:left-[50%] after:translate-x-[-50%] after:h-[0.85rem] after:w-[0.85rem] after:rounded-full`,
          `text-center hover:font-bold select-none`,
          idx % 2 && `hidden`,
          idx > 0 && idx < dates.length - 1 && `mx-2 sm:mx-auto md:mx-2 lg:mx-6 lg:w-12`,
          selected === date
            ? `after:bg-flgold after:border-2 after:border-white after:[transform:translateX(-50%)_scale(1.21)] border-b-4 border-flgold`
            : `hover:after:border-2 hover:after:border-flgold hover:after:[transform:translateX(-50%)_scale(1.21)] after:bg-white`,
          idx === 0 && `mr-auto`,
          idx === dates.length - 1 && `ml-auto`,
        )}
      >
        {date}
      </div>
    ))}
  </div>
);

export default TimePicker;
