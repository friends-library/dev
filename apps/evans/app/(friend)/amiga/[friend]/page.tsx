import React from 'react';
import type { NextPage, Metadata } from 'next';
import FriendPage, { queryFriend, metadata } from '../../FriendPage';
import { LANG } from '@/lib/env';
import api from '@/lib/ssg/api-client';

interface Props {
  params: { friend: string };
}

export async function generateStaticParams(): Promise<Array<{ friend: string }>> {
  if (LANG === `en`) return [];
  const slugs = await api.publishedFriendSlugs({ lang: `es`, gender: `female` });
  return slugs.map((friend_slug) => ({ friend: friend_slug }));
}

const Page: NextPage<Props> = async (props) => {
  const slug = props.params.friend;
  const friend = await queryFriend(slug);
  return <FriendPage {...friend} />;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  return metadata(props.params.friend);
}

export default Page;
export const revalidate = 10800; // 3 hours
