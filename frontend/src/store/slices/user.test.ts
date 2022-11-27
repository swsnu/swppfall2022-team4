import { configureStore } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as userAPI from '../apis/user';
import userSaga, { initialState, userSlice, userActions } from './user';
import { Store } from 'react-notifications-component';

beforeEach(() => {
  Store.addNotification = jest.fn();
});
afterAll(() => jest.restoreAllMocks());

const simpleError = new Error('error!');
const simpleUser = { username: '11111111', nickname: 'abcd', image: 'image.png' };
const signupRequest = {
  username: '11111111',
  password: '11111111',
  nickname: 'abcd',
  gender: 'male',
  height: 160.5,
  weight: 88.8,
  age: 36,
};
const socialSignupRequest = {
  username: '11111111',
  nickname: 'abcd',
  gender: 'male',
  height: 160.5,
  weight: 88.8,
  age: 36,
};
const loginRequest = {
  username: '11111111',
  password: '11111111',
};
const editProfileRequest = {
  username: '11111111',
  data: { oldPassword: '11111111', newPassword: '22222222' },
};

describe('slices - user', () => {
  test.each([
    [
      userActions.setUser(simpleUser),
      {
        ...initialState,
        user: simpleUser,
      },
    ],
    [userActions.resetProfile(), initialState],
    [userActions.token(), initialState],

    [userActions.signup(signupRequest), initialState],
    [
      userActions.signupSuccess(simpleUser),
      {
        ...initialState,
        user: simpleUser,
      },
    ],
    [
      userActions.signupFailure('error'),
      {
        ...initialState,
        error: 'error',
      },
    ],

    [userActions.socialSignup(socialSignupRequest), initialState],
    [
      userActions.socialSignupSuccess(simpleUser),
      {
        ...initialState,
        user: simpleUser,
      },
    ],
    [
      userActions.socialSignupFailure('error'),
      {
        ...initialState,
        error: 'error',
      },
    ],

    [userActions.login(loginRequest), initialState],
    [
      userActions.loginSuccess(simpleUser),
      {
        ...initialState,
        user: simpleUser,
      },
    ],
    [
      userActions.loginFailure('error'),
      {
        ...initialState,
        error: 'error',
      },
    ],

    [userActions.check(), initialState],
    [userActions.checkFailure(), initialState],

    [userActions.logout(), initialState],

    [userActions.getProfile('11111111'), { ...initialState, loading: true }],
    [
      userActions.getProfileSuccess('data'),
      {
        ...initialState,
        profile: 'data',
      },
    ],
    [
      userActions.getProfileFailure('error'),
      {
        ...initialState,
        profileError: 'error',
      },
    ],

    [userActions.editProfile(editProfileRequest), { ...initialState, loading: true }],
    [
      userActions.editProfileSuccess('data'),
      {
        ...initialState,
        user: 'data',
        editProfile: true,
      },
    ],
    [
      userActions.editProfileFailure('error'),
      {
        ...initialState,
        profileError: 'error',
      },
    ],

    [userActions.signout('1111111'), { ...initialState, loading: true }],
    [
      userActions.signoutSuccess(),
      {
        ...initialState,
        deleteProfile: true,
      },
    ],
    [
      userActions.signoutFailure('error'),
      {
        ...initialState,
        profileError: 'error',
      },
    ],

    [userActions.follow('1111111'), initialState],
    [userActions.followSuccess({ is_follow: true }), initialState],
    [userActions.followFailure('error'), initialState],
  ])('reducer', (action, state) => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(action);
    expect(store.getState().user).toEqual(state);
  });

  test('followSuccess', () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(userActions.getProfileSuccess({ is_follow: false }));
    store.dispatch(userActions.followSuccess({ is_follow: true }));
    expect(store.getState().user).toEqual({ ...initialState, profile: { is_follow: true } });
  });

  describe('saga success', () => {
    test('token', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.token), undefined]])
        .dispatch({ type: 'user/token' })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('socialSignup', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.socialSignup, socialSignupRequest), simpleUser]])
        .put({ type: 'user/socialSignupSuccess', payload: simpleUser })
        .dispatch({ type: 'user/socialSignup', payload: socialSignupRequest })
        .hasFinalState({
          ...initialState,
          user: simpleUser,
        })
        .silentRun();
    });
    test('signup', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.signup, signupRequest), simpleUser]])
        .put({ type: 'user/signupSuccess', payload: simpleUser })
        .dispatch({ type: 'user/signup', payload: signupRequest })
        .hasFinalState({
          ...initialState,
          user: simpleUser,
        })
        .silentRun();
    });
    test('login', () => {
      return expectSaga(userSaga)
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
    test('check', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.check), undefined]])
        .dispatch({ type: 'user/check' })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('logout', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.logout), undefined]])
        .dispatch({ type: 'user/logout' })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('getProfile', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.getProfile, '11111111'), 'data']])
        .put({ type: 'user/getProfileSuccess', payload: 'data' })
        .dispatch({ type: 'user/getProfile', payload: '11111111' })
        .hasFinalState({
          ...initialState,
          profile: 'data',
        })
        .silentRun();
    });
    test('editProfile', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.editProfile, editProfileRequest), 'data']])
        .put({ type: 'user/editProfileSuccess', payload: 'data' })
        .dispatch({ type: 'user/editProfile', payload: editProfileRequest })
        .hasFinalState({
          ...initialState,
          user: 'data',
          editProfile: true,
        })
        .silentRun();
    });
    test('signout', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.signout, '11111111'), undefined]])
        .put({ type: 'user/signoutSuccess', payload: undefined })
        .dispatch({ type: 'user/signout', payload: '11111111' })
        .hasFinalState({
          ...initialState,
          deleteProfile: true,
        })
        .silentRun();
    });
    test('follow', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.follow, '11111111'), undefined]])
        .put({ type: 'user/followSuccess', payload: undefined })
        .dispatch({ type: 'user/follow', payload: '11111111' })
        .hasFinalState(initialState)
        .silentRun();
    });
  });

  describe('saga failure', () => {
    global.alert = jest.fn().mockImplementation(() => null);

    test('signup', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.signup, signupRequest), throwError(simpleError)]])
        .put({ type: 'user/signupFailure', payload: simpleError })
        .dispatch({ type: 'user/signup', payload: signupRequest })
        .hasFinalState({
          ...initialState,
          error: simpleError,
        })
        .silentRun();
    });
    test('socialSignup', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.socialSignup, socialSignupRequest), throwError(simpleError)]])
        .put({ type: 'user/socialSignupFailure', payload: simpleError })
        .dispatch({ type: 'user/socialSignup', payload: socialSignupRequest })
        .hasFinalState({
          ...initialState,
          error: simpleError,
        })
        .silentRun();
    });
    test('login', () => {
      return expectSaga(userSaga)
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
    test('check', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.check), throwError(simpleError)]])
        .put({ type: 'user/checkFailure', payload: undefined })
        .dispatch({ type: 'user/check' })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('getProfile', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.getProfile, '11111111'), throwError(simpleError)]])
        .put({ type: 'user/getProfileFailure', payload: simpleError })
        .dispatch({ type: 'user/getProfile', payload: '11111111' })
        .hasFinalState({
          ...initialState,
          profileError: simpleError,
        })
        .silentRun();
    });
    test('editProfile', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.editProfile, editProfileRequest), throwError(simpleError)]])
        .put({ type: 'user/editProfileFailure', payload: simpleError })
        .dispatch({ type: 'user/editProfile', payload: editProfileRequest })
        .hasFinalState({
          ...initialState,
          profileError: simpleError,
        })
        .silentRun();
    });
    test('signout', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.signout, '11111111'), throwError(simpleError)]])
        .put({ type: 'user/signoutFailure', payload: simpleError })
        .dispatch({ type: 'user/signout', payload: '11111111' })
        .hasFinalState({
          ...initialState,
          profileError: simpleError,
        })
        .silentRun();
    });
    test('follow', () => {
      return expectSaga(userSaga)
        .withReducer(userSlice.reducer)
        .provide([[call(userAPI.follow, '11111111'), throwError(simpleError)]])
        .put({ type: 'user/followFailure', payload: simpleError })
        .dispatch({ type: 'user/follow', payload: '11111111' })
        .hasFinalState(initialState)
        .silentRun();
    });
  });
});
