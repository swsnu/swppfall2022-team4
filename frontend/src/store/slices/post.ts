import { AxiosError, AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as postAPI from 'store/apis/post';
import * as commentAPI from 'store/apis/comment';
import { commentFuncSaga, createCommentSaga, deleteCommentSaga, editCommentSaga, getPostCommentSaga } from './comment';

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
    commentFunc: boolean;
  };
  postCreate: {
    status: boolean;
    post_id: string | null;
  };
  recentCommentPosts: {
    comments: commentAPI.Comment[] | null;
  };
  postEdit: boolean;
  postDelete: boolean;
  postFunc: boolean;
  postSearch: string;
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
    commentFunc: false,
  },
  postCreate: {
    status: false,
    post_id: null,
  },
  recentCommentPosts: {
    comments: null,
  },
  postEdit: false,
  postDelete: false,
  postFunc: false,
  postSearch: '',
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // getPosts ------------------------------------------------------------------------
    getPosts: (state, action: PayloadAction<postAPI.getPostsRequestType>) => {
      state.postList.posts = null;
      state.postList.error = null;
    },
    getPostsSuccess: (state, { payload }) => {
      state.postList.posts = payload.posts;
      state.postList.pageNum = payload.page;
      state.postList.pageSize = payload.page_size;
      state.postList.pageTotal = payload.page_total;
    },
    getPostsFailure: (state, { payload }) => {
      state.postList.error = payload;
      alert(payload.response?.data.message);
    },
    getRecentCommentPosts: state => {
      state.recentCommentPosts.comments = null;
    },
    getRecentCommentPostsSuccess: (state, { payload }) => {
      state.recentCommentPosts.comments = payload.comments;
    },
    // createPost ------------------------------------------------------------------------
    createPost: (state, action: PayloadAction<postAPI.createPostRequestType>) => {
      //create!
    },
    createPostSuccess: (state, { payload }) => {
      state.postCreate.post_id = payload.post_id;
      state.postCreate.status = true;
    },
    // createPostFailure: (state, { payload }) => {
    //   // console.log(payload);
    // },
    // getPostDetail ------------------------------------------------------------------------
    getPostDetail: (state, action: PayloadAction<postAPI.postIdentifyingRequestType>) => {
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
    updatePostDetail: (state, action: PayloadAction<postAPI.postIdentifyingRequestType>) => {
      // Empty body : for update minimization.
    },
    updatePostDetailSuccess: (state, { payload }) => {
      state.postDetail.post = payload;
    },
    updatePostDetailFailure: (state, { payload }) => {
      state.postDetail.error = payload;
      alert(payload.response?.data.message);
    },
    // deletePost ------------------------------------------------------------------------
    deletePost: (state, action: PayloadAction<postAPI.postIdentifyingRequestType>) => {
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
    // editPost ------------------------------------------------------------------------
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
    getPostComment: (state, action: PayloadAction<postAPI.postIdentifyingRequestType>) => {
      state.postComment.comments = null;
      state.postComment.error = null;
    },
    getPostCommentSuccess: (state, { payload }) => {
      state.postComment.comments = payload.comments;
    },
    getPostCommentFailure: (state, { payload }) => {
      state.postList.error = payload;
      alert(payload.response?.data.message);
    },
    createComment: (state, action: PayloadAction<commentAPI.createCommentRequestType>) => {
      //create!
    },
    // createCommentSuccess: (state, { payload }) => {},
    // createCommentFailure: (state, { payload }) => {},
    editComment: (state, action: PayloadAction<commentAPI.editCommentRequestType>) => {
      //edit!
    },
    deleteComment: (state, action: PayloadAction<commentAPI.commentIdentifyingRequestType>) => {
      //edit!
    },
    // postSearch ------------------------------------------------------------------------
    postSearch: (state, action: PayloadAction<postAPI.postSearchRequestType>) => {
      state.postSearch = action.payload.search_keyword;
    },
    // utils ------------------------------------------------------------------------
    stateRefresh: state => {
      state.postCreate.status = false;
      state.postEdit = false;
      state.postDelete = false;
      state.postFunc = false;
    },
    toggleCommentReply: (state, action: PayloadAction<commentAPI.createCommentReplyType>) => {
      if (state.postComment.comments)
        state.postComment.comments = state.postComment.comments.map(comment => {
          if (comment.id === action.payload.parent_comment) {
            return { ...comment, replyActive: comment.replyActive ? false : true };
          } else {
            return comment;
          }
        });
    },
    toggleCommentEdit: (state, action: PayloadAction<commentAPI.commentIdentifyingRequestType>) => {
      if (state.postComment.comments) {
        state.postComment.comments = state.postComment.comments.map(comment => {
          if (comment.id === action.payload.comment_id) {
            return { ...comment, editActive: comment.editActive ? false : true };
          } else {
            return comment;
          }
        });
      }
    },
    postFunc: (state, action: PayloadAction<postAPI.postFuncRequestType>) => {
      state.postFunc = false;
    },
    postFuncSuccess: (state, { payload }) => {
      state.postFunc = true;
    },
    commentFunc: (state, action: PayloadAction<commentAPI.commentFuncRequestType>) => {
      state.postComment.commentFunc = false;
    },
    commentFuncSuccess: (state, { payload }) => {
      state.postComment.commentFunc = true;
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
function* getRecentCommentPostsSaga() {
  try {
    const response: AxiosResponse = yield call(commentAPI.getRecentCommentPosts);
    yield put(postActions.getRecentCommentPostsSuccess(response));
  } catch (error) {
    // yield put(postActions.getPostsFailure(error));
  }
}

function* createPostSaga(action: PayloadAction<postAPI.createPostRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.createPost, action.payload);
    yield put(postActions.createPostSuccess(response));
  } catch (error) {
    // yield put(postActions.createPostFailure(error));
  }
}

function* getPostDetailSaga(action: PayloadAction<postAPI.postIdentifyingRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.getPostDetail, action.payload);
    yield put(postActions.getPostDetailSuccess(response));
  } catch (error) {
    yield put(postActions.getPostDetailFailure(error));
  }
}
function* updatePostDetailSaga(action: PayloadAction<postAPI.postIdentifyingRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.updatePostDetail, action.payload);
    yield put(postActions.updatePostDetailSuccess(response));
  } catch (error) {
    yield put(postActions.updatePostDetailFailure(error));
  }
}

