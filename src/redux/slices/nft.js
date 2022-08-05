import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  os: null,
  from: null,
  wallet: null,
};

const slice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    // HAS ERROR
    fromNFT(state, action) {
      state.os = action.payload.os;
      state.from = action.payload.from;
      state.wallet = action.payload.wallet;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { fromNFT } = slice.actions;
