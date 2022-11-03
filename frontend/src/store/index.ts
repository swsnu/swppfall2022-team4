import { combineReducers } from '@reduxjs/toolkit';
import { all, fork } from 'redux-saga/effects';
import postSaga, { postSlice } from './slices/post';
import tagSaga, { tagSlice } from './slices/tag';
import userSaga, { userSlice } from './slices/user';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
  tag: tagSlice.reducer,
});
export function* rootSaga() {
  yield all([fork(userSaga)]);
  yield all([fork(postSaga)]);
  yield all([fork(tagSaga)]);
}
