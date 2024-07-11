import cx from 'classnames';
import { CheckIcon, XIcon } from 'lucide-react';
import { t } from '@friends-library/locale';
import NextBgImage from 'next-bg-image';
import Link from 'next/link';
import Dual from '../core/Dual';
import NarrowPathImg from '@/public/images/narrow-path.jpg';

interface Props {
  result: 'success' | 'failure';
}

const ConfirmationPage: React.FC<Props> = ({ result }) => (
  <NextBgImage
    eager
    minImageWidth={2600}
    className="px-4 sm:px-12 py-20 sm:py-28 md:px-24 flex flex-col items-center justify-center grow"
    src={[
      `radial-gradient(rgba(0, 0, 0, 0.525), rgba(0, 0, 0, 0.885) 55%)`,
      { ...NarrowPathImg, optimize: false },
    ]}
  >
    <section className="px-4 sm:px-16 lg:px-20 py-12 sm:py-36 flex items-center justify-center relative overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div
            className={cx(
              `w-12 h-12 rounded-full flex justify-center items-center relative relative`,
              result === `success` ? `bg-flprimary-400` : `bg-rose-700`,
            )}
          >
            {result === `failure` ? (
              <XIcon className="text-black/80 relative" size={30} strokeWidth={3} />
            ) : (
              <CheckIcon
                className="text-black relative translate-y-px"
                size={30}
                strokeWidth={3}
              />
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl text-center text-white font-bold tracking-wider relative">
            {result === `success` ? (
              <Dual.Frag>
                <>Email confirmed</>
                <>Email confirmido!</>
              </Dual.Frag>
            ) : (
              <Dual.Frag>
                <>Whoops!</>
                <>Email confirmido!</>
              </Dual.Frag>
            )}
          </h1>
        </div>
        <p className="text-xl sm:text-2xl font-serif antialiased text-slate-200 max-w-xl text-center mt-6 relative">
          {result === `success` ? (
            <Dual.Frag>
              <>
                Your first Narrow Path email should arrive within a few minutes. Take a
                moment to make sure it didn’t go to your spam folder, and consider adding
                the address{` `}
                <span className="whitespace-nowrap border-b border-dotted border-white/50">
                  narrow-path@friendslibrary.com
                </span>
                {` `}
                to your contacts to make sure you don’t miss any future emails.
              </>
              <>TODO</>
            </Dual.Frag>
          ) : (
            <Dual.Frag>
              <>
                Sorry, something went wrong and we weren’t able to confirm your email
                address. Please try again, and if the problem persists,{` `}
                <Link href={t`/contact`} className="underline">
                  contact us
                </Link>
                .
              </>
              <>Email confirmido!</>
            </Dual.Frag>
          )}
        </p>
      </div>
    </section>
  </NextBgImage>
);

export default ConfirmationPage;
