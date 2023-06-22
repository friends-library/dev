import React from 'react';
import Dual from '@/components/core/Dual';
import BackgroundImage from '@/components/core/BackgroundImage';
import TreeRootsImage from '@/public/images/tree-roots.webp';

const HeroBlock: React.FC = () => (
  <section className="HeroBlock flex w-full">
    <BackgroundImage
      src={TreeRootsImage}
      className="HeroBlock__text md:w-2/3 xl:w-3/5"
      fit="cover"
    >
      <div className="[background-image:linear-gradient(rgba(45,42,41,0.75),rgba(45,42,41,0.75))] md:[background-image:none] md:bg-white px-12 sm:px-16 py-12 sm:py-20 md:px-20 lg:p-24 text-white md:text-gray-900">
        <Dual.H1 className="font-sans text-2xl sm:text-3xl mb-8 md:mb-6 font-bold tracking-wider">
          <>
            Dedicated to the preservation and free distribution of early Quaker writings
          </>
          <>
            Dedicado a la preservación y distribución gratuita de los escritos de los
            primeros Cuáqueros
          </>
        </Dual.H1>
        <Dual.P className="font-serif text-lg sm:text-xl md:text-gray-800 leading-relaxed antialiased">
          <>
            This website exists to freely share the writings of early members of the
            Religious Society of Friends (Quakers), believing that no other collection of
            Christian writings more accurately communicates or powerfully illustrates the
            soul-transforming power of the gospel of Jesus Christ.
          </>
          <>
            Este sitio web ha sido creado para compartir gratuitamente los escritos de los
            primeros miembros de la Sociedad de Amigos (Cuáqueros), ya que creemos que no
            existe ninguna otra colección de escritos cristianos que comunique con mayor
            precisión, o que ilustre con más pureza, el poder del evangelio de Jesucristo
            que transforma el alma.
          </>
        </Dual.P>
      </div>
    </BackgroundImage>
    <BackgroundImage
      src={TreeRootsImage}
      className="HeroBlock__bg md:w-1/3 xl:w-2/5 hidden md:block"
      fit="cover"
    >
      <div className="w-full h-full bg-pink-500  [background:linear-gradient(rgba(108,49,66,0.5),rgba(108,49,66,0.5))]" />
    </BackgroundImage>
  </section>
);

export default HeroBlock;
