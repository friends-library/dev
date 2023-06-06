import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import BackgroundImage from '@/components/core/BackgroundImage';
import Dual from '@/components/core/Dual';
import HeadphonesImage from '@/public/images/headphones.jpg';
import WaveformSVG from '@/public/images/waveform.svg';

interface Props {
  numBooks: number;
  className?: string;
}

const AudiobooksHero: React.FC<Props> = ({ className, numBooks }) => (
  <BackgroundImage
    className={cx(className, `text-center p-0`)}
    src={HeadphonesImage}
    fit="cover"
  >
    <div className="relative p-10">
      <h2 className="font-sans text-4xl tracking-wider text-white mb-6">{t`Audio Books`}</h2>
      <Dual.P className="body-text text-white text-lg">
        <>We currently have {numBooks} titles recorded as audiobooks.</>
        <>Actualmente tenemos {numBooks} títulos grabados como audiolibros.</>
      </Dual.P>
      <div
        className="h-48 absolute w-full left-0 -bottom-[164px]"
        style={{ backgroundImage: `url(${WaveformSVG.src})`, backgroundSize: `cover` }}
      ></div>
    </div>
  </BackgroundImage>
);

export default AudiobooksHero;
