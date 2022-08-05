import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  ethereum: {},
  klaytn: {},
  solana: {},
  binance: {},
};

const slice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // WALLET ACTIVE
    setActivatingConnector(state, action) {
      state.activatingConnector = action.payload;
    },

    setKlaytn(state, action) {
      state.klaytn = action.payload;
    },

    setSolana(state, action) {
      state.solana = action.payload;
    },

    setEthereum(state, action) {
      state.ethereum = action.payload;
    },

    setBinance(state, action) {
      state.binance = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, setActivatingConnector, setKlaytn, setSolana, setEthereum, setBinance } =
  slice.actions;

// ----------------------------------------------------------------------

// export function getWalletBalance(account, library) {
//   return async (dispatch) => {
//     try {
//       if (!!account && !!library) {
//         library
//           .getBalance(account)
//           .then((balance) => {
//             dispatch(slice.actions.setBalance(balance));
//             dispatch(slice.actions.setAccount(account));
//           })
//           .catch(() => {
//             dispatch(slice.actions.setBalance(null));
//             dispatch(slice.actions.setAccount(null));
//           });
//       }
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//       console.log(error);
//     }
//   };
// }
