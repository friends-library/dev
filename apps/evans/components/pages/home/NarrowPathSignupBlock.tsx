import React, { useState } from 'react';
import cx from 'classnames';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Loader2Icon } from 'lucide-react';
import EvansClient from '@friends-library/pairql/evans';
import NextBgImage from 'next-bg-image';
import { LANG } from '@/lib/env';
import Heading from '@/components/core/Heading';
import NarrowPathImg from '@/public/images/narrow-path.jpg';

type Status = `idle` | `loading` | `success` | `error`;

const NarrowPathSignupBlock: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState(``);
  const [mixedQuotes, setMixedQuotes] = useState(false);
  const [status, setStatus] = useState<Status>(`idle`);

  return (
    <NextBgImage
      lazyLoad
      minImageWidth={2600}
      position="0 0"
      className="px-10 sm:px-16 py-20 sm:py-28 md:px-32 flex flex-col items-center justify-center"
      src={[
        `radial-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.855) 55%)`,
        { ...NarrowPathImg, optimize: false },
      ]}
    >
      <Heading darkBg className="text-white">
        The Narrow Path
      </Heading>
      <div className="max-w-[500px]">
        <p className="body-text text-white text-xl leading-8 text-center mt-4 mb-12 sm:mb-20">
          Enter your email address to receive an edifying daily quote from an early Quaker
          delivered right to your inbox.
        </p>
        <div className="relative w-full flex flex-col items-center">
          <Messages status={status} />
          <form
            className={cx(
              `flex flex-col items-center gap-6 transition-[transform,opacity] duration-300 relative`,
              status === `loading` || status === `idle`
                ? `scale-100`
                : `scale-90 opacity-0 pointer-events-none`,
            )}
            onSubmit={async (event) => {
              setStatus(`loading`);
              event.preventDefault();
              const client = EvansClient.web(window.location.href, () => undefined);
              const result = await client.subscribeToNarrowPath({
                lang: LANG,
                email: emailAddress,
                mixedQuotes: mixedQuotes,
              });
              setStatus(result.isError ? `error` : `success`);
            }}
          >
            <div className="flex items-center shadow-2xl">
              <input
                className="text-2xl font-[Arial] antialiased transition-colors px-6 py-4 rounded-l-lg [@media(max-width:420px)]:w-[280px] w-[320px] sm:w-[400px] outline-none bg-white/70 focus:bg-white/100 placeholder-slate-100/50 focus:placeholder-slate-300"
                placeholder="Your email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
                type="email"
              />
              <button
                type="submit"
                disabled={status === `loading`}
                className="h-16 w-16 sm:w-24 bg-flprimary text-white rounded-r-lg flex items-center justify-center group hover:bg-flprimary-800 transition-colors duration-300"
              >
                <Loader2Icon
                  strokeWidth={3}
                  size={30}
                  className={cx(`animate-spin`, status !== `loading` && `hidden`)}
                />
                <ChevronRightIcon
                  className={cx(
                    `w-9 h-9 group-hover:translate-x-1 transition-transform duration-300`,
                    status === `loading` && `hidden`,
                  )}
                  strokeWidth={2.5}
                />
              </button>
            </div>
            <div
              className="px-1 flex items-center gap-3 group cursor-pointer items-stretch"
              onClick={() => setMixedQuotes(!mixedQuotes)}
              tabIndex={0}
            >
              <div
                className={cx(
                  `w-3.5 h-3.5 mt-0.5 bg-white border border-white group-hover:border-black transition-colors duration-200 flex items-center justify-center`,
                  mixedQuotes
                    ? `!bg-flprimary !border-flprimary opacity-100`
                    : `opacity-50`,
                )}
              >
                <CheckIcon
                  className={cx(
                    `text-white w-3 transition-transform duration-200`,
                    !mixedQuotes && `scale-0`,
                  )}
                  strokeWidth={4}
                />
              </div>
              <span
                className={cx(
                  `text-white/50 antialiased leading-[1.125rem] group-hover:text-white transition-colors duration-200`,
                  mixedQuotes && `!text-white`,
                )}
              >
                Include occasional quotes from like-minded non-Quakers
              </span>
            </div>
          </form>
        </div>
      </div>
    </NextBgImage>
  );
};

export default NarrowPathSignupBlock;

const Messages: React.FC<{ status: Status }> = ({ status }) => (
  <>
    <div
      className={cx(
        `py-3 sm:py-5 px-8 sm:px-12 rounded-full bg-red-200/70 backdrop-blur-lg text-center absolute transition-[transform,opacity,filter] duration-300 delay-300`,
        status === `error`
          ? `scale-100 opacity-90`
          : `scale-110 opacity-0 blur-xl pointer-events-none`,
      )}
    >
      <span className="text-lg sm:text-xl text-red-800 leading-3 sm:leading-4">
        Sorry, something went wrong. Please try again.
      </span>
    </div>
    <div
      className={cx(
        `py-3 sm:py-5 px-8 sm:px-12 rounded-full bg-green-200/70 backdrop-blur-lg text-center absolute transition-[transform,opacity,filter] duration-300 delay-300`,
        status === `success`
          ? `scale-100 opacity-90`
          : `scale-110 opacity-0 blur-xl pointer-events-none`,
      )}
    >
      <span className="text-lg sm:text-xl text-green-800 leading-3 sm:leading-4">
        Check your email for a confirmation link!
      </span>
    </div>
  </>
);
