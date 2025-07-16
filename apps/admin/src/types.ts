import type React from 'react';
import type { PrintSize, Lang } from '@friends-library/types';
import type { T } from './api-client';

export type Action<State> =
  | { type: `replace`; state: State }
  | { type: `add_item`; at: string; value: unknown }
  | { type: `delete_item`; at: string }
  | { type: `replace_value`; at: string; with: unknown }
  | { type: `update_year`; at: string; with: string };

export type Reducer<State> = React.Reducer<State, Action<State>>;

export type ReducerReplace = (
  path: string,
  preprocess?: (newValue: unknown) => unknown,
) => (value: unknown) => unknown;

export type EditableEntity =
  | { case: 'token'; entity: T.EditableToken }
  | { case: 'tokenScope'; entity: T.EditableTokenScope }
  | { case: 'audio'; entity: T.EditableAudio }
  | { case: 'audioPart'; entity: T.EditableAudioPart }
  | { case: 'document'; entity: T.EditableDocument }
  | { case: 'documentTag'; entity: T.EditableDocumentTag }
  | { case: 'edition'; entity: T.EditableEdition }
  | { case: 'friend'; entity: T.EditableFriend }
  | { case: 'friendQuote'; entity: T.EditableFriendQuote }
  | { case: 'friendResidence'; entity: T.EditableFriendResidence }
  | { case: 'friendResidenceDuration'; entity: T.EditableFriendResidenceDuration }
  | { case: 'relatedDocument'; entity: T.EditableRelatedDocument };

export type CreateOperation = {
  type: `create`;
  entity: EditableEntity;
};

export type DeleteOperation = {
  type: `delete`;
  entity: EditableEntity;
};

export type UpdateOperation = {
  type: `update`;
  previous: EditableEntity;
  current: EditableEntity;
};

export type NoopOperation = {
  type: `noop`;
};

export type EntityOperation =
  | CreateOperation
  | DeleteOperation
  | UpdateOperation
  | NoopOperation;

export type EntityOperationStatus =
  | `not started`
  | `in flight`
  | `succeeded`
  | `failed`
  | `rolling back`
  | `rollback succeeded`
  | `rollback failed`;

export type ErrorMsg = string;

export type WorkItem = {
  operation: EntityOperation;
  status: EntityOperationStatus;
};

export type WorkQueue = Array<WorkItem>;

export type Progress = (steps: WorkItem[], error?: string) => unknown;

export type ReducerDeleteFrom = (path: string) => (index: number) => unknown;

export interface OrderItem {
  id: string;
  lang: Lang;
  displayTitle: string;
  orderTitle: string;
  author: string;
  image: string;
  editionId: string;
  unitPrice: number;
  quantity: number;
  printSize: PrintSize;
  volumes: [number, ...number[]];
}

export interface OrderAddress {
  name: string;
  street: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  recipientTaxId?: string | null;
}
