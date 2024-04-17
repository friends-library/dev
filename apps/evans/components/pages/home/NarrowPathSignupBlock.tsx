import React, { useState } from 'react';
import cx from 'classnames';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import EvansClient from '@friends-library/pairql/evans';
import { Loader2Icon, XIcon } from 'lucide-react';
import WaveBottomBlock from '../getting-started/WaveBottomBlock';
import { LANG } from '@/lib/env';

const NarrowPathSignupBlock: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState(``);
  const [nonFriendOptIn, setNonFriendOptIn] = useState(false);
  const [status, setStatus] = useState<`idle` | `loading` | `success` | `error`>(`idle`);

  const client = EvansClient.web(`http://localhost:7222`, () => undefined); // TODO: update URL

  return (
    <WaveBottomBlock
      color="blue"
      className="px-20 pt-32 pb-28 flex flex-col items-center justify-center"
      id="narrow-path-signup"
    >
      <h2 className="heading-text text-4xl">Want to recieve a daily lorem ipsum?</h2>
      <p className="body-text text-xl max-w-xl text-center mt-4 mb-44">
        Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint
        consectetur cupidatat.
      </p>
      <div className="relative w-full flex flex-col items-center mb-28">
        <div
          className={cx(
            `p-4 rounded-full bg-red-200/70 backdrop-blur-lg flex items-center gap-8 pr-12 absolute transition-[transform,opacity,filter] duration-300 delay-300`,
            status === `error`
              ? `scale-100`
              : `scale-110 opacity-0 blur-xl pointer-events-none`,
          )}
        >
          <div className="bg-red-500 rounded-full w-16 h-16 flex justify-center items-center">
            <XIcon className="text-white" strokeWidth={3} size={30} />
          </div>
          <span className="text-2xl font-semibold text-red-800">
            Hmm, something went wrong. Please try again.
          </span>
        </div>
        <div
          className={cx(
            `p-4 rounded-full bg-green-200/70 backdrop-blur-lg flex items-center gap-8 pr-12 absolute transition-[transform,opacity,filter] duration-300 delay-300`,
            status === `success`
              ? `scale-100`
              : `scale-110 opacity-0 blur-xl pointer-events-none`,
          )}
        >
          <div className="bg-green-500 rounded-full w-16 h-16 flex justify-center items-center">
            <CheckIcon className="w-8 text-white" strokeWidth={3} />
          </div>
          <span className="text-2xl font-semibold text-green-800">
            Check your email for a verification link!
          </span>
        </div>
        <form
          className={cx(
            `flex flex-col items-center gap-6 transition-[transform,opacity] duration-300 absolute`,
            status === `loading` || status === `idle`
              ? `scale-100`
              : `scale-90 opacity-0 pointer-events-none`,
          )}
          onSubmit={async (event) => {
            setStatus(`loading`);
            event.preventDefault();
            const result = await client.subscribeToNarrowPath({
              lang: LANG,
              email: emailAddress,
              nonFriendQuotesOptIn: nonFriendOptIn,
            });

            if (result.isError) {
              setStatus(`error`);
              return;
            } else {
              setStatus(`success`);
            }
          }}
        >
          <div className="flex items-center shadow-2xl rounded-full">
            <input
              className="text-2xl px-6 py-4 rounded-l-full w-[440px] outline-none"
              placeholder="Your email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              type="email"
            />
            <button
              type="submit"
              className="h-16 w-24 bg-flprimary text-white rounded-r-full flex items-center justify-center group hover:bg-[#5D2132] transition-colors duration-300"
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
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => {
              setNonFriendOptIn(!nonFriendOptIn);
            }}
            tabIndex={0}
          >
            <div
              className={cx(
                `w-4 h-4 bg-white border border-white group-hover:border-black transition-colors duration-200 flex items-center justify-center`,
                nonFriendOptIn && `!bg-flprimary !border-flprimary`,
              )}
            >
              <CheckIcon
                className={cx(
                  `text-white w-3 transition-transform duration-200`,
                  !nonFriendOptIn && `scale-0`,
                )}
                strokeWidth={4}
              />
            </div>
            <span className="text-white/80 group-hover:text-white transition-colors duration-200">
              Also recieve similar writings from non-Friend authors
            </span>
          </div>
        </form>
      </div>
    </WaveBottomBlock>
  );
};

export default NarrowPathSignupBlock;
