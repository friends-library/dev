import React from 'react';
import Image from 'next/image';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import Heading from '@/components/core/Heading';
import Dual from '@/components/core/Dual';
import { LANG } from '@/lib/env';
import BgImage from '@/public/images/formats-books.png';
import BgImageMobile from '@/public/images/formats-books-mobile.png';

const FormatsBlock: React.FC = () => (
  <section className="FormatsBlock min-[1680px]:pl-[10%] py-16 px-12 sm:px-16 relative xl:pl-24 xl:py-24">
    <Heading left={[`md`]} className="text-gray-900 md:text-left">
      <Dual.Frag>
        <>Formats &amp; Editions</>
        <>Formatos</>
      </Dual.Frag>
    </Heading>
    <div className="hidden md:block BookMask--lg float-right h-[470px] w-[330px] [shape-outside:polygon(268px_99.28%,2.97%_1.75%,100%_0.25%,99.7%_99.57%)]"></div>
    <div
      className={cx(
        `BookMask--sm float-right h-[700px] w-[130px] [shape-outside:polygon(173px_26.1%,59.89%_1.68%,126.14%_-5.03%,113.54%_103.04%,47.4%_81.24%,132.78%_73.29%,29.23%_37.77%)] md:hidden`,
        `min-[400px]:h-[600px] min-[400px]:[shape-outside:polygon(167px_60.53%,27.58%_19.69%,119.22%_6.54%,107.39%_94.73%,46.15%_70.51%)]`,
        `min-[500px]:h-[500px] min-[500px]:[shape-outside:polygon(165px_73.13%,16.04%_23.69%,127.68%_8.94%,108.16%_112.73%,43.07%_86.51%)]`,
        `min-[600px]:h-[400px] min-[600px]:[shape-outside:polygon(169px_91.13%,127.58%_-0.56%,2.3%_23.01%)]`,
        `min-[640px]:h-[450px] min-[640px]:[shape-outside:polygon(171px_74.69%,13.73%_12.36%,129.99%_-5.5%,95.85%_117.62%,33.07%_90.51%)]`,
      )}
    ></div>
    <Dual.P
      className={cx(
        `font-serif antialiased text-lg sm:text-xl text-gray-700 leading-relaxed max-w-screen-lg`,
      )}
    >
      <>
        On this site you will find many books available in multiple formats. Our desire is
        to make these precious writings as accessible as possible to today&rsquo;s seeker
        of truth&mdash;therefore, each book has been converted to 3 digital formats: pdf,
        mobi (for Kindle), and epub (all other e-readers including Apple Books). A growing
        number of our books are also available{` `}
        <Link href={t`/audiobooks`} className="subtle-link">
          as audiobooks
        </Link>
        . And in addition to these formats (which are 100% free to download), paperback
        books are available <em>at cost</em> for every title offered on our site.
      </>
      <>
        En este sitio encontrarás muchos libros disponibles en múltiples formatos. Nuestro
        deseo es hacer que estos preciosos escritos sean lo más accesibles posible para el
        buscador de la verdad de nuestro día—por lo tanto, cada libro ha sido convertido
        en tres formatos digitales: PDF, MOBI (para Kindle), y EPUB (para todo el resto de
        lectores electrónicos incluyendo “Libros” de Apple). Un número creciente de
        nuestros libros también están disponibles{` `}
        <Link href={t`/audiobooks`} className="subtle-link">
          en audiolibros
        </Link>
        . Y además de estos formatos (que puedes descargar completamente gratis), tenemos
        disponibles libros impresos para cada título, los cuales ofrecemos en nuestro
        sitio{` `}
        <em>sólo cobrando lo que calculamos que nos costará imprimirlo y enviártelo.</em>
      </>
    </Dual.P>
    {LANG === `en` && (
      <p className="mt-8 font-serif antialiased text-lg sm:text-xl text-gray-700 leading-relaxed max-w-screen-lg">
        Besides offering these books in digital, audio, and printed <em>formats,</em> most
        of these publications are available in different <em>editions</em> as well. We
        offer an original, unedited edition for those who enjoy the archaic language and
        style. But because most readers find the older English somewhat challenging, we
        offer minimally and carefully modernized editions as well. For more information
        {` `}
        <Link href="/modernization" className="subtle-link">
          click here
        </Link>
        .
      </p>
    )}
    <Image
      className="Books--lg absolute w-[380px] right-0 top-[-100px] z-10 hidden md:block"
      src={BgImage}
      alt=""
    />
    <Image
      className="Books--sm absolute w-[180px] right-[-15px] top-[75px] z-10 md:hidden min-[400px]:top-[-70px] min-[500px]:right-0 min-[600px]:w-[200px] min-[600px]:top-[-140px]"
      src={BgImageMobile}
      alt=""
    />
  </section>
);

export default FormatsBlock;
