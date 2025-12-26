import React from 'react';
import cx from 'classnames';

import Blue400 from '@/public/images/waves/blue-400.svg';
import Blue600 from '@/public/images/waves/blue-600.svg';
import Blue800 from '@/public/images/waves/blue-800.svg';
import Gold400 from '@/public/images/waves/gold-400.svg';
import Gold600 from '@/public/images/waves/gold-600.svg';
import Gold800 from '@/public/images/waves/gold-800.svg';
import Green400 from '@/public/images/waves/green-400.svg';
import Green600 from '@/public/images/waves/green-600.svg';
import Green800 from '@/public/images/waves/green-800.svg';
import Maroon400 from '@/public/images/waves/maroon-400.svg';
import Maroon600 from '@/public/images/waves/maroon-600.svg';
import Maroon800 from '@/public/images/waves/maroon-800.svg';

interface Props {
  color: `blue` | `maroon` | `green` | `gold`;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

const WaveBottomBlock: React.FC<Props> = ({ id, color, children, className }) => {
  const waves = {
    light: Blue400,
    medium: Blue600,
    dark: Blue800,
  };
  switch (color) {
    case `blue`:
      waves.light = Blue400;
      waves.medium = Blue600;
      waves.dark = Blue800;
      break;
    case `gold`:
      waves.light = Gold400;
      waves.medium = Gold600;
      waves.dark = Gold800;
      break;
    case `green`:
      waves.light = Green400;
      waves.medium = Green600;
      waves.dark = Green800;
      break;
    case `maroon`:
      waves.light = Maroon400;
      waves.medium = Maroon600;
      waves.dark = Maroon800;
      break;
  }
  return (
    <section
      id={id}
      className={cx(className)}
      style={{
        backgroundImage: `url(${waves.medium.src}), url(${waves.dark.src}), url(${waves.light.src})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `left 53% bottom -70px, left 45% bottom -44px, left 58% bottom -10px`,
        backgroundSize: `5900px 305px, 5000px 405px, 5000px 405px`,
      }}
    >
      {children}
    </section>
  );
};

export default WaveBottomBlock;
