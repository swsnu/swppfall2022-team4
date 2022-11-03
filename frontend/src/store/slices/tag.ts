import { AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as tagAPI from 'store/apis/tag';

interface TagState {
  tagList: tagAPI.TagClass[] | null;
  error: string | null;
}
const initialState: TagState = {
  tagList: null,
  error: null,
};

export const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // getTags ------------------------------------------------------------------------
    getTags: state => {
      state.tagList = null;
      state.error = null;
    },
    getTagsSuccess: (state, { payload }) => {
      state.tagList = payload.tags;
    },
    getTagsFailure: (state, { payload }) => {
      state.error = payload;
      alert(payload.response?.data.message);
    },
    createTag: (state, action: PayloadAction<tagAPI.createTagRequestType>) => {
      //create!
    },
    createTagSuccess: (state, { payload }) => {
      console.log(payload);
    },
    createTagFailure: (state, { payload }) => {
      // console.log(payload);
    },
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
});

export const tagActions = tagSlice.actions;

function* getTagsSaga() {
  try {
    const response: AxiosResponse = yield call(tagAPI.getTag);
    yield put(tagActions.getTagsSuccess(response));
  } catch (error) {
    yield put(tagActions.getTagsFailure(error));
  }
}

function* createTagSaga(action: PayloadAction<tagAPI.createTagRequestType>) {
  try {
    const response: AxiosResponse = yield call(tagAPI.createTag, action.payload);
    yield put(tagActions.createTagSuccess(response));
  } catch (error) {
    yield put(tagActions.createTagFailure(error));
  }
}

export default function* tagSaga() {
  yield takeLatest(tagActions.getTags, getTagsSaga);
  yield takeLatest(tagActions.createTag, createTagSaga);
}
