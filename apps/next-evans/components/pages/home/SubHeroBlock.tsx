import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { t } from '@friends-library/locale';
import Heading from '@/components/core/Heading';
import Dual from '@/components/core/Dual';
import CoverImg from '@/public/images/samuel-fothergill-cover.jpg';
import iPadImg from '@/public/images/ipad.png';
import iPhoneImg from '@/public/images/iphone.png';
import DeviceArrayImg from '@/public/images/device-array.png';
import BookIcon from '@/public/images/icon-book.svg';
import PhoneIcon from '@/public/images/icon-phone.svg';
import HeadphonesIcon from '@/public/images/icon-headphones.svg';
// import './SubHeroBlock.css';

interface Props {
  numTotalBooks: number;
}

const SubHeroBlock: React.FC<Props> = ({ numTotalBooks }) => (
  <section className="SubHeroBlock bg-flprimary p-10 pb-48 relative overflow-hidden md:px-20 lg:px-24 md:pt-20 md:pb-2 md:overflow-visible xl:py-20">
    <Image
      className="w-[45vw] top-[-5%] right-[-9%] md:top-[-13%] lg:w-[35vw] lg:top-[-15%] lg:right-[-5%] xl:top-[-21%] xl:w-[30vw] xl:max-w-[460px] xl:right-0 2xl:top-[-27%] 2xl:w-[26vw] absolute hidden md:block"
      src={DeviceArrayImg}
      alt=""
    />
    <Heading darkBg className="text-white md:hidden">
      {t`Our Books`}
    </Heading>
    <Dual.P className="font-serif text-white antialiased text-lg sm:text-xl leading-relaxed md:w-2/3 lg:w-4/5 lg:pr-24 md:pr-8 xl:text-2xl xl:max-w-6xl xl:mb-16">
      <>
        Our {numTotalBooks} books are available for free download in multiple editions and
        digital formats, and a growing number of them are also recorded as audiobooks. Or,
        if you prefer, order a paperback — you pay only and exactly what it costs us to
        have them printed and shipped to you.
      </>
      <>
        Nuestros {numTotalBooks} libros están disponibles para descargarse gratuitamente
        en múltiples ediciones y formatos digitales, y un número creciente de estos libros
        están siendo grabados como audiolibros. O si lo prefieres, puedes pedir un libro
        impreso; vas a pagar única y exactamente el costo de impresión y envío.
      </>
    </Dual.P>
    <ul className="flex flex-wrap font-sans text-white uppercase tracking-wider mt-8 mb-12 justify-center antialiased md:justify-start md:max-w-xl lg:max-w-none">
      <li
        style={{ backgroundImage: `url(${HeadphonesIcon.src})` }}
        className="bg-no-repeat [background-size:30px] pl-[40px] [line-height:34px] h-[34px] mr-[30px] mb-[15px] center Format--audio"
      >
        <Link
          className="hover:underline cursor-pointer"
          href={t`/audiobooks`}
        >{t`Audiobooks`}</Link>
      </li>
      <li
        style={{ backgroundImage: `url(${BookIcon.src})` }}
        className="bg-no-repeat [background-size:34px] pl-[40px] [line-height:34px] h-[34px] mr-[30px] mb-[15px] center Format--paperback"
      >{t`Paperbacks`}</li>
      <li
        style={{ backgroundImage: `url(${PhoneIcon.src})` }}
        className="bg-no-repeat [background-size:34px] pl-[34px] [line-height:34px] h-[34px] mr-0 mb-[15px] center Format--ebook"
      >{t`E-Books`}</li>
    </ul>
    <Image
      className="left-[-28px] bottom-[-110px] w-[220px] absolute md:hidden"
      src={CoverImg}
      alt=""
    />
    <Image
      className="w-[350px] left-[56%] bottom-[-340px] translate-x-[-50%] absolute shadow-xl md:hidden"
      src={iPhoneImg}
      alt=""
    />
    <Image
      className="right-[-85px] w-[300px] absolute shadow-xl md:hidden"
      src={iPadImg}
      alt=""
    />
  </section>
);

export default SubHeroBlock;
