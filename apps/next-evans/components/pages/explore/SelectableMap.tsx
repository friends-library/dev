import React from 'react';
import cx from 'classnames';
import Image from 'next/image';
import type { Region } from '@/lib/types';
import LocationMarker from '../friend/LocationMarker';
import map from '@/public/images/full_map.png';

interface Props {
  selectedRegion: string;
  selectRegion(region: Region): unknown;
  className?: string;
  style?: Record<string, number | string>;
}

const SelectableMap: React.FC<Props> = ({
  selectedRegion,
  selectRegion,
  className,
  style = {},
}) => {
  const selectedStyles = `[&_path]:text-flmaroon [&_path]:opacity-100`;
  const unselectedStyles = `[&_path]:opacity-[0.65] [&_path]:text-flblue-600 [&:hover_path]:text-flmaroon [&:hover_path]:opacity-100`;
  return (
    // NOTE: not translated because this block is currently not rendered on Spanish site
    <div
      className={cx(
        className,
        `SelectableMap`,
        `[&_label]:cursor-pointer [&_label]:text-flblue-800 [&_svg_path]:cursor-pointer [&_svg]:cursor-pointer z-10`,
      )}
      style={style}
    >
      <LocationMarker
        className={cx(
          selectedRegion === `Eastern US` ? selectedStyles : unselectedStyles,
        )}
        onClick={selectRegion}
        label="Eastern US"
        top={64.0}
        left={17.5}
      />
      <LocationMarker
        className={cx(
          selectedRegion === `Western US` ? selectedStyles : unselectedStyles,
        )}
        onClick={selectRegion}
        label="Western US"
        top={62}
        left={11}
      />
      <LocationMarker
        className={cx(selectedRegion === `England` ? selectedStyles : unselectedStyles)}
        onClick={selectRegion}
        label="England"
        top={33}
        left={82.5}
      />
      <LocationMarker
        className={cx(selectedRegion === `Ireland` ? selectedStyles : unselectedStyles)}
        onClick={selectRegion}
        label="Ireland"
        top={29.8}
        left={76.1}
      />
      <LocationMarker
        className={cx(selectedRegion === `Scotland` ? selectedStyles : unselectedStyles)}
        onClick={selectRegion}
        label="Scotland"
        top={20}
        left={79.5}
      />
      <Image
        src={map.src}
        alt="Map."
        className="w-[1200px] max-w-none md:w-[100%]"
        height={1200}
        width={1200}
      />
    </div>
  );
};
export default SelectableMap;