function* deletePostSaga(action: PayloadAction<postAPI.postIdentifyingRequestType>) {
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

function* postFuncSaga(action: PayloadAction<postAPI.postFuncRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.postFunc, action.payload);
    yield put(postActions.postFuncSuccess(response));
  } catch (error) {
    // yield put(postActions.editPostFailure(error));
  }
}

export default function* postSaga() {
  yield takeLatest(postActions.getPosts, getPostsSaga);
  yield takeLatest(postActions.getRecentCommentPosts, getRecentCommentPostsSaga);
  yield takeLatest(postActions.createPost, createPostSaga);
  yield takeLatest(postActions.getPostDetail, getPostDetailSaga);
  yield takeLatest(postActions.updatePostDetail, updatePostDetailSaga);
  yield takeLatest(postActions.deletePost, deletePostSaga);
  yield takeLatest(postActions.editPost, editPostSaga);
  yield takeLatest(postActions.getPostComment, getPostCommentSaga);

  yield takeLatest(postActions.postFunc, postFuncSaga);

  yield takeLatest(postActions.createComment, createCommentSaga);
  yield takeLatest(postActions.editComment, editCommentSaga);
  yield takeLatest(postActions.deleteComment, deleteCommentSaga);
  yield takeLatest(postActions.commentFunc, commentFuncSaga);
}
