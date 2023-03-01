import { createSlice } from '@reduxjs/toolkit';
import type { EditionType } from '@friends-library/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DocumentId } from '../../types';
import { DocumentEntity } from '../../lib/models';

export type EbookSelectedEditionState = Record<DocumentId, EditionType | undefined>;

export const initialState: EbookSelectedEditionState = {};

const ebookSelectedEdition = createSlice({
  name: `ebookSelectedEdition`,
  initialState,
  reducers: {
    selectEdition: (
      state,
      action: PayloadAction<{ documentId: string; editionType: EditionType }>,
    ) => {
      const { documentId, editionType } = action.payload;
      const document = new DocumentEntity(documentId);
      state[document.stateKey] = editionType;
    },
  },
});

export const { selectEdition } = ebookSelectedEdition.actions;
export default ebookSelectedEdition.reducer;
