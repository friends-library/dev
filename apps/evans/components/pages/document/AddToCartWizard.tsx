import React from 'react';
import type { EditionType } from '@friends-library/types';
import ChoiceWizard from './ChoiceWizard';
import ChooseEdition from './ChooseEdition';

interface Props {
  editions: EditionType[];
  onSelect(edition: EditionType): unknown;
  top?: number;
  left?: number;
}

const AddToCartWizard: React.FC<Props> = ({ editions, onSelect, top, left }) => (
  <ChoiceWizard top={top} left={left}>
    <ChooseEdition editions={editions} onSelect={onSelect} />
  </ChoiceWizard>
);

export default AddToCartWizard;
