import React from 'react';
import type { NextPage, Metadata } from 'next';
import type { Params } from '@/lib/types';
import FriendPage, { queryFriend, metadata } from '../../FriendPage';
import { LANG } from '@/lib/env';
import api from '@/lib/ssg/api-client';

type Path = { friend: string };

export async function generateStaticParams(): Promise<Path[]> {
  if (LANG === `es`) return [];
  const slugs = await api.publishedFriendSlugs({ lang: `en` });
  return slugs.map((friend_slug) => ({ friend: friend_slug }));
}

const Page: NextPage<Params<Path>> = async (props) => {
  const slug = props.params.friend;
  const friend = await queryFriend(slug);
  return <FriendPage {...friend} />;
};

export async function generateMetadata(props: Params<Path>): Promise<Metadata> {
  return metadata(props.params.friend);
}

export default Page;
export const revalidate = 10800; // 3 hours
export const dynamicParams = false;
