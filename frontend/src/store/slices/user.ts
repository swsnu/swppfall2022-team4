import { AxiosError, AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as userAPI from 'store/apis/user';

interface UserState {
  user: {
    username: string;
    nickname: string;
    image: string;
  } | null;
  loading: boolean;
  error: AxiosError | null;
}
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<userAPI.signupRequestType>) => {
      state.loading = true;
    },
    signupSuccess: (state, { payload }) => {
      state.user = payload;
      state.loading = false;
    },
    signupFailure: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    login: (state, action: PayloadAction<userAPI.loginRequestType>) => {
      state.loading = true;
    },
    loginSuccess: (state, { payload }) => {
      state.user = payload;
      state.loading = false;
    },
    loginFailure: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
});
export const userActions = userSlice.actions;

function* signupSaga(action: PayloadAction<userAPI.signupRequestType>) {
  try {
    const response: AxiosResponse = yield call(userAPI.signup, action.payload);
    yield put(userActions.signupSuccess(response.data));
  } catch (error) {
    yield put(userActions.signupFailure(error));
  }
}
function* loginSaga(action: PayloadAction<userAPI.loginRequestType>) {
  try {
    const response: AxiosResponse = yield call(userAPI.login, action.payload);
    yield put(userActions.loginSuccess(response.data));
  } catch (error) {
    yield put(userActions.loginFailure(error));
  }
}

export default function* userSaga() {
  yield takeLatest(userActions.signup.type, signupSaga);
  yield takeLatest(userActions.login.type, loginSaga);
}
