import { AxiosError, AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as postAPI from 'store/apis/post';
import * as commentAPI from 'store/apis/comment';

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
  postComment: {
    comments: commentAPI.Comment[] | null;
    error: AxiosError | null;
  };
  postCreate: {
    status: boolean;
    post_id: string | null;
  };
  postEdit: boolean;
  postDelete: boolean;
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
  postComment: {
    comments: null,
    error: null,
  },
  postCreate: {
    status: false,
    post_id: null,
  },
  postEdit: false,
  postDelete: false,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
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
      state.postCreate.post_id = payload.post_id;
      state.postCreate.status = true;
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
    deletePost: (state, action: PayloadAction<postAPI.deletePostRequestType>) => {
      // delete!
      state.postDelete = false;
    },
    deletePostSuccess: (state, { payload }) => {
      // success!
      state.postDelete = true;
    },
    deletePostFailure: (state, { payload }) => {
      // failure..
      state.postDelete = false;
      alert('Delete failed');
    },
    editPost: (state, action: PayloadAction<postAPI.editPostRequestType>) => {
      // edit!
      state.postEdit = false;
    },
    editPostSuccess: (state, { payload }) => {
      // success!
      state.postEdit = true;
    },
    editPostFailure: (state, { payload }) => {
      // failure..
      state.postEdit = false;
      alert('edit failed');
    },
    stateRefresh: state => {
      state.postCreate.status = false;
      state.postEdit = false;
      state.postDelete = false;
    },
    getPostComment: (state, action: PayloadAction<commentAPI.getPostCommentRequestType>) => {
      state.postComment.comments = null;
      state.postComment.error = null;
    },
    getPostCommentSuccess: (state, { payload }) => {
      // console.log(payload);
      state.postComment.comments = payload.comments;
    },
    getPostCommentFailure: (state, { payload }) => {
      state.postList.error = payload;
      alert(payload.response?.data.message);
    },
    createComment: (state, action: PayloadAction<commentAPI.createCommentRequestType>) => {
      //create!
    },
    createCommentSuccess: (state, { payload }) => {
      // console.log(payload);
    },
    createCommentFailure: (state, { payload }) => {
      // console.log(payload);
    },
    /* eslint-enable @typescript-eslint/no-unused-vars */
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

function* deletePostSaga(action: PayloadAction<postAPI.deletePostRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.deletePost, action.payload);
    yield put(postActions.deletePostSuccess(response));
  } catch (error) {
    yield put(postActions.deletePostFailure(error));
  }
}

function* editPostSaga(action: PayloadAction<postAPI.editPostRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.editPost, action.payload);
    yield put(postActions.editPostSuccess(response));
  } catch (error) {
    yield put(postActions.editPostFailure(error));
  }
}

function* getPostCommentSaga(action: PayloadAction<commentAPI.getPostCommentRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.getPostComment, action.payload);
    yield put(postActions.getPostCommentSuccess(response));
  } catch (error) {
    yield put(postActions.getPostCommentFailure(error));
  }
}

function* createCommentSaga(action: PayloadAction<commentAPI.createCommentRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.createComment, action.payload);
    yield put(postActions.createCommentSuccess(response));
  } catch (error) {
    yield put(postActions.createCommentFailure(error));
  }
}

export default function* postSaga() {
  yield takeLatest(postActions.getPosts, getPostsSaga);
  yield takeLatest(postActions.createPost, createPostSaga);
  yield takeLatest(postActions.getPostDetail, getPostDetailSaga);
  yield takeLatest(postActions.deletePost, deletePostSaga);
  yield takeLatest(postActions.editPost, editPostSaga);
  yield takeLatest(postActions.getPostComment, getPostCommentSaga);
  yield takeLatest(postActions.createComment, createCommentSaga);
}
