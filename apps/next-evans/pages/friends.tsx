import React, { useState } from 'react';
import invariant from 'tiny-invariant';
import { t } from '@friends-library/locale';
import type { GetStaticProps } from 'next';
import type { Friend } from '@/lib/types';
import FriendsPageHero from '@/components/pages/friends/FriendsPageHero';
import FriendCard from '@/components/pages/friends/FriendCard';
import ControlsBlock from '@/components/pages/friends/ControlsBlock';
import CompilationsBlock from '@/components/pages/friends/CompilationsBlock';
import { getFriendUrl, isCompilations } from '@/lib/friend';
import { getAllFriends } from '@/lib/db/friends';
import { primaryResidence } from '@/lib/residences';
import { newestFirst } from '@/lib/dates';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const friends = Object.values(await getAllFriends()).filter(
    (friend) => !isCompilations(friend.name),
  );
  return {
    props: {
      friends: friends.map((friend) => ({
        ...friend,
        documents: null,
        numBooks: friend.documents.length,
      })),
    },
  };
};

type AllFriendsFriendProps = Pick<
  Friend,
  'id' | 'born' | 'died' | 'name' | 'slug' | 'gender' | 'createdAt' | 'residences'
> & { numBooks: number };

interface Props {
  friends: Array<AllFriendsFriendProps>;
}

const Friends: React.FC<Props> = ({ friends }) => {
  const mostRecentFriends = friends
    .sort((a, b) => newestFirst(a.createdAt, b.createdAt))
    .slice(0, 2);

  const [searchQuery, setSearchQuery] = useState<string>(``);
  const [sortOption, setSortOption] = useState<string>(`First Name`);
  const filteredFriends = friends
    .sort(makeSorter(sortOption))
    .filter(makeFilter(searchQuery, sortOption));

  return (
    <div>
      <FriendsPageHero numFriends={friends.length} />
      <section className="sm:px-16 py-16">
        <h2 className="text-center pb-8 sans-wider text-2xl px-8">{t`Recently Added Authors`}</h2>
        <div className="flex flex-col xl:flex-row justify-center xl:items-center space-y-16 xl:space-y-0 xl:space-x-12">
          {mostRecentFriends.map((friend, i) => {
            const residence = primaryResidence(friend.residences);
            return (
              <FriendCard
                gender={friend.gender === `mixed` ? `male` : friend.gender}
                name={friend.name}
                region={
                  residence
                    ? `${residence.city}, ${residence.region}`
                    : `Unknown residence`
                }
                numBooks={friend.numBooks}
                featured
                born={friend.born || undefined}
                died={friend.died || undefined}
                url={getFriendUrl(friend.slug, friend.gender)}
                color={i === 0 ? `blue` : `green`}
                className="xl:w-1/2 xl:max-w-screen-sm"
                key={friend.slug}
              />
            );
          })}
        </div>
      </section>
      <ControlsBlock
        sortOption={sortOption}
        setSortOption={setSortOption}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ul className="bg-flgray-200 flex justify-center flex-row flex-wrap pb-16">
        {filteredFriends.map((friend, i) => {
          const residence = primaryResidence(friend.residences);
          invariant(residence);
          return (
            <FriendCard
              key={friend.slug}
              className="m-8 xl:m-12"
              gender={friend.gender === `mixed` ? `male` : friend.gender}
              name={friend.name}
              region={`${residence.city}, ${residence.region}`}
              numBooks={friend.numBooks}
              url={getFriendUrl(friend.slug, friend.gender)}
              born={friend.born || undefined}
              died={friend.died || undefined}
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
          );
        })}
      </ul>
      <CompilationsBlock />
    </div>
  );
};

export default Friends;

function makeSorter(
  sortOption: string,
): (friendA: AllFriendsFriendProps, friendB: AllFriendsFriendProps) => 1 | 0 | -1 {
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

function makeFilter(
  query: string,
  sortOption: string,
): (friend: AllFriendsFriendProps) => boolean {
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
