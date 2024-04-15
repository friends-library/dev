import React from 'react';
import { t } from '@friends-library/locale';
import type { NextPage, Metadata } from 'next';
import ExploreFriends from './ExploreFriends';
import FriendsPageHero from './FriendsPageHero';
import FriendCard from './FriendCard';
import CompilationsBlock from '@/components/blocks/CompilationsBlock';
import { getFriendUrl } from '@/lib/friend';
import { newestFirst } from '@/lib/dates';
import { LANG } from '@/lib/env';
import api from '@/lib/ssg/api-client';
import * as seo from '@/lib/seo';

const Page: NextPage = async () => {
  const friends = await api.friendsPage(LANG);
  const mostRecentFriends = friends.sort(newestFirst).slice(0, 2);
  return (
    <div>
      <FriendsPageHero numFriends={friends.length} />
      <section className="pt-10 pb-20 sm:px-24 md:px-16 lg:px-32 xl:px-0 xl:pt-20 xl:pb-24">
        <h2 className="text-center pb-8 sans-wider text-2xl px-8">{t`Recently Added Authors`}</h2>
        <div className="flex flex-col xl:flex-row justify-center xl:items-center space-y-16 xl:space-y-0 xl:space-x-12">
          {mostRecentFriends.map((friend, i) => (
            <FriendCard
              gender={friend.gender === `mixed` ? `male` : friend.gender}
              name={friend.name}
              region={`${friend.primaryResidence.city}, ${friend.primaryResidence.region}`}
              numBooks={friend.numBooks}
              featured
              born={friend.born}
              died={friend.died}
              url={getFriendUrl(friend.slug, friend.gender)}
              color={i === 0 ? `blue` : `green`}
              className="xl:w-1/2 xl:max-w-screen-sm"
              key={friend.slug}
            />
          ))}
        </div>
      </section>
      <ExploreFriends friends={friends} />
      <CompilationsBlock />
    </div>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const friends = await api.friendsPage(LANG);
  return seo.nextMetadata(
    t`All Friends`,
    seo.pageMetaDesc(`friends`, {
      numFriends: friends.length,
    }),
  );
}

export default Page;
export const revalidate = 10800; // 3 hours
