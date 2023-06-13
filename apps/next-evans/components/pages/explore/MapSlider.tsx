import React, { useState } from 'react';
import cx from 'classnames';
import useInterval from 'use-interval';
import { Swipeable } from 'react-swipeable';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Region } from '@/lib/types';
import SelectableMap from './SelectableMap';
import { useWindowWidth } from '@/lib/hooks/window-width';
import { SCREEN_MD } from '@/lib/constants';
// import './MapSlider.css';

interface Props {
  className?: string;
  region: Region;
  setRegion: (region: Region) => any;
}

const MapSlider: React.FC<Props> = ({ className, region, setRegion }) => {
  const winWidth = useWindowWidth();
  const [focus, setFocus] = useState<'UK' | 'US'>(`UK`);
  const [controlled, setControlled] = useState<boolean>(false);
  const toggleFocus: () => any = () => setFocus(focus === `UK` ? `US` : `UK`);

  useInterval(() => {
    if (winWidth < SCREEN_MD && !controlled) {
      toggleFocus();
    }
  }, 12000);

  return (
    // @ts-ignore
    <Swipeable
      onSwiped={({ dir }) => {
        if ([`Right`, `Left`].includes(dir) && winWidth < SCREEN_MD) {
          setControlled(true);
          setFocus(dir === `Right` ? `US` : `UK`);
        }
      }}
      className={cx(
        className,
        `MapSlider relative overflow-hidden h-[40vh]`,
        `md:h-auto`,
        focus === `UK` && ``,
        focus === `US` && ``,
        winWidth < 0 && `blur`,
      )}
    >
      <SelectableMap
        style={position(focus, winWidth)}
        className={cx(
          `transition-all duration-700 ease-in-out md:transition-none md:-mt-8 absolute`,
          focus === `UK` && `top-[-50px] md:top-0 md:left-0 md:relative`,
          focus === `US` && `top-[-266px] md:top-0 md:left-0 md:relative`,
        )}
        selectedRegion={region}
        selectRegion={setRegion}
      />
      <ChevronRightIcon
        className={cx(
          `absolute text-white px-4 opacity-50 cursor-pointer md:hidden z-20`,
          `transform -translate-y-1/2 h-16 top-[50%] text-[4rem] text-white`,
          {
            'rotate-180 left-0': focus === `UK`,
            'right-0': focus === `US`,
          },
        )}
        onClick={toggleFocus}
      />
    </Swipeable>
  );
};

export default MapSlider;

function position(area: 'US' | 'UK', winWidth: number): Record<string, number | string> {
  if (winWidth >= SCREEN_MD) {
    return {};
  }
  if (area === `US`) {
    return DIMS.US;
  }
  return {
    left: (DIMS.imgWidth - winWidth + DIMS.UK.right) * -1,
  };
}

const DIMS = {
  imgWidth: 1200, // keep in sync with SelectableMap.css
  UK: {
    right: -60,
  },
  US: {
    left: -30,
  },
};
