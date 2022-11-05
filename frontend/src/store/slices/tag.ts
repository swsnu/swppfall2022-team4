import { AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as tagAPI from 'store/apis/tag';

interface TagState {
  tagList: tagAPI.TagClass[] | null;
  tagSearch: tagAPI.TagVisual[] | null;
  error: string | null;
}
const initialState: TagState = {
  tagList: null,
  tagSearch: null,
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
    createTagClass: (state, action: PayloadAction<tagAPI.createTagClassRequestType>) => {
      //create!
    },
    createTagClassSuccess: (state, { payload }) => {
      //console.log(payload);
    },
    createTagClassFailure: (state, { payload }) => {
      // console.log(payload);
    },
    createTag: (state, action: PayloadAction<tagAPI.createTagRequestType>) => {
      //create!
    },
    createTagSuccess: (state, { payload }) => {
      //console.log(payload);
    },
    createTagFailure: (state, { payload }) => {
      // console.log(payload);
    },
    searchTag: (state, action: PayloadAction<tagAPI.searchTagRequestType>) => {
      //search!
    },
    searchTagSuccess: (state, { payload }) => {
      // console.log(payload);
      state.tagSearch = payload.tags;
    },
    searchTagFailure: (state, { payload }) => {
      // console.log(payload);
    },
    searchTagClear: state => {
      state.tagSearch = null;
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

function* createTagClassSaga(action: PayloadAction<tagAPI.createTagClassRequestType>) {
  try {
    const response: AxiosResponse = yield call(tagAPI.createTagClass, action.payload);
    yield put(tagActions.createTagClassSuccess(response));
  } catch (error) {
    yield put(tagActions.createTagClassFailure(error));
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

function* searchTagSaga(action: PayloadAction<tagAPI.searchTagRequestType>) {
  try {
    const response: AxiosResponse = yield call(tagAPI.searchTag, action.payload);
    yield put(tagActions.searchTagSuccess(response));
  } catch (error) {
    yield put(tagActions.searchTagFailure(error));
  }
}

export default function* tagSaga() {
  yield takeLatest(tagActions.getTags, getTagsSaga);
  yield takeLatest(tagActions.createTag, createTagSaga);
  yield takeLatest(tagActions.createTagClass, createTagClassSaga);
  yield takeLatest(tagActions.searchTag, searchTagSaga);
}
