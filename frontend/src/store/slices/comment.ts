import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { put, call } from 'redux-saga/effects';
import * as commentAPI from 'store/apis/comment';
import * as postAPI from 'store/apis/post';
import { postActions } from './post';

// Comment-related saga generator function.
export function* getPostCommentSaga(action: PayloadAction<postAPI.postIdentifyingRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.getPostComment, action.payload);
    yield put(postActions.getPostCommentSuccess(response));
  } catch (error) {
    yield put(postActions.getPostCommentFailure(error));
  }
}

export function* createCommentSaga(action: PayloadAction<commentAPI.createCommentRequestType>) {
  try {
    yield call(commentAPI.createComment, action.payload);
    // const response: AxiosResponse = yield call(commentAPI.createComment, action.payload);
    // yield put(postActions.createCommentSuccess(response));
  } catch (error) {
    // yield put(postActions.createCommentFailure(error));
  }
}

export function* editCommentSaga(action: PayloadAction<commentAPI.editCommentRequestType>) {
  try {
    yield call(commentAPI.editComment, action.payload);
    // const response: AxiosResponse = yield call(commentAPI.editComment, action.payload);
    // yield put(postActions.createCommentSuccess(response));
  } catch (error) {
    // yield put(postActions.createCommentFailure(error));
  }
}

export function* deleteCommentSaga(action: PayloadAction<commentAPI.commentIdentifyingRequestType>) {
  try {
    yield call(commentAPI.deleteComment, action.payload);
    // const response: AxiosResponse = yield call(commentAPI.deleteComment, action.payload);
    // yield put(postActions.createCommentSuccess(response));
  } catch (error) {
    // yield put(postActions.createCommentFailure(error));
  }
}

export function* commentFuncSaga(action: PayloadAction<commentAPI.commentFuncRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.commentFunc, action.payload);
    yield put(postActions.commentFuncSuccess(response));
  } catch (error) {
    // yield put(commentActions.editcommentFailure(error));
  }
}
