import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, rootSaga } from 'store';
import { userType } from 'store/apis/user';
import { userActions } from 'store/slices/user';
import App from 'App';

const loadUser = () => {
  try {
    store.dispatch(userActions.token());
    const userData = localStorage.getItem('user');
    const user: userType = userData ? JSON.parse(userData) : null;
    store.dispatch(userActions.setUser(user));
    store.dispatch(userActions.check());
  } catch (e) {
    console.log('localStorage is not working.', e);
  }
};

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
  devTools: process.env.REACT_APP_MODE === 'development',
});
sagaMiddleware.run(rootSaga);
loadUser();
document.getElementById('root')?.setAttribute('spellcheck', 'false');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

export type RootState = ReturnType<typeof rootReducer>;
