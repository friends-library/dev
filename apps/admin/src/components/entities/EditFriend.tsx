import React, { useReducer } from 'react';
import isEqual from 'lodash.isequal';
import { useParams } from 'react-router-dom';
import type { Reducer, ReducerReplace } from '../../types';
import { useQuery } from '../../lib/query';
import TextInput from '../TextInput';
import LabeledSelect from '../LabeledSelect';
import reducer, { isValidYear } from '../../lib/reducer';
import * as empty from '../../lib/empty';
import SaveChangesBar from '../SaveChangesBar';
import LabeledToggle from '../LabeledToggle';
import api, { type T } from '../../api-client';
import * as sort from './sort';
import { EditDocument } from './EditDocument';
import NestedCollection from './NestedCollection';

interface Props {
  friend: T.EditableFriend;
  selectableDocuments: T.SelectableDocument[];
}

export const EditFriend: React.FC<Props> = ({
  friend: initialFriend,
  selectableDocuments,
}) => {
  const [friend, dispatch] = useReducer<Reducer<T.EditableFriend>>(
    reducer,
    initialFriend,
  );
  const replace: ReducerReplace = (path, preprocess) => (value) =>
    dispatch({
      type: `replace_value`,
      at: path,
      with: preprocess ? preprocess(value) : value,
    });
  const deleteFrom: (path: string) => (index: number) => unknown = (path) => (index) =>
    dispatch({ type: `delete_item`, at: `${path}[${index}]` });
  return (
    <div className="mt-6 space-y-4 mb-24">
      <SaveChangesBar
        entityName="Friend"
        disabled={isEqual(friend, initialFriend)}
        getEntities={() => [
          { case: `friend`, entity: friend },
          { case: `friend`, entity: initialFriend },
        ]}
      />
      <div className="flex space-x-4">
        {friend.id.startsWith(`_`) && (
          <LabeledSelect
            label="Lanugage"
            selected={friend.lang}
            setSelected={replace(`lang`)}
            options={[
              [`en`, `English`],
              [`es`, `Spanish`],
            ]}
          />
        )}
        <TextInput
          type="text"
          label="Name:"
          isValid={(name) => name.length > 5 && !!name.match(/^[A-Z].* [A-Z].*/)}
          invalidMessage="min length 5, first + last at least"
          value={friend.name}
          onChange={replace(`name`)}
          className="flex-grow"
        />
        <TextInput
          type="text"
          label="Slug:"
          isValid={(slug) => slug.length > 5 && !!slug.match(/^([a-z-]+)$/)}
          invalidMessage="min length 5, only lowercase letters and dashes"
          value={friend.slug}
          onChange={replace(`slug`)}
          className="flex-grow"
        />
      </div>
      <div className="flex space-x-4">
        <LabeledSelect
          label="Gender:"
          selected={friend.gender}
          setSelected={replace(`gender`)}
          options={[
            [`male`, `male`],
            [`female`, `female`],
            [`mixed`, `mixed (compilations)`],
          ]}
          className="w-1/2"
        />
        <div className="flex w-1/2 space-x-4">
          <TextInput
            type="number"
            label="Born:"
            isValid={isValidYear}
            value={friend.born === undefined ? `` : String(friend.born)}
            onChange={(year) => dispatch({ type: `update_year`, at: `born`, with: year })}
            className="w-1/2"
          />
          <TextInput
            type="number"
            label="Died:"
            isValid={isValidYear}
            value={friend.died === undefined ? `` : String(friend.died)}
            onChange={(year) => dispatch({ type: `update_year`, at: `died`, with: year })}
            className="w-1/2"
          />
          <LabeledToggle
            label="Published:"
            enabled={friend.published !== undefined}
            setEnabled={(enabled) =>
              replace(`published`)(
                enabled ? initialFriend.published ?? new Date().toISOString() : undefined,
              )
            }
          />
        </div>
      </div>
      <TextInput
        type="textarea"
        label="Description:"
        value={friend.description}
        onChange={replace(`description`)}
      />
      <NestedCollection
        label="Residence"
        items={friend.residences}
        onAdd={() =>
          dispatch({
            type: `add_item`,
            at: `residences`,
            value: empty.friendResidence(friend.id),
          })
        }
        onDelete={deleteFrom(`residences`)}
        renderItem={(residence, residenceIndex) => (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <TextInput
                type="text"
                label="City:"
                className="w-2/3"
                value={residence.city}
                onChange={replace(`residences[${residenceIndex}].city`)}
              />
              <LabeledSelect
                label="Region"
                className="w-1/3"
                selected={residence.region}
                setSelected={replace(`residences[${residenceIndex}].region`)}
                options={[
                  [`England`, `England`],
                  [`Ireland`, `Ireland`],
                  [`Pennsylvania`, `Pennsylvania`],
                  [`Scotland`, `Scotland`],
                  [`Wales`, `Wales`],
                  [`Ohio`, `Ohio`],
                  [`Rhode Island `, `Rhode Island`],
                  [`Netherlands`, `Netherlands`],
                  [`New York`, `New York`],
                  [`Delaware`, `Delaware`],
                  [`New Jersey`, `New Jersey`],
                  [`Russia`, `Russia`],
                  [`France`, `France`],
                  [`Vermont`, `Vermont`],
                ]}
              />
            </div>
            <NestedCollection
              label="Duration"
              items={residence.durations}
              onAdd={() =>
                dispatch({
                  type: `add_item`,
                  at: `residences[${residenceIndex}].durations`,
                  value: empty.friendResidenceDuration(residence.id),
                })
              }
              onDelete={deleteFrom(`residences[${residenceIndex}].durations`)}
              renderItem={(duration, durationIndex) => (
                <div className="flex space-x-4">
                  <TextInput
                    className="w-1/2"
                    type="number"
                    label="Start:"
                    value={String(duration.start)}
                    onChange={replace(
                      `residences[${residenceIndex}].durations[${durationIndex}].start`,
                    )}
                  />
                  <TextInput
                    className="w-1/2"
                    type="number"
                    label="End:"
                    value={String(duration.end)}
                    onChange={replace(
                      `residences[${residenceIndex}].durations[${durationIndex}].end`,
                    )}
                  />
                </div>
              )}
            />
          </div>
        )}
      />
      <NestedCollection
        label="Quote"
        items={friend.quotes}
        onDelete={deleteFrom(`quotes`)}
        onAdd={() =>
          dispatch({
            type: `add_item`,
            at: `quotes`,
            value: empty.friendQuote(friend),
          })
        }
        renderItem={(item, index) => (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <TextInput
                type="text"
                className="flex-grow"
                label="Quote Source:"
                value={item.source}
                onChange={replace(`quotes[${index}].source`)}
              />
              <TextInput
                type="number"
                label="Quote Order:"
                isValid={(input) => Number.isInteger(Number(input))}
                value={String(item.order)}
                onChange={replace(`quotes[${index}].order`, Number)}
              />
            </div>
            <TextInput
              type="textarea"
              textareaSize="h-32"
              label="Quote Text:"
              value={friend.quotes[index]?.text ?? ``}
              onChange={replace(`quotes[${index}].text`)}
            />
          </div>
        )}
      />
      <NestedCollection
        label="Document"
        items={friend.documents}
        onAdd={() =>
          dispatch({
            type: `add_item`,
            at: `documents`,
            value: empty.document(friend),
          })
        }
        onDelete={deleteFrom(`documents`)}
        editLink="/documents/:id"
        renderItem={(item, index) => (
          <EditDocument
            document={item}
            selectableDocuments={selectableDocuments}
            replace={(path) => (value) =>
              dispatch({
                type: `replace_value`,
                at: `documents[${index}].${path}`,
                with: value,
              })
            }
            deleteItem={(subpath) =>
              dispatch({
                type: `delete_item`,
                at: `documents[${index}].${subpath}`,
              })
            }
            addItem={(subpath, item) =>
              dispatch({
                type: `add_item`,
                at: `documents[${index}].${subpath}`,
                value: item,
              })
            }
          />
        )}
      />
    </div>
  );
};

// container

const EditFriendContainer: React.FC = () => {
  const { id = `` } = useParams<{ id: UUID }>();
  const query = useQuery(() => api.editFriend(id));
  if (!query.isResolved) {
    return query.unresolvedElement;
  }
  return (
    <EditFriend
      friend={sort.friend(query.data.friend)}
      selectableDocuments={query.data.selectableDocuments}
    />
  );
};

export default EditFriendContainer;
