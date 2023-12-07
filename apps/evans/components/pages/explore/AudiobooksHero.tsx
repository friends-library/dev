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
    className={cx(className, `text-center p-16 pb-48 md:pb-56`)}
    src={HeadphonesImage}
    fit="cover"
  >
    <h2 className="font-sans text-4xl tracking-wider text-white mb-6">{t`Audio Books`}</h2>
    <Dual.P className="body-text text-white text-lg">
      <>We currently have {numBooks} titles recorded as audiobooks.</>
      <>Actualmente tenemos {numBooks} títulos grabados como audiolibros.</>
    </Dual.P>
    <div
      className="h-48 absolute w-screen -mx-16 left-0 -bottom-[164px] bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${WaveformSVG.src})`, backgroundSize: `1500px` }}
    />
  </BackgroundImage>
);

export default AudiobooksHero;
