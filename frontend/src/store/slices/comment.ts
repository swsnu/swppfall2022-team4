import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { put, call } from 'redux-saga/effects';
import * as commentAPI from 'store/apis/comment';
import { postActions } from './post';

// Comment-related saga generator function.
export function* getPostCommentSaga(action: PayloadAction<commentAPI.getPostCommentRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.getPostComment, action.payload);
    yield put(postActions.getPostCommentSuccess(response));
  } catch (error) {
    yield put(postActions.getPostCommentFailure(error));
  }
}

export function* createCommentSaga(action: PayloadAction<commentAPI.createCommentRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.createComment, action.payload);
    yield put(postActions.createCommentSuccess(response));
  } catch (error) {
    yield put(postActions.createCommentFailure(error));
  }
}

export function* editCommentSaga(action: PayloadAction<commentAPI.editCommentRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.editComment, action.payload);
    // yield put(postActions.createCommentSuccess(response));
  } catch (error) {
    // yield put(postActions.createCommentFailure(error));
  }
}

export function* deleteCommentSaga(action: PayloadAction<commentAPI.deleteCommentRequestType>) {
  try {
    const response: AxiosResponse = yield call(commentAPI.deleteComment, action.payload);
    // yield put(postActions.createCommentSuccess(response));
  } catch (error) {
    // yield put(postActions.createCommentFailure(error));
  }
}
