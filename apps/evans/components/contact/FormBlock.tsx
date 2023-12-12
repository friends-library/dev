import React from 'react';
import NextBgImage, { bgColor } from '@friends-library/next-bg-image';
import { t } from '@friends-library/locale';
import Dual from '../core/Dual';
import Form from './Form';
import BooksBg from '@/public/images/books-diagonal.jpg';

interface Props {
  onSubmit: (
    name: string,
    email: string,
    message: string,
    subject: 'tech' | 'other',
  ) => Promise<boolean>;
}

const ContactFormBlock: React.FC<Props> = ({ onSubmit }) => (
  <NextBgImage src={[bgColor(`rgba(0,0,0,0.5)`), BooksBg]}>
    <div className="flex flex-col lg:flex-row lg:py-24 lg:px-6 max-w-screen-lg mx-auto">
      <div className="bg-white p-16 text-center lg:text-left body-text flex flex-col lg:w-1/3 lg:bg-flgray-100 lg:px-12">
        <h1 className="sans-widest text-2xl pb-3 mb-10 uppercase border-flprimary border-b-4 self-center">
          {t`Contact`}
        </h1>
        <div className="flex flex-col gap-6 lg:gap-8">
          <Dual.P key="p1">
            <>
              Got a question? &mdash; or are you having any sort of technical trouble with
              our books or website?
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
            <>
              We’d love to hear from you! You can expect to hear back within a day or two.
            </>
            <>
              ¡Nos encantaría escucharte! Puedes contar con nuestra respuesta en un día o
              dos.
            </>
          </Dual.P>
        </div>
      </div>
      <Form onSubmit={onSubmit} className="lg:flex-grow p-6 m-2 sm:m-6 lg:m-0 lg:py-12" />
    </div>
  </NextBgImage>
);

export default ContactFormBlock;
