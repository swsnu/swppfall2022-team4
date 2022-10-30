import { combineReducers } from '@reduxjs/toolkit';
import { all, fork } from 'redux-saga/effects';
import postSaga, { postSlice } from './slices/post';
import userSaga, { userSlice } from './slices/user';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
});
export function* rootSaga() {
  yield all([fork(userSaga)]);
  yield all([fork(postSaga)]);
}
