import { combineReducers } from '@reduxjs/toolkit';
import { all, fork } from 'redux-saga/effects';
import userSaga, { userSlice } from './slices/user';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
});
export function* rootSaga() {
  yield all([fork(userSaga)]);
}
