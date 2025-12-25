import React, { useState, useEffect } from 'react';
import type { EditionType } from '@friends-library/types';
import ChoiceWizard from './ChoiceWizard';
import ChooseEdition from './ChooseEdition';
import ChooseFormat from './ChooseFormat';
import Downloading from './Downloading';

export type DownloadType = `pdf` | `epub` | `speech`;

interface Props {
  editions: EditionType[];
  onSelect(edition: EditionType, type: DownloadType): unknown;
  top?: number;
  left?: number;
}

const DownloadWizard: React.FC<Props> = ({ editions, onSelect, top, left }) => {
  const initialEdition = editions.length === 1 ? editions[0] : undefined;
  const [edition, setEdition] = useState<EditionType | undefined>(initialEdition);
  const [format, setFormat] = useState<`epub` | `pdf` | `speech` | undefined>();
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const selectionComplete = edition && format;

  useEffect(() => {
    if (selectionComplete && !downloaded) {
      setDownloaded(true);
      onSelect(edition || `updated`, format);
    }
  }, [edition, format, downloaded, onSelect, selectionComplete]);

  return (
    <ChoiceWizard top={top} left={left}>
      {edition === undefined && (
        <ChooseEdition editions={editions} onSelect={setEdition} />
      )}
      {edition && !format && <ChooseFormat onChoose={setFormat} />}
      {selectionComplete && <Downloading />}
    </ChoiceWizard>
  );
};

export default DownloadWizard;
