'use client';

import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { CheckIcon, XIcon } from 'lucide-react';

interface Props {
  result: 'success' | 'failure';
  action: 'emailConfirmation' | 'unsubscribe';
}

const ConfirmationPage: React.FC<Props> = ({ result, action }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const c = content[action][result];

  return (
    <main>
      <section className="px-20 py-36 flex items-center justify-center relative overflow-hidden">
        <div
          className={cx(
            `h-[200%] w-full bg-gradient-to-b from-white to-white absolute left-0 transition-[top,opacity] duration-700`,
            result === `success` ? `via-green-300` : `via-red-300`,
            !loaded ? `top-[100%]` : `-top-[100%] opacity-0`,
          )}
        />
        <div
          className={cx(
            `flex flex-col items-center transition-[transform,opacity,filter] duration-500 delay-200`,
            !loaded ? `scale-110 opacity-0 blur-2xl` : `scale-100 opacity-100`,
          )}
        >
          <div
            className={cx(
              `w-20 h-20 rounded-full flex justify-center items-center relative relative`,
              result === `success` ? `bg-green-200` : `bg-red-200`,
            )}
          >
            {result === `failure` ? (
              <XIcon className="text-red-800 relative" size={40} strokeWidth={3} />
            ) : (
              <CheckIcon className="text-green-800 relative" size={40} strokeWidth={3} />
            )}
          </div>
          <h1 className="text-5xl font-semibold mt-12 tracking-wider relative">
            {c.title}
          </h1>
          <p className="text-2xl text-flgray-500 max-w-xl text-center mt-6 relative">
            {c.description}
          </p>
        </div>
      </section>
    </main>
  );
};

export default ConfirmationPage;

const content = {
  emailConfirmation: {
    success: {
      title: `Email confirmed!`,
      description: `Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.`,
    },
    failure: {
      title: `Uh oh!`,
      description: `Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.`,
    },
  },
  unsubscribe: {
    success: {
      title: `Unsubscribed`,
      description: `Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.`,
    },
    failure: {
      title: `Uh oh!`,
      description: `Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.`,
    },
  },
};