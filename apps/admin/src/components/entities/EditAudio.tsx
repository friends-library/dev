import React, { useState } from 'react';
import { ExclamationIcon, CheckCircleIcon } from '@heroicons/react/solid';
import type { ReducerReplace } from '../../types';
import LabeledSelect from '../LabeledSelect';
import LabeledToggle from '../LabeledToggle';
import TextInput from '../TextInput';
import * as empty from '../../lib/empty';
import { type T } from '../../api-client';
import NestedCollection from './NestedCollection';
import * as nonEmptyIntArray from './non-empty-int-array';

interface AudioProps {
  audio: T.EditableAudio;
  replace: ReducerReplace;
}

export const EditAudio: React.FC<AudioProps> = ({ audio, replace }) => (
  <div className="bg-white rounded-lg pt-2 pb-3 px-3">
    <label className="label pb-2">Audio:</label>
    <div className="flex space-x-4 pl-4">
      <LabeledSelect
        label="Reader:"
        className="flex-grow"
        selected={audio.reader}
        setSelected={replace(`reader`)}
        options={[
          [`Jessie Henderson`, `Jessie Henderson`],
          [`Jason R. Henderson`, `Jason R. Henderson`],
          [`Keren Alvaredo`, `Keren Alvaredo`],
          [`Josué Rodriguez`, `Josué Rodriguez`],
          [`Jared Henderson`, `Jared Henderson`],
          [`Ryan McMaster`, `Ryan McMaster`],
          [`Lilly Costa and Kristi Ensminger`, `Lilly Costa and Kristi Ensminger`],
        ]}
      />
      <LabeledToggle
        label="Incomplete:"
        enabled={audio.isIncomplete}
        setEnabled={replace(`isIncomplete`)}
      />
      <div className="w-[25%] items-center justify-center flex">
        <div className="flex items-center mt-6">
          {audio.m4bSizeHq === 0 ? (
            <>
              <ExclamationIcon className="text-gray-400 mr-1.5 w-[19px] h-[19px]" />
              <span className="text-sm font-light text-gray-500">Not published</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="text-flprimary mr-1.5 w-[19px] h-[19px]" />
              <span className="label">Published</span>
            </>
          )}
        </div>
      </div>
    </div>
    <NestedCollection
      label="Part"
      items={audio.parts}
      onAdd={() => replace(`parts`)([...audio.parts].concat(empty.audioPart(audio)))}
      onDelete={(index) => {
        const parts = [...audio.parts.filter((_, partIndex) => index !== partIndex)];
        replace(`parts`)(parts);
      }}
      renderItem={(item, index) => (
        <EditAudioPart
          part={item}
          siblingTitles={audio.parts
            .filter((_, partIndex) => partIndex !== index)
            .map((sibling) => sibling.title)}
          replace={(path, preprocess) => replace(`parts[${index}].${path}`, preprocess)}
        />
      )}
    />
  </div>
);

interface AudioPartProps {
  part: T.EditableAudioPart;
  siblingTitles: string[];
  replace: ReducerReplace;
}

export const EditAudioPart: React.FC<AudioPartProps> = ({
  part,
  siblingTitles,
  replace,
}) => {
  const [chapters, setChapters] = useState(JSON.stringify(part.chapters));
  const updateChapters = nonEmptyIntArray.makeUpdater(setChapters, replace(`chapters`));
  return (
    <div className="flex space-x-4">
      <TextInput
        label="Title:"
        type="text"
        className="w-[75%]"
        value={part.title}
        isValid={(input) => input.trim() !== `` && !siblingTitles.includes(input)}
        invalidMessage="Title must be non-empty and unique within the audio."
        onChange={replace(`title`)}
      />
      <TextInput
        type="text"
        label="Chapters:"
        value={chapters}
        isValid={nonEmptyIntArray.makeValidator({ canBeNull: false })}
        onChange={updateChapters}
      />
      <TextInput
        type="number"
        label="Order:"
        className="w-1/6"
        value={String(part.order)}
        isValid={(input) => Number.isInteger(Number(input))}
        onChange={replace(`order`, Number)}
      />
    </div>
  );
};
