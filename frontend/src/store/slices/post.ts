import { AxiosError, AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as postAPI from 'store/apis/post';

interface PostState {
  postList: {
    posts: postAPI.Post[] | null;
    pageNum: number | null;
    pageSize: number | null;
    pageTotal: number | null;
    error: AxiosError | null;
  };
  postDetail: {
    post: postAPI.Post | null;
    error: AxiosError | null;
  };
}
const initialState: PostState = {
  postList: {
    posts: null,
    pageNum: null,
    pageSize: null,
    pageTotal: null,
    error: null,
  },
  postDetail: {
    post: null,
    error: null,
  },
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPosts: (state, action: PayloadAction<postAPI.getPostsRequestType>) => {
      state.postList.posts = null;
      state.postList.error = null;
    },
    getPostsSuccess: (state, { payload }) => {
      // console.log(payload);
      state.postList.posts = payload.posts;
      state.postList.pageNum = payload.page;
      state.postList.pageSize = payload.page_size;
      state.postList.pageTotal = payload.page_total;
    },
    getPostsFailure: (state, { payload }) => {
      state.postList.error = payload;
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
    getPostDetail: (state, action: PayloadAction<postAPI.getPostDetailRequestType>) => {
      state.postDetail.post = null;
      state.postDetail.error = null;
    },
    getPostDetailSuccess: (state, { payload }) => {
      state.postDetail.post = payload;
    },
    getPostDetailFailure: (state, { payload }) => {
      state.postDetail.error = payload;
      alert(payload.response?.data.message);
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

function* getPostDetailSaga(action: PayloadAction<postAPI.getPostDetailRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.getPostDetail, action.payload);
    yield put(postActions.getPostDetailSuccess(response));
  } catch (error) {
    yield put(postActions.getPostDetailFailure(error));
  }
}

export default function* postSaga() {
  yield takeLatest(postActions.getPosts, getPostsSaga);
  yield takeLatest(postActions.createPost, createPostSaga);
  yield takeLatest(postActions.getPostDetail, getPostDetailSaga);
}
