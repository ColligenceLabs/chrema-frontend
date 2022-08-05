import { combineReducers } from 'redux';
import CustomizerReducer from './customizer/CustomizerReducer';
import authReducer from './slices/auth';
import messageReducer from './slices/message';
import wallet from './slices/wallet';
import wallets from './slices/wallets';
import nft from './slices/nft';

const RootReducers = combineReducers({
  CustomizerReducer,
  wallet,
  wallets,
  auth: authReducer,
  message: messageReducer,
  nft,
});

export default RootReducers;
