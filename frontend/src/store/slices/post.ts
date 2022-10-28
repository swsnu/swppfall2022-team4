import { AxiosError, AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as postAPI from 'store/apis/post';

interface PostState {
  posts: postAPI.Post[] | null;
  pageNum: number | null;
  pageSize: number | null;
  pageTotal: number | null;
  error: AxiosError | null;
}
const initialState: PostState = {
  posts: null,
  pageNum: null,
  pageSize: null,
  pageTotal: null,
  error: null,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPosts: (state, action: PayloadAction<postAPI.getPostsRequestType>) => {
      state.posts = null;
      state.error = null;
    },
    getPostsSuccess: (state, { payload }) => {
      // console.log(payload);
      state.posts = payload.posts;
      state.pageNum = payload.page;
      state.pageSize = payload.page_size;
      state.pageTotal = payload.page_total;
    },
    getPostsFailure: (state, { payload }) => {
      state.error = payload;
      alert(payload.response?.data.message);
    },
    createPost: (state, action: PayloadAction<postAPI.createPostRequestType>) => {
      //create!
    },
    createPostSuccess: (state, { payload }) => {
      // console.log(payload);
    },
    createPostFailure: (state, { payload }) => {
      // console.log(payload);
    },
  },
});
export const postActions = postSlice.actions;

function* getPostsSaga(action: PayloadAction<postAPI.getPostsRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.getPosts, action.payload);
    yield put(postActions.getPostsSuccess(response));
  } catch (error) {
    yield put(postActions.getPostsFailure(error));
  }
}

function* createPostSaga(action: PayloadAction<postAPI.createPostRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.createPost, action.payload);
    yield put(postActions.createPostSuccess(response));
  } catch (error) {
    yield put(postActions.createPostFailure(error));
  }
}

export default function* postSaga() {
  yield takeLatest(postActions.getPosts, getPostsSaga);
  yield takeLatest(postActions.createPost, createPostSaga);
}
