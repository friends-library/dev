import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  title: string;
  color: `blue` | `maroon` | `gold` | `green`;
  slug: string;
  children: React.ReactNode;
}

const PathIntro: React.FC<Props> = ({ color, title, children, slug }) => (
  <a
    href={`#${slug}`}
    className={cx(
      `cursor-pointer bg-fl${color}`,
      `p-8 pb-4 md:w-1/2 lg:w-1/4 flex flex-col justify-start`,
    )}
  >
    <h3 className="font-sans text-white text-center text-3xl tracking-wide mb-8">
      {title}
    </h3>
    <p className="body-text text-white text-md mb-8">{children}</p>
    <div className="flex flex-col items-center mb-10 text-xl mt-auto">
      <button className="text-white uppercase font-sans tracking-wider text-base">
        {t`Learn More`}
      </button>
      <ChevronDownIcon className="text-white antialiased pt-2 h-8" />
    </div>
  </a>
);

export default PathIntro;
