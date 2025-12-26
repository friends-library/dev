import React from 'react';
import NextBgImage, { bgColor } from 'next-bg-image';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Turnstile from 'react-turnstile';
import { makeScroller } from '../../lib/scroll';
import ContactFormTextBlock from './ContactFormTextBlock';
import BooksBg from '@/public/images/books-diagonal.jpg';
import Button from '@/components/core/Button';
import Dual from '@/components/core/Dual';
import { TURNSTILE_SITE_KEY } from '@/lib/env';

interface Props {
  name: string;
  setName(name: string): unknown;
  email: string;
  setEmail(email: string): unknown;
  message: string;
  setMessage(message: string): unknown;
  subject: `tech` | `other`;
  setSubject(subject: `tech` | `other`): unknown;
  state: `default` | `submitting` | `submitted`;
  success: boolean;
  onSubmit(): Promise<unknown>;
  setTurnstileToken(token: string): unknown;
  _buildTime?: string;
}

export const ContactForm: React.FC<Props> = ({
  onSubmit,
  name,
  setName,
  message,
  setMessage,
  subject,
  setSubject,
  email,
  setEmail,
  state,
  success,
  setTurnstileToken,
  _buildTime,
}) => (
  <NextBgImage
    minImageWidth={900}
    src={[bgColor(`rgba(0,0,0,0.5)`), BooksBg, bgColor(`rgb(33,20,14)`)]}
  >
    <div
      data-buildtime={_buildTime ?? `not-production`}
      className="flex flex-col lg:flex-row lg:py-24 lg:px-6 max-w-screen-lg mx-auto"
    >
      <ContactFormTextBlock />
      <div className="ContactForm bg-cover lg:bg-white lg:flex-grow p-6 m-2 sm:m-6 lg:m-0 lg:py-12">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit();
            setTimeout(() => makeScroller(`.FormResultMsg`, 20)(), 10);
          }}
          className="bg-white p-8 sm:p-10"
        >
          {state === `submitted` && success && (
            <Dual.P className="FormResultMsg bg-green-700 text-white py-4 px-6 mb-6">
              <>Success! You should hear back from us shortly.</>
              <>¡Enviado exitosamente! Pronto recibirás una respuesta de nosotros.</>
            </Dual.P>
          )}
          {state === `submitted` && !success && (
            <Dual.P className="FormResultMsg bg-red-800 text-white py-4 px-6 mb-6">
              <>
                Sorry! There was a problem sending your request. Please try again, or{` `}
                <a
                  href={`mailto:${fallbackEmail}?body=${encodeURIComponent(message)}`}
                  className="border-b border-white border-dotted"
                >
                  email us directly
                </a>
                {` `}
                if the problem persists.
              </>
              <>
                ¡Lo sentimos! Hubo un problema al enviar tu solicitud. Por favor intenta
                nuevamente, o, si el problema persiste,{` `}
                <a
                  href={`mailto:${fallbackEmail}?body=${encodeURIComponent(message)}`}
                  className="border-b border-white border-dotted"
                >
                  envíanos un correo directamente
                </a>
                .
              </>
            </Dual.P>
          )}
          <fieldset>
            <Label htmlFor="name">{t`Name`}</Label>
            <input
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASSES}
              autoFocus
              type="text"
              id="name"
              name="name"
              autoComplete="name"
            />
          </fieldset>
          <fieldset>
            <Label htmlFor="email">{t`Email`}</Label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASSES}
              type="email"
              name="email"
              autoComplete="email"
              required
              id="email"
            />
          </fieldset>
          <div className="body-text flex flex-col md:flex-row mb-4 mt-2 md:mb-8 md:pt-2">
            <label htmlFor="subject-tech" className="cursor-pointer md:mr-10">
              <input
                type="radio"
                checked={subject === `tech`}
                id="subject-tech"
                className="sr-only"
                onChange={() => setSubject(`tech`)}
              />
              <Dual.Span
                className={cx(
                  `before:inline-block before:w-[13px] before:h-[13px] before:bg-flgray-400 before:text-flgray-400 before:mr-2 before:rounded-full before:translate-y-[1px] before:transition-colors before:duration-500 checked:before:bg-flprimary`,
                  subject === `tech` ? `before:bg-flprimary` : `before:bg-flgray-400`,
                )}
              >
                <>Website / technical questions</>
                <>Sitio Web / Preguntas técnicas</>
              </Dual.Span>
            </label>
            <label htmlFor="subject-other" className="cursor-pointer">
              <input
                type="radio"
                checked={subject === `other`}
                onChange={() => setSubject(`other`)}
                id="subject-other"
                className="sr-only"
              />
              <Dual.Span
                className={cx(
                  `before:inline-block before:w-[13px] before:h-[13px] before:bg-flgray-400 before:mr-2 before:rounded-full before:translate-y-[1px] before:transition-colors before:duration-500`,
                  subject === `other` ? `before:bg-flprimary` : `before:bg-flgray-400`,
                )}
              >
                <>All other subjects</>
                <>Cualquier otro asunto</>
              </Dual.Span>
            </label>
          </div>
          <fieldset>
            <Label htmlFor="message">{t`Message`}</Label>
            <textarea
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={cx(INPUT_CLASSES, `min-h-[10rem]`)}
              name="message"
              id="message"
            ></textarea>
          </fieldset>
          <Turnstile
            sitekey={TURNSTILE_SITE_KEY}
            size="invisible"
            refreshExpired="auto"
            onVerify={setTurnstileToken}
          />
          <Button
            className="my-2"
            style={{ maxWidth: `16rem` }}
            width="100%"
            disabled={state === `submitting`}
          >
            {state === `submitting` ? `${t`Submitting`}...` : t`Submit`}
          </Button>
        </form>
      </div>
    </div>
  </NextBgImage>
);

export default ContactForm;

const Label: React.FC<{ children: React.ReactNode; htmlFor: string }> = ({
  htmlFor,
  children,
}) => (
  <label
    htmlFor={htmlFor}
    className="sans-wide text-flgray-500 text-xl antialiased mb-2 md:mb-4 inline-block"
  >
    {children}
  </label>
);

const INPUT_CLASSES = `border border-gray-500 py-2 px-4 mb-6 block w-full body-text subtle-focus`;
const fallbackEmail = `jared+friends-library-contact@netrivet.com`;
