import { AxiosResponse } from 'axios';
import { createSlice } from '@reduxjs/toolkit';
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
      console.log(payload);
      state.tagList = payload;
    },
    getTagsFailure: (state, { payload }) => {
      state.error = payload;
      alert(payload.response?.data.message);
    },
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
});

export const tagActions = tagSlice.actions;

function* getTagsSaga() {
  try {
    const response: AxiosResponse = yield call(tagActions.getTags);
    yield put(tagActions.getTagsSuccess(response));
  } catch (error) {
    yield put(tagActions.getTagsFailure(error));
  }
}

export default function* tagSaga() {
  yield takeLatest(tagActions.getTags, getTagsSaga);
}
