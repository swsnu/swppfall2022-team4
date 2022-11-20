import { AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as tagAPI from 'store/apis/tag';

interface TagState {
  tagList: tagAPI.TagClass[] | null;
  popularTags: tagAPI.TagVisual[] | null;
  tagSearch: tagAPI.TagVisual[] | null;
  tagCreate: tagAPI.TagVisual | null;
  error: string | null;
}
export const initialState: TagState = {
  tagList: null,
  popularTags: null,
  tagSearch: null,
  tagCreate: null,
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
      state.popularTags = payload.popularTags;
    },
    getTagsFailure: (state, { payload }) => {
      state.error = payload;
      alert(payload.response?.data.message);
    },
    createTagClass: (state, action: PayloadAction<tagAPI.createTagClassRequestType>) => {
      //create!
    },
    createTagClassSuccess: (state, { payload }) => {
      //create success
    },
    createTagClassFailure: (state, { payload }) => {
      //create failure
    },
    createTag: (state, action: PayloadAction<tagAPI.createTagRequestType>) => {
      //create!
      state.tagCreate = null;
    },
    createTagSuccess: (state, { payload }) => {
      //create success
      state.tagCreate = payload.tags;
    },
    createTagFailure: (state, { payload }) => {
      //create failure
    },
    searchTag: (state, action: PayloadAction<tagAPI.searchTagRequestType>) => {
      //search!
    },
    searchTagSuccess: (state, { payload }) => {
      state.tagSearch = payload.tags;
    },
    searchTagFailure: (state, { payload }) => {
      //search failure
    },
    // utils -------------------------------------------------------------------------------
    searchTagClear: state => {
      state.tagSearch = null;
    },
    clearTagState: state => {
      state.tagCreate = null;
      state.tagSearch = null;
    },
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
});

export const tagActions = tagSlice.actions;

function* getTagsSaga() {
  try {
    const response: AxiosResponse = yield call(tagAPI.getTags);
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
