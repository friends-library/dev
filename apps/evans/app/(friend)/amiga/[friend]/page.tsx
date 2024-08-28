import React from 'react';
import { notFound } from 'next/navigation';
import type { NextPage, Metadata } from 'next';
import type { Params } from '@/lib/types';
import FriendPage, { queryFriend, metadata } from '../../FriendPage';
import { LANG } from '@/lib/env';
import api from '@/lib/ssg/api-client';

type Path = { friend: string };

export async function generateStaticParams(): Promise<Path[]> {
  if (LANG === `en`) return [];
  const slugs = await api.publishedFriendSlugs({ lang: `es`, gender: `female` });
  return slugs.map((friend_slug) => ({ friend: friend_slug }));
}

const Page: NextPage<Params<Path>> = async (props) => {
  if (LANG === `en`) notFound();
  const friend = await queryFriend(props.params.friend);
  if (friend.gender !== `female`) notFound();
  return <FriendPage {...friend} />;
};

export async function generateMetadata(props: Params<Path>): Promise<Metadata> {
  return metadata(props.params.friend);
}

export default Page;
export const revalidate = 10800; // 3 hours
export const dynamicParams = false;
