import React, { useContext, useState, useEffect } from 'react';
import OrderClient, { type T } from '@friends-library/pairql/order';
import cx from 'classnames';
import type { Props as ShippingAddressProps } from './ShippingAddress';
import MessageThrobber from './MessageThrobber';
import { CloseButton } from './Modal';
import ShippingAddress from './ShippingAddress';
import { useAddress } from './hooks';
import Button from '@/components/core/Button';
import { AppDispatch } from '@/lib/app-state';

type AddressProps = Omit<ShippingAddressProps, `autoFocusFirst`>;

type CommonProps = { onClose(): unknown; initialTitles: string };
type Props =
  | ({
      state: `default`;
      addressProps: AddressProps;
      addressIsValid: boolean;
      initialTitles: string;
      onSubmit(about: string, titles: string): unknown;
    } & CommonProps)
  | { state: `submitting` }
  | ({ state: `submit_success` } & CommonProps)
  | ({ state: `submit_error`; onRetry(): unknown } & CommonProps);

export const RequestFreeBooks: React.FC<Props> = (props) => {
  const [titles, setTitles] = useState(
    props.state === `submitting` ? `` : props.initialTitles,
  );
  const [titlesBlurred, setTitlesBlurred] = useState(false);
  const [about, setAbout] = useState(``);
  const [aboutBlurred, setAboutBlurred] = useState(false);
  const aboutInvalid = aboutBlurred && about.trim() === ``;
  const titlesInvalid = titlesBlurred && titles.trim() === ``;

  // start at top of page
  useEffect(() => window.scroll(0, 0), []);

  switch (props.state) {
    case `default`:
      return (
        <Wrap onClose={props.onClose}>
          <div className="max-w-4xl">
            <Heading size="text-2xl">Formulario Para Solicitar Libros Gratuitos</Heading>
            <div className="max-w-2xl mx-auto">
              <p className="antialiased font-serif text-flgray-900 sm:text-justify">
                Para ayudarnos a distinguir entre los verdaderos buscadores y los
                estafadores en línea, por favor, cuéntanos un poco sobre ti y por qué
                estás solicitando nuestros libros.
              </p>
              <textarea
                autoFocus
                placeholder={aboutInvalid ? `Esta información es obligatoria.` : ``}
                className={cx(`CartInput mt-3`, aboutInvalid && `invalid`)}
                rows={4}
                onFocus={() => setAboutBlurred(false)}
                onBlur={() => setAboutBlurred(true)}
                onChange={(e) => setAbout(e.target.value)}
              >
                {about}
              </textarea>
              <Heading>El título del libro/s que le gustaría recibir:</Heading>
              <textarea
                placeholder={titlesInvalid ? `Esta información es obligatoria.` : ``}
                className={cx(`CartInput mt-3`, titlesInvalid && `invalid`)}
                rows={3}
                onFocus={() => setTitlesBlurred(false)}
                onBlur={() => setTitlesBlurred(true)}
                onChange={(e) => setTitles(e.target.value)}
              >
                {titles}
              </textarea>
              <Heading>Datos:</Heading>
              <p className="antialiased font-serif text-flgray-900 mb-5 md:text-justify">
                Por favor, rellena el siguiente formulario en su totalidad. Es importante
                que nos proporciones una dirección de correo electrónico válida para que
                podamos comunicarnos contigo sobre tu solicitud, y enviarte la información
                de seguimiento de tu envío.
              </p>
            </div>
            <div className="InputWrap md:flex flex-wrap justify-between">
              <ShippingAddress autoFocusFirst={false} {...props.addressProps} />
            </div>
            <div className="mt-3 flex justify-center">
              <Button
                className="bg-flgold mb-16"
                disabled={
                  about.trim() === `` || titles.trim() === `` || !props.addressIsValid
                }
                onClick={() => props.onSubmit(about, titles)}
              >
                Enviar
              </Button>
            </div>
          </div>
        </Wrap>
      );
    case `submit_success`:
      return (
        <Wrap onClose={props.onClose}>
          <p className="font-serif py-3 px-6 bg-green-200 text-green-800 mx-6 sm:mx-8 mt-12 max-w-lg text-center rounded-lg">
            Gracias, enviado con éxito. Pronto recibirás noticias nuestras.
          </p>
        </Wrap>
      );
    case `submit_error`:
      return (
        <Wrap onClose={props.onClose}>
          <p className="font-serif py-3 px-6 bg-red-200 text-red-800 mx-6 sm:mx-8 mt-12 max-w-lg text-center rounded-lg">
            Hubo un error al enviar tu solicitud, por favor,{` `}
            <span
              onClick={props.onRetry}
              className="border-b border-dotted border-red-800 cursor-pointer hover:border-solid"
            >
              inténtalo de nuevo
            </span>
            .
          </p>
        </Wrap>
      );
    case `submitting`:
      return <MessageThrobber />;
  }
};

const RequestFreeBooksContainer: React.FC<{ currentPageBook: string }> = ({
  currentPageBook,
}) => {
  const [state, setState] = useState<Props[`state`]>(`default`);
  const [addressProps, address, addressValid] = useAddress({});
  const dispatch = useContext(AppDispatch);
  const close: () => unknown = () => dispatch({ type: `show--app` });

  switch (state) {
    case `default`:
      return (
        <RequestFreeBooks
          state="default"
          initialTitles={currentPageBook}
          addressProps={addressProps}
          addressIsValid={addressValid}
          onSubmit={async (aboutRequester, requestedBooks) => {
            setState(`submitting`);
            const input: T.CreateFreeOrderRequest.Input = {
              email: address.email,
              requestedBooks,
              aboutRequester,
              name: address.name,
              addressStreet: address.street,
              addressStreet2: address.street2,
              addressCity: address.city,
              addressState: address.state,
              addressZip: address.zip,
              addressCountry: address.country,
              source: window.location.href,
            };
            const client = OrderClient.web(window.location.href, () => undefined);
            const result = await client.createFreeOrderRequest(input);
            setState(result.isSuccess ? `submit_success` : `submit_error`);
          }}
          onClose={close}
        />
      );
    case `submit_error`:
      return (
        <RequestFreeBooks
          initialTitles={currentPageBook}
          state="submit_error"
          onClose={close}
          onRetry={() => setState(`default`)}
        />
      );
    case `submitting`:
      return <RequestFreeBooks state="submitting" />;
    case `submit_success`:
      return (
        <RequestFreeBooks
          initialTitles={currentPageBook}
          state="submit_success"
          onClose={close}
        />
      );
  }
};

export default RequestFreeBooksContainer;

const Heading: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: `text-xl` | `text-2xl`;
}> = ({ className, children, size = `text-xl` }) => (
  <h1 className={cx(className, size, `uppercase text-flgold mb-3 mt-1 text-center`)}>
    {children}
  </h1>
);

const Wrap: React.FC<{ children: React.ReactNode; onClose: () => unknown }> = ({
  children,
  onClose,
}) => (
  <div className="py-6 px-8 sm:p-10 lg:p-12 flex flex-col items-center relative">
    <CloseButton onClick={onClose} />
    {children}
  </div>
);
