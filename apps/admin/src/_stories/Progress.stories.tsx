import React from 'react';
import { Story, StoryGroup, StoryMeta } from '@htc-class/storylite';
import Progress from '../components/Progress';
import { EditableEntity, EntityOperation } from '../types';

const ProgressStories: React.FC = () => (
  <StoryGroup>
    <Story title="Default">
      <Progress
        items={[
          { operation: op(`create`, `Friend`), status: `succeeded` },
          { operation: op(`create`, `Document`), status: `rolling back` },
          { operation: op(`update`, `Edition`), status: `rollback succeeded` },
          { operation: op(`update`, `Edition`), status: `in flight` },
          { operation: op(`delete`, `FriendResidence`), status: `rollback failed` },
          { operation: op(`create`, `Isbn`), status: `not started` },
          { operation: op(`update`, `Edition`), status: `not started` },
          { operation: op(`update`, `Edition`), status: `failed` },
        ]}
      />
    </Story>
  </StoryGroup>
);

const meta: StoryMeta = {
  name: `<Progress />`,
  component: ProgressStories,
  layout: `padded`,
};

export default meta;

function op(type: EntityOperation['type'], entityTypeName: string): EntityOperation {
  const entity = { __typename: entityTypeName } as EditableEntity;
  switch (type) {
    case `create`:
    case `delete`:
      return { type, entity };
    case `update`:
      return { type, current: entity, previous: entity };
    case `noop`:
      return { type };
  }
}
