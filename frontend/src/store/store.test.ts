import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootSaga } from 'store';
import * as userAPI from './apis/user';
import { initialState, userSlice } from './slices/user';

const simpleUser = { username: '11111111', nickname: 'abcd', image: 'image.png' };
const loginRequest = {
  username: '11111111',
  password: '11111111',
};
const simpleError = new Error('error!');

describe('Module - index', () => {
  test('saga success', () => {
    return expectSaga(rootSaga)
      .withReducer(userSlice.reducer)
      .provide([[call(userAPI.login, loginRequest), simpleUser]])
      .put({ type: 'user/loginSuccess', payload: simpleUser })
      .dispatch({ type: 'user/login', payload: loginRequest })
      .hasFinalState({
        ...initialState,
        user: simpleUser,
      })
      .silentRun();
  });

  test('saga failure', () => {
    global.alert = jest.fn().mockImplementation(() => null);

    return expectSaga(rootSaga)
      .withReducer(userSlice.reducer)
      .provide([[call(userAPI.login, loginRequest), throwError(simpleError)]])
      .put({ type: 'user/loginFailure', payload: simpleError })
      .dispatch({ type: 'user/login', payload: loginRequest })
      .hasFinalState({
        ...initialState,
        error: simpleError,
      })
      .silentRun();
  });
});
