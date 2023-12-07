import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import { BookOpenIcon, CalendarIcon, FlagIcon } from '@heroicons/react/24/outline';
import type { HeroIcon } from '@/lib/types';
import CircleSilhouette from './CircleSilhouette';
import Dual from '@/components/core/Dual';
import Button from '@/components/core/Button';

interface Props {
  className?: string;
  gender: 'male' | 'female';
  name: string;
  born?: number;
  died?: number;
  region: string;
  numBooks: number;
  url: string;
  featured?: boolean;
  color: 'blue' | 'green' | 'maroon' | 'gold';
}

const FriendCard: React.FC<Props> = ({
  className,
  gender,
  born,
  died,
  numBooks,
  region,
  color,
  name,
  url,
  featured = false,
}) => {
  let hrStyles = ``;
  let bgColor = ``;
  let textColor = ``;
  switch (color) {
    case `blue`:
      hrStyles = `${
        featured ? `after:bg-white` : `after:bg-flblue`
      } after:w-16 after:mx-auto`;
      bgColor = `bg-flblue`;
      textColor = featured ? `text-white` : `text-flblue`;
      break;
    case `green`:
      hrStyles = `${
        featured ? `after:bg-white` : `after:bg-flgreen`
      } after:w-16 after:mx-auto`;
      bgColor = `bg-flgreen`;
      textColor = featured ? `text-white` : `text-flgreen`;
      break;
    case `maroon`:
      hrStyles = `${
        featured ? `after:bg-white` : `after:bg-flmaroon`
      } after:w-16 after:mx-auto`;
      bgColor = `bg-flmaroon`;
      textColor = featured ? `text-white` : `text-flmaroon`;
      break;
    case `gold`:
      hrStyles = `${
        featured ? `after:bg-white` : `after:bg-flgold`
      } after:w-16 after:mx-auto`;
      bgColor = `bg-flgold`;
      textColor = featured ? `text-white` : `text-flgold`;
      break;
  }

  return (
    <div
      className={cx(
        className,
        textColor,
        `flex flex-col items-center [&>*]:translate-y-[31px]`,
        featured
          ? `md:flex-row md:justify-center md:pt-12 md:pb-6 md:[&>*]:transform-none ${bgColor} space-y-8 md:space-y-0`
          : `min-w-[100%] [&>*]:translate-y-[36px] sm:min-w-[330px] [background-image:linear-gradient(to_bottom,transparent_0,transparent_140px,white_140px,white_100%)] space-y-8`,
      )}
    >
      <div
        key="img"
        className={cx(featured && `md:order-2 md:flex`, `flex-col items-center`)}
      >
        <CircleSilhouette gender={gender} fgColor="white" bgColor={color} />
        <Button
          to={url}
          width={220}
          className={cx(`box-content hidden md:mt-6`, {
            'border-2 border-white md:block': featured,
          })}
          bg={color}
        >
          {t`Learn More`}
        </Button>
      </div>
      <div
        key="meta"
        className={cx(
          featured && `md:mr-16 md:self-stretch md:flex md:flex-col md:justify-center`,
        )}
      >
        <h3
          className={cx(
            `sans-wide text-2xl text-center mb-6 after:block after:h-[3px] ${hrStyles} after:mt-[15px] ml-auto mr-auto`,
            featured && `md:mb-10`,
          )}
        >
          {name}
        </h3>
        <ul className={cx(`body-text pb-2 space-y-4`, textColor)}>
          <Item key="cal" Icon={CalendarIcon}>
            {lifespan(born, died)}
          </Item>
          <Item key="flag" Icon={FlagIcon}>
            {region}
          </Item>
          <Item key="logo" Icon={BookOpenIcon}>
            <Dual.Frag>
              <>
                {numBooks} book{numBooks > 1 ? `s` : ``} available
              </>
              <>
                {numBooks} libro{numBooks > 1 ? `s` : ``} disponible
                {numBooks > 1 ? `s` : ``}
              </>
            </Dual.Frag>
          </Item>
        </ul>
      </div>
      <Button
        key="button"
        to={url}
        width={220}
        className={cx(`box-content`, {
          'border-4 border-white md:hidden': featured,
        })}
        bg={color}
      >
        {t`Learn More`}
      </Button>
    </div>
  );
};

export default FriendCard;

const Item: React.FC<{
  children: React.ReactNode;
  Icon: HeroIcon;
  className?: string;
}> = ({ Icon, children, className }) => (
  <li className={cx(className, `flex items-center`)}>
    <Icon className="mr-4" height={22} /> {children}
  </li>
);

function lifespan(born?: number, died?: number): string {
  if (!born && !died) return `Unknown`;
  if (!born) return `d. ${died}`;
  if (!died) return `b. ${died}`;
  return [born, died].join(` — `);
}
