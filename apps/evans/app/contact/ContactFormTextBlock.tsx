import React from 'react';
import { t } from '@friends-library/locale';
import Dual from '@/components/core/Dual';

const ContactFormTextBlock: React.FC = () => (
  <div className="bg-white p-16 text-center lg:text-left body-text flex flex-col lg:w-1/3 lg:bg-flgray-100 lg:px-12">
    <h1 className="sans-widest text-2xl pb-3 mb-10 uppercase border-flprimary border-b-4 self-center">
      {t`Contact`}
    </h1>
    <div className="flex flex-col gap-6 lg:gap-8">
      <Dual.P key="p1">
        <>
          Got a question? &mdash; or are you having any sort of technical trouble with our
          books or website?
        </>
        <>
          ¿Tienes alguna pregunta? &mdash; ¿o estás teniendo algún tipo de problema
          técnico con nuestros libros o con el sitio?
        </>
      </Dual.P>
      <Dual.P key="p2">
        <>Want to reach out for any other reason?</>
        <>¿Quieres ponerte en contacto por alguna otra razón?</>
      </Dual.P>
      <Dual.P key="p3">
        <>We’d love to hear from you! You can expect to hear back within a day or two.</>
        <>
          ¡Nos encantaría escucharte! Puedes contar con nuestra respuesta en un día o dos.
        </>
      </Dual.P>
    </div>
  </div>
);

export default ContactFormTextBlock;
