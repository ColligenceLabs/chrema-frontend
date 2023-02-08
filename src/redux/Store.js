import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import RootReducers from './Rootreducers';

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(thunk)
    : composeWithDevTools(applyMiddleware(thunk));

export function configureStore(InitialState) {
  const Store = createStore(RootReducers, InitialState, devTools);
  return Store;
}
