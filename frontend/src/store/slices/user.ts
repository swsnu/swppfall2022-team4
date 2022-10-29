/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as userAPI from 'store/apis/user';

interface UserState {
  user: {
    username: string;
    nickname: string;
    image: string;
  } | null;
  error: AxiosError | null;

  notice: string[];
}
const initialState: UserState = {
  user: null,
  error: null,

  notice: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    token: state => state,

    signup: (state, action: PayloadAction<userAPI.signupRequestType>) => {
      state.user = null;
      state.error = null;
    },
    signupSuccess: (state, { payload }) => {
      state.user = payload;
    },
    signupFailure: (state, { payload }) => {
      state.error = payload;
      alert(payload.response?.data.message);
    },
    login: (state, action: PayloadAction<userAPI.loginRequestType>) => {
      state.user = null;
      state.error = null;
    },
    loginSuccess: (state, { payload }) => {
      state.user = payload;
    },
    loginFailure: (state, { payload }) => {
      state.error = payload;
      alert(payload.response?.data.message);
    },
    check: state => state,
    checkFailure: state => {
      state.user = null;
    },
  },
});
export const userActions = userSlice.actions;

function* tokenSaga() {
  yield call(userAPI.token);
}

function* signupSaga(action: PayloadAction<userAPI.signupRequestType>) {
  try {
    const response: AxiosResponse = yield call(userAPI.signup, action.payload);
    yield put(userActions.signupSuccess(response));
  } catch (error) {
    yield put(userActions.signupFailure(error));
  }
}
function* loginSaga(action: PayloadAction<userAPI.loginRequestType>) {
  try {
    const response: AxiosResponse = yield call(userAPI.login, action.payload);
    yield put(userActions.loginSuccess(response));
  } catch (error) {
    yield put(userActions.loginFailure(error));
  }
}
function* checkSaga() {
  try {
    yield call(userAPI.check);
  } catch (error) {
    yield put(userActions.checkFailure());
  }
}

export default function* userSaga() {
  yield takeLatest(userActions.token, tokenSaga);
  yield takeLatest(userActions.signup, signupSaga);
  yield takeLatest(userActions.login, loginSaga);
  yield takeLatest(userActions.check, checkSaga);
}
