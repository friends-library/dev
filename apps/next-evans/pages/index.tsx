import React from 'react';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import cx from 'classnames';
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
