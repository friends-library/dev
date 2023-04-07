import React from 'react';

interface Props {
  name: string;
  gender: 'male' | 'female' | 'mixed';
}

const FriendTest: React.FC<Props> = ({ name, gender }) => (
  <ul>
    Friend <code className="bg-flprimary text-white">{name}</code> is a{` `}
    <code>{gender}</code>
  </ul>
);

export default FriendTest;
