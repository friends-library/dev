import React from 'react';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import cx from 'classnames';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { GetStaticProps } from 'next';
import { LANG } from '@/lib/env';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const prisma = new PrismaClient();
  const friends = await prisma.friends.findMany({
    select: { name: true, slug: true, id: true, gender: true },
  });
  return {
    props: {
      friends,
    },
  };
};

interface Props {
  friends: Array<{
    name: string;
    slug: string;
    id: string;
    gender: 'male' | 'female' | 'mixed';
  }>;
}

const Home: React.FC<Props> = ({ friends }) => (
  <div>
    <h1 className="bg-flprimary text-white p-3">
      Home, lang is <code className="text-red-200">{LANG}</code>
    </h1>
    <div className="flex justify-center items-center p-8 bg-slate-400 text-white rounded-b-3xl">
      <Link
        href={LANG === `en` ? `/friends` : `/amigos`}
        className="shadow-md bg-white text-black rounded-full pl-6 pr-4 py-2 font-bold flex items-center hover:scale-105 transition duration-100 active:scale-95"
      >
        All friends
        <ChevronRightIcon className="h-5 ml-4" />
      </Link>
    </div>
    <div className="flex justify-center items-center p-8 border-b">
      <Link
        href="/getting-started"
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-lg hover:bg-indigo-600"
      >
        Getting started
      </Link>
    </div>
    <ul className="bg-gray-50 grid grid-cols-5 gap-4 p-8">
      {friends.map((friend) => (
        <Link
          href={`/${
            LANG === `en` ? `friend` : friend.gender === `male` ? `amigo` : `amiga`
          }/${friend.slug}`}
          className={cx(
            `mt-2 bg-white p-4 shadow-md rounded-xl hover:bg-slate-100`,
            friend.name === `Compilations` && `bg-flprimary/20 hover:bg-flprimary/30`,
          )}
          key={friend.id}
        >
          <h2 className="font-bold">{friend.name}</h2>
          <h3 className="text-flprimary">{friend.gender}</h3>
        </Link>
      ))}
    </ul>
  </div>
);

export default Home;
