import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import NextBgImage, { bgColor } from 'next-bg-image';
import Dual from '@/components/core/Dual';
import HeadphonesImage from '@/public/images/headphones.jpg';
import WaveformSVG from '@/public/images/waveform.svg';

interface Props {
  numBooks: number;
  className?: string;
  eager?: boolean;
}

const AudiobooksHero: React.FC<Props> = ({ className, numBooks, eager }) => (
  <NextBgImage
    className={cx(
      className,
      `text-center p-16 pb-48 md:pb-56 lg:pb-[18rem] overflow-hidden`,
    )}
    eager={eager}
    src={[HeadphonesImage, bgColor(`rgb(148,64,88)`)]}
    position="60% 60%"
    size={{ base: `1000px`, lg: `cover` }}
  >
    <h2 className="font-sans text-4xl tracking-wider text-white mb-6">{t`Audio Books`}</h2>
    <Dual.P className="body-text text-white text-lg">
      <>We currently have {numBooks} titles recorded as audiobooks.</>
      <>Actualmente tenemos {numBooks} títulos grabados como audiolibros.</>
    </Dual.P>
    <div
      className="h-48 absolute w-full left-0 bg-no-repeat bg-center bg-[55%_70%] bg-[1400px_auto] lg:bg-[55%_65%] lg:bg-[1800px_auto]"
      style={{ backgroundImage: `url(${WaveformSVG.src})` }}
    />
  </NextBgImage>
);

export default AudiobooksHero;
