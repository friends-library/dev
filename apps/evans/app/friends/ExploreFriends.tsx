'use client';

import React, { useState } from 'react';
import FriendCard from './FriendCard';
import ControlsBlock from './ControlsBlock';
import { getFriendUrl } from '@/lib/friend';
import { makeScroller } from '@/lib/scroll';
import { type Api } from '@/lib/ssg/api-client';

type Friend = Api.FriendsPage.Output[number];

interface Props {
  friends: Friend[];
}

const ExploreFriends: React.FC<Props> = ({ friends }) => {
  const [searchQuery, setSearchQuery] = useState<string>(``);
  const [sortOption, setSortOption] = useState<string>(`First Name`);
  const filteredFriends = friends
    .sort(makeSorter(sortOption))
    .filter(makeFilter(searchQuery, sortOption));

  return (
    <>
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
    </>
  );
};

export default ExploreFriends;

export const ControlsLink: React.FC<{ children: string }> = ({ children }) => (
  <a
    href="#ControlsBlock"
    className="underline"
    onClick={(e) => {
      e.preventDefault();
      makeScroller(`#ControlsBlock`)();
    }}
  >
    {children}
  </a>
);

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
