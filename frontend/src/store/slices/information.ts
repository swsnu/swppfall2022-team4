import { AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as infoAPI from 'store/apis/information';
import { Post } from 'store/apis/post';

interface InformationState {
  contents: {
    basic: {
      name: string;
    };
    posts: Post[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    youtubes: any;
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
  contents: {
    basic: {
      name: '',
    },
    posts: [],
    youtubes: [],
    articles: [],
  },
  error: ERROR_STATE.NOT_ERROR,
};

export const informationSlice = createSlice({
  name: 'information',
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
      if (payload.response.status === 404) {
        state.error = ERROR_STATE.NOT_FOUND;
      } else {
        state.error = ERROR_STATE.ETC;
      }
    },
    initializeInformation: state => {
      state = initialState;
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
