import { AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as infoAPI from 'store/apis/information';
import { Post } from 'store/apis/post';
import { notificationInfo } from 'utils/sendNotification';

export interface InformationState {
  contents: {
    basic: {
      name: string;
      class_name: string;
    };
    posts: Post[];
    youtubes: infoAPI.Youtube[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    articles: any;
  } | null;
  error: string;
}

const ERROR_STATE = {
  NOT_ERROR: 'NOTERROR',
  NOT_FOUND: 'NOTFOUND',
  ETC: 'ETC',
};

export const initialState: InformationState = {
  contents: null,
  error: ERROR_STATE.NOT_ERROR,
};

export const informationSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // getInformation ------------------------------------------------------------------------
    getInformation: (state, action: PayloadAction<infoAPI.getInformationRequestType>) => {
      state.contents = null;
      state.error = ERROR_STATE.NOT_ERROR;
    },
    getInformationSuccess: (state, { payload }) => {
      state.contents = payload;
    },
    getInformationFailure: (state, { payload }) => {
      if (payload?.response?.status === 404) {
        state.error = ERROR_STATE.NOT_FOUND;
        notificationInfo('Info', '검색 결과가 없어요.');
      } else {
        state.error = ERROR_STATE.ETC;
      }
    },
    initializeInformation: state => {
      state.contents = initialState.contents;
      state.error = initialState.error;
    },
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
});

export const infoActions = informationSlice.actions;

function* getInformationSaga(action: PayloadAction<infoAPI.getInformationRequestType>) {
  try {
    const response: AxiosResponse = yield call(infoAPI.getInformation, action.payload);
    yield put(infoActions.getInformationSuccess(response));
  } catch (error) {
    yield put(infoActions.getInformationFailure(error));
  }
}

export default function* informationSaga() {
  yield takeLatest(infoActions.getInformation, getInformationSaga);
}
