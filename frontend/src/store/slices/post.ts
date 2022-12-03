import { AxiosError, AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as postAPI from 'store/apis/post';
import * as commentAPI from 'store/apis/comment';
import { notificationFailure, notificationInfo, notificationSuccess } from 'utils/sendNotification';
import { TagVisual } from 'store/apis/tag';

interface PostState {
  main: postAPI.Post[] | null;

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
  recentComments: {
    comments: commentAPI.Comment[] | null;
  };
  postEdit: boolean;
  postDelete: boolean;
  postFunc: boolean;
  postSearch: string;
  filterTag: TagVisual[];
}
export const initialState: PostState = {
  main: null,

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
  recentComments: {
    comments: null,
  },
  postEdit: false,
  postDelete: false,
  postFunc: false,
  postSearch: '',
  filterTag: [],
};

export const funcTypeToStr = (type: string) => {
  switch (type) {
    case 'like':
      return '좋아요를';
    case 'dislike':
      return '싫어요를';
    case 'scrap':
      return '스크랩을';
    default:
      return '[알 수 없음]을';
  }
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // getPosts ------------------------------------------------------------------------
    getPostsMain: state => {
      state.main = null;
    },
    getPostsMainSuccess: (state, { payload }) => {
      state.main = payload.posts;
    },
    getPostsMainFailure: (state, { payload }) => {
      state.main = null;
    },

    getPosts: (state, action: PayloadAction<postAPI.getPostsRequestType>) => {
      state.postList.posts = null;
      state.postList.error = null;
    },
    getPostsSuccess: (state, { payload }) => {
      state.postList.posts = payload.posts;
      state.postList.pageNum = payload.page;
      state.postList.pageSize = payload.page_size;
      state.postList.pageTotal = payload.page_total;
      if (state.postSearch !== '' && state.postList.posts?.length === 0)
        notificationInfo('Post', '검색 결과가 없어요.');
    },
    getPostsFailure: (state, { payload }) => {
      state.postList.error = payload;
      alert(payload.response?.data.message);
    },
    getRecentComments: state => {
      state.recentComments.comments = null;
    },
    getRecentCommentsSuccess: (state, { payload }) => {
      state.recentComments.comments = payload.comments;
    },
    getRecentCommentsFailure: (state, { payload }) => {
      state.recentComments.comments = null;
      alert(payload.response?.data.message);
    },
    // createPost ------------------------------------------------------------------------
    createPost: (state, action: PayloadAction<postAPI.createPostRequestType>) => {
      state.postCreate.status = false;
    },
    createPostSuccess: (state, { payload }) => {
      state.postCreate.post_id = payload.post_id;
      state.postCreate.status = true;
      notificationSuccess('Post', '글 쓰기에 성공했어요!');
    },
    createPostFailure: (state, { payload }) => {
      state.postCreate.status = false;
      alert(payload.response?.data.message);
    },
    // getPostDetail ------------------------------------------------------------------------
    updatePostDetail: (state, action: PayloadAction<postAPI.postIdentifyingType>) => {
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
    deletePost: (state, action: PayloadAction<postAPI.postIdentifyingType>) => {
      state.postDelete = false;
    },
    deletePostSuccess: (state, { payload }) => {
      state.postDelete = true;
      notificationSuccess('Post', '글 삭제에 성공했어요!');
    },
    deletePostFailure: (state, { payload }) => {
      state.postDelete = false;
      notificationFailure('Post', '글 삭제에 실패했어요.');
    },
    // editPost ------------------------------------------------------------------------
    editPost: (state, action: PayloadAction<postAPI.editPostRequestType>) => {
      state.postEdit = false;
    },
    editPostSuccess: (state, { payload }) => {
      state.postEdit = true;
      notificationSuccess('Post', '글 수정에 성공했어요!');
    },
    editPostFailure: (state, { payload }) => {
      state.postEdit = false;
      notificationFailure('Post', '글 수정에 실패했어요.');
    },
    // getPostComment ------------------------------------------------------------------------
    getPostComment: (state, action: PayloadAction<postAPI.postIdentifyingType>) => {
      state.postComment.comments = null;
      state.postComment.error = null;
    },
    getPostCommentSuccess: (state, { payload }) => {
      state.postComment.comments = payload.comments;
    },
    getPostCommentFailure: (state, { payload }) => {
      state.postComment.error = payload;
      alert(payload.response?.data.message);
    },
    // createComment ------------------------------------------------------------------------
    createComment: (state, action: PayloadAction<commentAPI.createCommentRequestType>) => {
      //create!
    },
    createCommentSuccess: (state, { payload }) => {
      notificationSuccess('Comment', '댓글 작성에 성공했어요!');
    },
    createCommentFailure: (state, { payload }) => {
      notificationFailure('Comment', '댓글 작성에 실패했어요.');
    },
    // editComment ------------------------------------------------------------------------
    editComment: (state, action: PayloadAction<commentAPI.editCommentRequestType>) => {
      //edit!
    },
    editCommentSuccess: (state, { payload }) => {
      notificationSuccess('Comment', '댓글 수정에 성공했어요!');
    },
    editCommentFailure: (state, { payload }) => {
      notificationFailure('Comment', '댓글 수정에 실패했어요.');
    },
    // deleteComment ------------------------------------------------------------------------
    deleteComment: (state, action: PayloadAction<commentAPI.commentIdentifyingRequestType>) => {
      //edit!
    },
    deleteCommentSuccess: (state, { payload }) => {
      notificationSuccess('Comment', '댓글 삭제에 성공했어요!');
    },
    deleteCommentFailure: (state, { payload }) => {
      notificationFailure('Comment', '댓글 삭제에 실패했어요.');
    },
    // postSearch ---------------------------------------------------------------------------
    postSearch: (state, action: PayloadAction<postAPI.postSearchRequestType>) => {
      state.postSearch = action.payload.search_keyword;
    },
    // filterTag ---------------------------------------------------------------------------
    toggleFilterTag: (state, action: PayloadAction<postAPI.filterTagRequestType>) => {
      const target = action.payload;
      if (state.filterTag.filter(item => item.id == target.id).length === 0) {
        state.filterTag = [...state.filterTag, target];
      } else {
        state.filterTag = state.filterTag.filter(item => item.id !== target.id);
      }
    },
    removeFilterTag: (state, action: PayloadAction<postAPI.removeTagRequestType>) => {
      state.filterTag = state.filterTag.filter(item => item.id !== action.payload);
    },
    clearFilterTag: state => {
      state.filterTag = [];
    },
    // groupPosts ---------------------------------------------------------------------------
    getGroupPosts: (state, action: PayloadAction<postAPI.getGroupPostsRequestType>) => {
      state.postList.posts = null;
      state.postList.error = null;
    },
    getGroupPostsSuccess: (state, { payload }) => {
      state.postList.posts = payload.posts;
    },
    getGroupPostsFailure: (state, { payload }) => {
      state.postList.error = payload;
      alert(payload.response?.data.message);
    },
    // utils --------------------------------------------------------------------------------
    stateRefresh: state => {
      state.postCreate.status = false;
      state.postEdit = false;
      state.postDelete = false;
      state.postFunc = false;
    },
    toggleCommentReply: (state, action: PayloadAction<commentAPI.createCommentReplyType>) => {
      if (state.postComment.comments)
        state.postComment.comments = state.postComment.comments.map(comment => {
          if (comment.comment_id === action.payload.parent_comment) {
            return { ...comment, replyActive: comment.replyActive ? false : true };
          } else {
            return comment;
          }
        });
    },
    toggleCommentEdit: (state, action: PayloadAction<commentAPI.commentIdentifyingRequestType>) => {
      if (state.postComment.comments) {
        state.postComment.comments = state.postComment.comments.map(comment => {
          if (comment.comment_id === action.payload.comment_id) {
            return { ...comment, editActive: comment.editActive ? false : true };
          } else {
            return comment;
          }
        });
      }
    },
    resetPost: state => {
      state.postDetail.post = null;
    },
    postFunc: (state, action: PayloadAction<postAPI.postFuncRequestType>) => {
      state.postFunc = false;
    },
    postFuncSuccess: (state, { payload }) => {
      state.postFunc = true;
      notificationSuccess('Post', `글 ${funcTypeToStr(payload.type)} 성공했어요!`);
    },
    postFuncFailure: (state, { payload }) => {
      state.postFunc = false;
      notificationSuccess('Post', `요청하신 작업에 실패했어요.`);
    },
    commentFunc: (state, action: PayloadAction<commentAPI.commentFuncRequestType>) => {
      state.postComment.commentFunc = false;
    },
    commentFuncSuccess: (state, { payload }) => {
      state.postComment.commentFunc = true;
      notificationSuccess('Comment', `댓글 ${funcTypeToStr(payload.type)} 성공했어요!`);
    },
    commentFuncFailure: (state, { payload }) => {
      state.postComment.commentFunc = true;
      notificationFailure('Comment', `요청하신 작업에 실패했어요.`);
    },
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
});
export const postActions = postSlice.actions;

function* getPostsMainSaga() {
  try {
    const response: AxiosResponse = yield call(postAPI.getPostsMain);
    yield put(postActions.getPostsMainSuccess(response));
  } catch (error) {
    yield put(postActions.getPostsMainFailure(error));
  }
}
function* getPostsSaga(action: PayloadAction<postAPI.getPostsRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.getPosts, action.payload);
    yield put(postActions.getPostsSuccess(response));
  } catch (error) {
    yield put(postActions.getPostsFailure(error));
  }
}
function* getGroupPostsSaga(action: PayloadAction<postAPI.getGroupPostsRequestType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.getGroupPosts, action.payload);
    yield put(postActions.getGroupPostsSuccess(response));
  } catch (error) {
    yield put(postActions.getGroupPostsFailure(error));
  }
}
function* getRecentCommentsSaga() {
  try {
    const response: AxiosResponse = yield call(commentAPI.getRecentComments);
    yield put(postActions.getRecentCommentsSuccess(response));
  } catch (error) {
    yield put(postActions.getRecentCommentsFailure(error));
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

function* updatePostDetailSaga(action: PayloadAction<postAPI.postIdentifyingType>) {
  try {
    const response: AxiosResponse = yield call(postAPI.updatePostDetail, action.payload);
    yield put(postActions.updatePostDetailSuccess(response));
  } catch (error) {
    yield put(postActions.updatePostDetailFailure(error));
  }
}

function* deletePostSaga(action: PayloadAction<postAPI.postIdentifyingType>) {
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
    yield put(postActions.postFuncFailure(error));
  }
}

// Comment-related saga generator function.
function* getPostCommentSaga(action: PayloadAction<postAPI.postIdentifyingType>) {
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

function* editCommentSaga(action: PayloadAction<commentAPI.editCommentRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.editComment, action.payload);
    yield put(postActions.editCommentSuccess(response));
  } catch (error) {
    yield put(postActions.editCommentFailure(error));
  }
}

function* deleteCommentSaga(action: PayloadAction<commentAPI.commentIdentifyingRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.deleteComment, action.payload);
    yield put(postActions.deleteCommentSuccess(response));
  } catch (error) {
    yield put(postActions.deleteCommentFailure(error));
  }
}

function* commentFuncSaga(action: PayloadAction<commentAPI.commentFuncRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.commentFunc, action.payload);
    yield put(postActions.commentFuncSuccess(response));
  } catch (error) {
    yield put(postActions.commentFuncFailure(error));
  }
}

export default function* postSaga() {
  yield takeLatest(postActions.getPostsMain, getPostsMainSaga);

  yield takeLatest(postActions.getPosts, getPostsSaga);
  yield takeLatest(postActions.getGroupPosts, getGroupPostsSaga);
  yield takeLatest(postActions.getRecentComments, getRecentCommentsSaga);
  yield takeLatest(postActions.createPost, createPostSaga);
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
