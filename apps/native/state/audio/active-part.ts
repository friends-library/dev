import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EditionId } from '../../types';

export type ActivePartState = Record<EditionId, number | null | undefined>;

export const initialState: ActivePartState = {};

const activePart = createSlice({
  name: `activePart`,
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ editionId: EditionId; partIndex: number }>) => {
      const { editionId, partIndex } = action.payload;
      state[editionId] = partIndex;
    },
  },
});

export const { set } = activePart.actions;

export default activePart.reducer;
