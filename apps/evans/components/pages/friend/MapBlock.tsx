import React from 'react';
import { t } from '@friends-library/locale';
import Image from 'next/image';
import FriendMeta from './FriendMeta';
import LocationMarker from './LocationMarker';
import BackgroundImage from '@/components/core/BackgroundImage';
import { LANG } from '@/lib/env';
import Uk from '@/public/images/maps/UK--2x.png';
import Us from '@/public/images/maps/US.png';
import Europe from '@/public/images/maps/Europe--2x.png';
import BgImage from '@/public/images/books-diagonal.jpg';

interface Props {
  friendName: string;
  residences: string[];
  map: 'UK' | 'US' | 'Europe';
  markers: {
    label: string;
    top: number;
    left: number;
  }[];
}

const MapBlock: React.FC<Props> = ({ friendName, markers, residences, map }) => (
  <BackgroundImage
    src={BgImage}
    className="relative bg-cover pb-20 md:pb-32 xl:pb-64 xl:[&>.Content>*]:w-[85vw] xl:[&>.Content>*]:max-w-[1400px] xl:pt-12 "
    fit={`cover`}
    position={`center`}
  >
    <div className="relative items-start justify-center xl:flex xl:bg-flgray-100 xl:mx-auto xl:py-10 xl:pt-16 md:pt-8">
      <FriendMeta
        className="mx-6 z-10 max-w-xs xl:py-24 translate-y-5 min-h-[15rem] md:translate-y-8 xl:w-[72rem] xl:translate-y-[-125px]"
        title={t`Where did ${friendName} live?`}
        color="maroon"
      >
        {residences.map((residence) => (
          <li key={residence}>{residence}</li>
        ))}
      </FriendMeta>
      <div className="bg-white py-6 md:py-12 md:px-8 lg:px-32 xl:bg-flgray-100 xl:p-0 [&>.ann-crowley>label:nth-of-type(1)]:pr-[11em] [&>.ann-crowley>label:nth-of-type(2)]:pl-[9em] [&>.william-penn>label:nth-of-type(1)]:pl-[9em] [&>.william-penn>label:nth-of-type(2)]:pr-[10em] [&>.john-g-sargent>label:nth-of-type(1)]:hidden [&>.john-g-sargent>svg:nth-of-type(1)]:hidden">
        <div
          className={`relative ${friendName.toLowerCase().replace(/(?: |\.)+/g, `-`)}`}
        >
          {markers
            .filter((m) => m.top > 0)
            .map((m) => (
              <LocationMarker key={m.label} top={m.top} left={m.left} label={m.label} />
            ))}
          {map === `UK` && (
            <Image
              src={Uk}
              alt={LANG === `en` ? `Map of U.K.` : `Mapa de Reino Unido.`}
              className="xl:max-w-[700px]"
            />
          )}
          {map === `US` && (
            <Image
              src={Us}
              alt={LANG === `en` ? `Map of U.S.` : `Mapa, de, estados unidos de américa.`}
              className="xl:max-w-[700px]"
            />
          )}
          {map === `Europe` && (
            <Image
              src={Europe}
              alt={LANG === `en` ? `Map of Europe.` : `Mapa de europa.`}
              className="xl:max-w-[700px]"
            />
          )}
        </div>
      </div>
    </div>
  </BackgroundImage>
);

export default MapBlock;
