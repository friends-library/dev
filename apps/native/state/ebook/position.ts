import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EditionId } from '../../types';

export type EbookPositionState = Record<EditionId, number | undefined>;

export const initialState: EbookPositionState = {};

const ebookPosition = createSlice({
  name: `ebookPosition`,
  initialState,
  reducers: {
    setEbookPosition: (
      state,
      action: PayloadAction<{ editionId: EditionId; position: number }>,
    ) => {
      const { editionId, position } = action.payload;
      state[editionId] = position;
    },
  },
});

export const { setEbookPosition } = ebookPosition.actions;

export default ebookPosition.reducer;
