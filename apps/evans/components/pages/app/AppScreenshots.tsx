import Image from 'next/image';
import Dual from '@/components/core/Dual';

import AppAudioList_en from '@/public/images/app/app-audio-list.en.jpg';
import AppAudioList_es from '@/public/images/app/app-audio-list.es.jpg';
import AppAudio_en from '@/public/images/app/app-audio.en.jpg';
import AppAudio_es from '@/public/images/app/app-audio.es.jpg';
import AppEbook_en from '@/public/images/app/app-ebook.en.jpg';
import AppEbook_es from '@/public/images/app/app-ebook.es.jpg';
import AppHome_en from '@/public/images/app/app-home.en.jpg';
import AppHome_es from '@/public/images/app/app-home.es.jpg';
import AppRead_en from '@/public/images/app/app-read.en.jpg';
import AppRead_es from '@/public/images/app/app-read.es.jpg';
import AppSplash_en from '@/public/images/app/app-splash.en.jpg';
import AppSplash_es from '@/public/images/app/app-splash.es.jpg';

interface Props {
  emphasizing: 'listen' | 'read';
}

const AppScreenshots: (props: Props) => React.JSX.Element = ({ emphasizing: show }) => (
  <Dual.Div className="flex space-x-4 mb-10 justify-center">
    <>
      <Image
        className="w-48"
        src={show === `listen` ? AppSplash_en : AppHome_en}
        alt="Screenshot of Friends Library App splash screen"
      />
      <Image
        className="w-48"
        src={show === `listen` ? AppAudio_en : AppRead_en}
        alt="Screenshot of Friends Library App audiobook screen"
      />
      <Image
        className="w-48"
        src={show === `listen` ? AppAudioList_en : AppEbook_en}
        alt="Screenshot of Friends Library App audiobooks screen"
      />
    </>
    <>
      <Image
        className="w-48"
        src={show === `listen` ? AppSplash_es : AppHome_es}
        alt="Captura de la pantalla de carga de la aplicación de la Biblioteca de Amigos"
      />
      <Image
        className="w-48"
        src={show === `listen` ? AppAudio_es : AppRead_es}
        alt="Captura de la pantalla de audiolibro de la aplicación de la Biblioteca de  Amigos"
      />
      <Image
        className="w-48"
        src={show === `listen` ? AppAudioList_es : AppEbook_es}
        alt="Captura de la pantalla de audiolibros de la aplicación de la Biblioteca de  Amigos"
      />
    </>
  </Dual.Div>
);

export default AppScreenshots;
