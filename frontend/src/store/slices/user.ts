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

  profile: userAPI.profileType | null;
  loading: boolean;
  editProfile: boolean;
  deleteProfile: boolean;
  profileError: AxiosError | null;

  notice: string[];
}
const initialState: UserState = {
  user: null,
  error: null,

  profile: null,
  loading: false,
  editProfile: false,
  deleteProfile: false,
  profileError: null,

  notice: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    resetProfile: state => {
      state.profile = null;
      state.loading = false;
      state.editProfile = false;
      state.deleteProfile = false;
      state.profileError = null;
    },
    token: state => state,

    signup: (state, action: PayloadAction<userAPI.signupRequestType>) => {
      state.user = null;
      state.error = null;
    },
    signupSuccess: (state, { payload }) => {
      state.user = payload;
      state.error = null;
    },
    signupFailure: (state, { payload }) => {
      state.user = null;
      state.error = payload;
      alert(payload.response?.data.message);
    },
    login: (state, action: PayloadAction<userAPI.loginRequestType>) => {
      state.user = null;
      state.error = null;
    },
    loginSuccess: (state, { payload }) => {
      state.user = payload;
      state.error = null;
    },
    loginFailure: (state, { payload }) => {
      state.user = null;
      state.error = payload;
      alert(payload.response?.data.message);
    },
    check: state => state,
    checkFailure: state => {
      state.user = null;
    },
    logout: state => {
      state.user = null;
    },

    getProfile: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.profile = null;
      state.profileError = null;
    },
    getProfileSuccess: (state, { payload }) => {
      state.loading = false;
      state.profile = payload;
      state.profileError = null;
    },
    getProfileFailure: (state, { payload }) => {
      state.loading = false;
      state.profile = null;
      state.profileError = payload;
      alert(payload.response?.data.message);
    },
    editProfile: (state, action: PayloadAction<{ username: string; data: userAPI.editProfileRequestType }>) => {
      state.loading = true;
      state.editProfile = false;
      state.profileError = null;
    },
    editProfileSuccess: (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.editProfile = true;
      state.profileError = null;
    },
    editProfileFailure: (state, { payload }) => {
      state.loading = false;
      state.editProfile = false;
      state.profileError = payload;
      alert(payload.response?.data.message);
    },
    signout: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.deleteProfile = false;
      state.profileError = null;
    },
    signoutSuccess: state => {
      state.loading = false;
      state.deleteProfile = true;
      state.profileError = null;
    },
    signoutFailure: (state, { payload }) => {
      state.loading = false;
      state.deleteProfile = false;
      state.profileError = payload;
      alert(payload.response?.data.message);
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
function* logoutSaga() {
  yield call(userAPI.logout);
  localStorage.removeItem('user');
}

function* getProfileSaga(action: PayloadAction<string>) {
  try {
    const response: AxiosResponse = yield call(userAPI.getProfile, action.payload);
    yield put(userActions.getProfileSuccess(response));
  } catch (error) {
    yield put(userActions.getProfileFailure(error));
  }
}
function* editProfileSaga(action: PayloadAction<{ username: string; data: userAPI.editProfileRequestType }>) {
  try {
    const response: AxiosResponse = yield call(userAPI.editProfile, action.payload);
    yield put(userActions.editProfileSuccess(response));
  } catch (error) {
    yield put(userActions.editProfileFailure(error));
  }
}
function* signoutSaga(action: PayloadAction<string>) {
  try {
    yield call(userAPI.signout, action.payload);
    yield put(userActions.signoutSuccess());
  } catch (error) {
    yield put(userActions.signoutFailure(error));
  }
}

export default function* userSaga() {
  yield takeLatest(userActions.token, tokenSaga);
  yield takeLatest(userActions.signup, signupSaga);
  yield takeLatest(userActions.login, loginSaga);
  yield takeLatest(userActions.check, checkSaga);
  yield takeLatest(userActions.logout, logoutSaga);
  yield takeLatest(userActions.getProfile, getProfileSaga);
  yield takeLatest(userActions.editProfile, editProfileSaga);
  yield takeLatest(userActions.signout, signoutSaga);
}
