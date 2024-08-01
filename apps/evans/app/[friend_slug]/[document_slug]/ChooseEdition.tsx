import React from 'react';
import { Diamonds } from '@friends-library/cover-component';
import Link from 'next/link';
import type { EditionType } from '@friends-library/types';
import ChoiceStep from './ChoiceStep';
import ChoiceItem from './ChoiceItem';

interface Props {
  editions: EditionType[];
  onSelect: (selected: EditionType) => any;
}

const ChooseEdition: React.FC<Props> = ({ editions, onSelect }) => (
  <ChoiceStep title="Choose an Edition">
    {editions.includes(`updated`) && (
      <ChoiceItem
        label="Updated"
        description="Our most readable edition"
        onChoose={() => onSelect(`updated`)}
        recommended
        Icon={Diamonds.updated}
      />
    )}
    {editions.includes(`modernized`) && (
      <ChoiceItem
        label="Modern"
        description="Modern grammar and vocabulary"
        recommended={!editions.includes(`updated`)}
        onChoose={() => onSelect(`modernized`)}
        Icon={Diamonds.modernized}
      />
    )}
    {editions.includes(`original`) && (
      <ChoiceItem
        label="Original"
        description="Original grammar and vocabulary"
        onChoose={() => onSelect(`original`)}
        Icon={Diamonds.original}
      />
    )}
    <div className="flex flex-col items-center pb-2">
      <Link
        href="/editions"
        className="inline-block pb-1 mt-8 opacity-75 !border-b-4 !border-solid !border-flblue-700"
      >
        Learn more about editions
      </Link>
    </div>
  </ChoiceStep>
);

export default ChooseEdition;
