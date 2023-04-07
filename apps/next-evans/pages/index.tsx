import React from 'react';
import { PrismaClient } from '@prisma/client';
import type { GetStaticProps } from 'next';
import FriendTest from '@/components/FriendTest';

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();
  const friends = await prisma.friends.findMany();
  return {
    props: {
      friends: friends.map((friend) => ({
        name: friend.name,
        gender: friend.gender,
      })),
    },
  };
};

const Home: React.FC<{
  friends: Array<{ id: string; name: string; gender: 'male' | 'female' | 'mixed' }>;
}> = ({ friends }) => (
  <div>
    <h1 className="bg-flprimary text-white">
      Home, lang is <code className="text-red-700">{process.env.NEXT_PUBLIC_LANG}</code>
    </h1>
    <ul>
      {friends.map((friend) => (
        <FriendTest key={friend.id} name={friend.name} gender={friend.gender} />
      ))}
    </ul>
  </div>
);

export default Home;
