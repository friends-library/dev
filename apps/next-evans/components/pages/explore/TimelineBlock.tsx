import React, { useState } from 'react';
import cx from 'classnames';
import BgWordBlock from './BgWordBlock';
import BookSlider from './BookSlider';
import { BookPreviewProps } from '@/lib/types';
import { useWindowWidth } from '@/lib/hooks/window-width';
import { SCREEN_MD } from '@/lib/constants';
import BackgroundImage from '@/components/core/BackgroundImage';
import PillDropdown from '@/components/core/PillDropdown';
import PillDropdownDropdown from '@/components/core/PillDropdownDropdown';
import PillDropdownItem from '@/components/core/PillDropdownItem';
import TimePicker from './TimePicker';
import CastleBgImage from '@/public/images/castle.jpg';

interface Props {
  books: (BookPreviewProps & { date: number })[];
}

const TimelineBlock: React.FC<Props> = ({ books }) => {
  const [date, setDate] = useState<number>(1650);
  const windowWidth = useWindowWidth();
  const nextDate = date + (windowWidth < SCREEN_MD ? 50 : 25);
  return (
    <div className="TimelineBlock">
      <BackgroundImage
        src={CastleBgImage}
        className=""
        fit="cover"
        fineTuneImageStyles={{
          objectPosition: `center 0`,
        }}
      >
        <div className="bg-gradient-to-b from-black/40 to-black/40">
          <BgWordBlock
            word="Timeline"
            className={cx(
              'TimelineBlock__BgWord px-12 pt-40 pb-24 sm:pb-32',
              '[&_.BackgroundWord]:pt-[75px] [&_.BackgroundWord]:text-white [&_.BackgroundWord]:z-30 [&_.BackgroundWord]:text-[90px]',
              'sm:[&_.BackgroundWord]:pt-[38px] sm:[&_.BackgroundWord]:text-[130px]',
            )}
          >
            <div className="bg-white px-10 py-12 text-center max-w-screen-md mx-auto">
              <h2 className="font-sans text-flblack tracking-wide text-3xl mb-6">
                Timeline
              </h2>
              <p className="body-text leading-loose">
                The books in our library were written over the course of approximately 200
                years. Use the timeline picker below to view books from the time period of
                your choice.
              </p>
            </div>
          </BgWordBlock>
          <div className="sm:hidden pb-32 -mt-12">
            <label className="font-sans text-center text-white uppercase antialiased mt-0 mb-2 block tracking-widest">
              Pick a Date
            </label>
            <PillDropdown pillText={String(date)} className="mx-auto">
              <PillDropdownDropdown>
                <PillDropdownItem onClick={() => setDate(1650)} selected={date === 1650}>
                  1650
                </PillDropdownItem>
                <PillDropdownItem onClick={() => setDate(1700)} selected={date === 1700}>
                  1700
                </PillDropdownItem>
                <PillDropdownItem onClick={() => setDate(1750)} selected={date === 1750}>
                  1750
                </PillDropdownItem>
                <PillDropdownItem onClick={() => setDate(1800)} selected={date === 1800}>
                  1800
                </PillDropdownItem>
                <PillDropdownItem onClick={() => setDate(1850)} selected={date === 1850}>
                  1850
                </PillDropdownItem>
              </PillDropdownDropdown>
            </PillDropdown>
          </div>
          <TimePicker
            className="hidden sm:flex pb-32 mx-20 -mt-6 max-w-screen-lg lg:mx-auto"
            selected={date}
            setSelected={setDate}
          />
        </div>
      </BackgroundImage>
      <div className="bg-flgold text-center text-white text-2xl p-4 tracking-widest sm:hidden">
        {date}
      </div>
      <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start pt-20 sm:pt-12 sm:-mt-32 mb-8 relative">
        <div className="YearBar hidden md:block bg-flgold text-white box-content h-48 py-2 px-2 mr-4 text-center text-xl [writing-mode:vertical-lr] rotate-180">
          {date}
        </div>
        <BookSlider
          books={books
            .filter((b) => b.date >= date && b.date < nextDate)
            .sort((a, b) => (a.date < b.date ? -1 : 1))}
          className="z-0 sm:z-10"
        />
      </div>
    </div>
  );
};

export default TimelineBlock;
