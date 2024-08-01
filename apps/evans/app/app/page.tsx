import React from 'react';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import type { NextPage } from 'next';
import AppStoreBadgeLinks from '@/components/pages/app/AppStoreBadgeLinks';
import AppScreenshots from '@/components/pages/app/AppScreenshots';
import WhiteOverlay from '@/components/core/WhiteOverlay';
import Dual from '@/components/core/Dual';
import BooksBgBlock from '@/components/core/BooksBgBlock';
import api from '@/lib/ssg/api-client';
import * as seo from '@/lib/seo';
import { LANG } from '@/lib/env';

interface PageData {
  numAudioBooks: number;
  numBooks: number;
}

async function getPageData(): Promise<PageData> {
  const data = await api.totalPublished();
  return {
    numAudioBooks: data.audiobooks[LANG],
    numBooks: data.books[LANG],
  };
}

const AppPage: NextPage = async () => {
  const { numAudioBooks, numBooks } = await getPageData();
  return (
    <div className="overflow-hidden">
      <BooksBgBlock>
        <WhiteOverlay>
          <Dual.H1 className="heading-text text-2xl sm:text-4xl bracketed text-flprimary">
            <>Friends Library App</>
            <>Aplicación de Bibliotecas de Los Amigos</>
          </Dual.H1>
        </WhiteOverlay>
      </BooksBgBlock>
      <div className="p-10 flex flex-col items-center md:py-16">
        <Dual.H2 className="text-flgray-900 text-3xl tracking-widest mb-6">
          <>Available for iOS and Android</>
          <>Disponible en iOS y Android</>
        </Dual.H2>
        <Dual.P className="body-text text-xl pb-8 max-w-screen-md leading-loose">
          <>
            <span className="bg-green-600 text-white rounded-full font-sans uppercase text-xs px-2 py-0 inline-block mr-2 transform -translate-y-1">
              Update
            </span>
            <b>October 7, 2021</b> &mdash; The Friends Library App <b>version 2.1</b> has
            been released. New in this release is support for full-screen reading and
            listening on both <em>iPads</em> and <em>Android tablets.</em>
          </>
          <>
            <span className="bg-green-600 text-white rounded-full font-sans uppercase text-xs px-2 py-0 inline-block mr-2 transform -translate-y-1">
              Actualización
            </span>
            <b>7 de octubre de 2021</b> Se ha lanzado la <b>versión 2.1</b> de la
            aplicación de la Biblioteca de los Amigos. La novedad de esta versión es la
            posibilidad de leer y escuchar tanto en <em>iPads</em> como en{` `}
            <em>tabletas Android.</em>
          </>
        </Dual.P>
        <Dual.P className="body-text text-xl pb-8 max-w-screen-md leading-loose">
          <>
            <span className="bg-green-600 text-white rounded-full font-sans uppercase text-xs px-2 py-0 inline-block mr-2 transform -translate-y-1">
              Update
            </span>
            <b>June 28, 2021</b> &mdash; The Friends Library App <b>version 2</b> has been
            released. New in this release is the ability to <b>read</b> all of our
            published books <em>from directly within the app.</em>
          </>
          <>
            <span className="bg-green-600 text-white rounded-full font-sans uppercase text-xs px-2 py-0 inline-block mr-2 transform -translate-y-1">
              Actualización
            </span>
            <b>Junio 28, 2021</b> &mdash; Ya está disponible la <b>Versión 2.0</b> de la
            Aplicación de la Biblioteca de los Amigos. Ahora todos los libros que tenemos
            publicados se pueden <em>leer directamente en la aplicación.</em>
          </>
        </Dual.P>
        <Dual.P className="body-text text-xl pb-8 max-w-screen-md leading-loose">
          <>
            The Friends Library app is available for free on both <b>iOS</b> and{` `}
            <b>Android</b> in the Apple App Store and Google Play Store. Use one of the
            links below to download the right app for your phone or device.
          </>
          <>
            La Biblioteca de los Amigos ahora tiene una aplicación gratuita disponible en
            la
            {` `}
            <b>App Store</b> y en <b>Google Play Store.</b> Haz clic en uno de los enlaces
            a continuación para descargar la aplicación que corresponda a tu teléfono o
            dispositivo.
          </>
        </Dual.P>
        <AppStoreBadgeLinks />
        <Dual.H3 className="text-flgray-900 text-2xl tracking-widest mb-6 mt-6">
          <>
            Easy to use <span className="underline inline-block pr-1">audiobooks</span>
            ...
          </>
          <>
            Es muy fácil escuchar{` `}
            <span className="underline inline-block pr-1">audiolibros</span> ...
          </>
        </Dual.H3>
        <Dual.P className="body-text pb-12 max-w-screen-md leading-loose">
          <>
            Friends Library currently has {numAudioBooks} titles recorded as audiobooks,
            with more being added regularly. Unfortunately, downloading and listening to
            our audiobooks <em>directly from this website</em> is quite difficult, even
            for knowledgeable users. The Friends Library App makes it super easy to
            download and listen to any of our audiobooks, wherever you are. Just select an
            audiobook from the list and press play. You can download entire audiobooks
            while you&rsquo;re connected to Wifi and listen to them conveniently later
            when you may or may not have internet.
          </>
          <>
            Actualmente, La Biblioteca de los Amigos tiene {numAudioBooks}
            {` `}
            libros grabados en forma de Audiolibros, y ese número seguirá creciendo.
            Desafortunadamente, descargar y escuchar nuestros audiolibros directamente
            desde este sitio web puede ser difícil, incluso para usuarios con cierto
            conocimiento. La Aplicación de la Biblioteca de Los Amigos hace que sea
            demasiado fácil descargar y escuchar cualquiera de nuestros audiolibros, donde
            sea que estés. Solo tienes que seleccionar un audiolibro de la lista y darle a
            reproducir. Puedes descargar libros enteros mientras estés conectado a un
            Wifi, y escucharlos luego a tu conveniencia, sin conexión de internet.
          </>
        </Dual.P>

        <AppScreenshots emphasizing="listen" />

        <Dual.H3 className="text-flgray-900 text-2xl tracking-widest mb-6">
          <>
            <span className="pr-1">...</span>or <span className="underline">read</span>
            {` `}
            any of our books, right in the app.
          </>
          <>
            <span className="pr-1">...</span>o <span className="underline">leer</span>
            {` `}
            cualquiera de nuestros libros, directamente en la aplicación.
          </>
        </Dual.H3>
        <Dual.P className="body-text pb-12 max-w-screen-md leading-loose">
          <>
            Every single one of our {numBooks} books can be conveniently read in
            electronic form, from right within the Friends Library app. The built in
            e-reader allows customization of the color scheme and font size, and will keep
            your position in as many books as you&rsquo;re reading, allowing you to easily
            pick up where you left off. Plus, every new book we add, and every error we
            fix in any of our published texts will automatically be downloaded and synced
            in your app, so you&rsquo;ll always be up to date.
          </>
          <>
            Cada uno de nuestros {numBooks} libros se puede leer cómodamente en formato
            electrónico dentro de la aplicación de la Biblioteca de Los Amigos. El lector
            electrónico integrado permite la configuración de la combinación de colores y
            del tamaño de la letra, y guardará el punto donde quedaste en todos los libros
            que estés leyendo, haciendo que sea más fácil para ti retomar la lectura desde
            donde la dejaste. Además, cada libro nuevo que agreguemos, y cada error que
            corrijamos en alguno de nuestros textos publicados, se descargará y
            sincronizará automáticamente en tu aplicación, así que siempre estarás al día.
          </>
        </Dual.P>

        <AppScreenshots emphasizing="read" />

        <Dual.P className="body-text pb-12 max-w-screen-md leading-loose">
          <>
            In the future, we plan to continue to add a number of useful features to the
            app, all with the goal of making it easier for everyone to find, listen, read
            and benefit from these invaluable writings. It is our hope that many would be
            encouraged to faithfully and fervently follow in the footsteps of these
            exemplary men and women who ran well and fought the good fight, leaving us
            many precious testimonies of lives fully surrendered to the grace, light and
            Spirit of our Lord Jesus Christ.
          </>
          <>
            En el futuro, planeamos seguir añadiéndole a la aplicación unas cuántas
            funciones muy útiles, todas con el objetivo de hacer que sea más sencillo para
            todos encontrar, escuchar, leer y beneficiarse de estos invaluables escritos.
            Tenemos la esperanza de que muchos se animen a seguir fiel y fervientemente
            las pisadas de estos ejemplares hombres y mujeres que corrieron bien y
            pelearon la buena batalla, dejándonos muchos testimonios preciosos de vidas
            entregadas completamente a la gracia, luz y Espíritu de nuestro Señor
            Jesucristo.
          </>
        </Dual.P>
        <Dual.H3 className="text-flgray-900 text-2xl tracking-widest mb-6">
          <>Getting help or suggesting features</>
          <>Obtener ayuda o sugerir funciones</>
        </Dual.H3>
        <Dual.P className="body-text pb-12 max-w-screen-md leading-loose">
          <>
            If you come across anything that is confusing or seems to not work for you,
            please reach out using our{` `}
            <Link className="text-flprimary fl-underline" href={t`/contact`}>
              contact page.
            </Link>
            {` `}
            Or, just let us know if you find the app useful, or what other features you
            think we should be working on. Thanks for trying it out! For details on our
            app privacy policy,{` `}
            <Link href={t`/app-privacy`} className="text-flprimary fl-underline">
              see here.
            </Link>
          </>
          <>
            Si te encuentras con algo que sea confuso o parezca no funcionarte, por favor
            háznoslo saber por medio de nuestra{` `}
            <Link className="text-flprimary fl-underline" href={t`/contact`}>
              página de contacto.
            </Link>
            {` `}
            O, simplemente coméntanos si la aplicación te ha sido útil, o qué otra función
            te parece que deberíamos añadir. ¡Gracias por probarla! Para conocer los
            detalles de la política de privacidad de nuestra aplicación,{` `}
            <Link href={t`/app-privacy`} className="text-flprimary fl-underline">
              ingresa aquí.
            </Link>
          </>
        </Dual.P>
      </div>
    </div>
  );
};

export default AppPage;

export const metadata = seo.nextMetadata(
  t`Friends Library App`,
  seo.pageMetaDesc(`app`, {}),
);

export const revalidate = 259200; // 3 days
