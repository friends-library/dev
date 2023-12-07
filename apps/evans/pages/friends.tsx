import React, { useState } from 'react';
import { t } from '@friends-library/locale';
import type { GetStaticProps } from 'next';
import FriendsPageHero from '@/components/pages/friends/FriendsPageHero';
import FriendCard from '@/components/pages/friends/FriendCard';
import ControlsBlock from '@/components/pages/friends/ControlsBlock';
import CompilationsBlock from '@/components/pages/friends/CompilationsBlock';
import { getFriendUrl } from '@/lib/friend';
import { newestFirst } from '@/lib/dates';
import { LANG } from '@/lib/env';
import Seo, { pageMetaDesc } from '@/components/core/Seo';
import api, { type Api } from '@/lib/ssg/api-client';

type Friend = Api.FriendsPage.Output[number];

interface Props {
  friends: Friend[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const friends = await api.friendsPage(LANG);
  return { props: { friends } };
};

const Friends: React.FC<Props> = ({ friends }) => {
  const mostRecentFriends = friends.sort(newestFirst).slice(0, 2);
  const [searchQuery, setSearchQuery] = useState<string>(``);
  const [sortOption, setSortOption] = useState<string>(`First Name`);
  const filteredFriends = friends
    .sort(makeSorter(sortOption))
    .filter(makeFilter(searchQuery, sortOption));

  return (
    <div>
      <Seo
        title={t`All Friends`}
        description={pageMetaDesc(`friends`, { numFriends: friends.length })}
      />
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
      <ControlsBlock
        sortOption={sortOption}
        setSortOption={setSortOption}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ul className="bg-flgray-200 flex justify-center flex-row flex-wrap pb-16">
        {filteredFriends.map((friend, i) => (
          <FriendCard
            key={friend.slug}
            className="w-lg mb-12 mx-4 xl:mx-10"
            gender={friend.gender === `mixed` ? `male` : friend.gender}
            name={friend.name}
            region={`${friend.primaryResidence.city}, ${friend.primaryResidence.region}`}
            numBooks={friend.numBooks}
            url={getFriendUrl(friend.slug, friend.gender)}
            born={friend.born}
            died={friend.died}
            color={(() => {
              switch (i % 4) {
                case 0:
                  return `blue`;
                case 1:
                  return `green`;
                case 2:
                  return `maroon`;
                default:
                  return `gold`;
              }
            })()}
          />
        ))}
      </ul>
      <CompilationsBlock />
    </div>
  );
};

export default Friends;

function makeSorter(
  sortOption: string,
): (friendA: Friend, friendB: Friend) => 1 | 0 | -1 {
  switch (sortOption) {
    case `Death Date`:
      return (a, b) => ((a?.died || 0) < (b?.died || 0) ? -1 : 1);
    case `Birth Date`:
      return (a, b) => ((a?.born || 0) < (b?.born || 0) ? -1 : 1);
    case `Last Name`:
      return (a, b) =>
        (a.name.split(` `).pop() || ``) < (b.name.split(` `).pop() || ``) ? -1 : 1;
    default:
      return (a, b) => (a.name < b.name ? -1 : 1);
  }
}

function makeFilter(query: string, sortOption: string): (friend: Friend) => boolean {
  return (friend) => {
    if (sortOption === `Death Date` && !friend.died) {
      return false;
    }
    if (sortOption === `Birth Date` && !friend.born) {
      return false;
    }
    return (
      query.trim() === `` ||
      friend.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  };
}
