import React from 'react';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import Header from './Header';
import ErrorMsg from './ErrorMsg';
import Dual from '@/components/core/Dual';
import Button from '@/components/core/Button';

interface Props {
  onRetry: () => void;
  onClose: () => void;
}

const UnrecoverableError: React.FC<Props> = ({ onRetry, onClose }) => (
  <div>
    <Header>Error</Header>
    <ErrorMsg>
      <span role="img" aria-label="">
        😬
      </span>
      {` `}
      <Dual.Frag>
        <>
          Whoops! We’re very sorry &mdash; the checkout process encountered a rare and
          unexpected error. Don’t worry, your credit card <i>was not charged.</i> Please
          try your order again in a few moments. Our team has already been notified of the
          error. If the problem persists, please{` `}
          <Link href={t`/contact`} className="underline">
            contact us
          </Link>
          {` `}
          to get help completing your order.
        </>
        <>
          ¡Whoops! Lo sentimos mucho &mdash; el proceso de pago ha encontrado un error
          raro e inesperado. No te preocupes, no se ha emitido ningún cargo a tu tarjeta
          de crédito. Por favor intenta hacer el pedido otra vez en unos momentos. Nuestro
          equipo ya ha sido notificado sobre este error. Si el problema persiste, por
          favor{` `}
          <Link href={t`/contact`} className="underline">
            contáctanos
          </Link>
          {` `}
          para que puedas recibir ayuda para completar tu pedido..
        </>
      </Dual.Frag>
    </ErrorMsg>
    <div className="flex flex-col items-center mt-8 md:flex-row md:justify-center">
      <Button className="mb-6 md:mb-0 md:mr-6" shadow onClick={onRetry}>
        {t`Try Again`}
      </Button>
      <Button className="bg-gray-500" bg={null} shadow onClick={onClose}>
        {t`Close`}
      </Button>
    </div>
  </div>
);

export default UnrecoverableError;
