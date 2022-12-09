/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as notificationAPI from 'store/apis/notification';
import { notificationSuccess } from 'utils/sendNotification';

interface NotificationState {
  notificationList: notificationAPI.notificationType[];
}
export const initialState: NotificationState = {
  notificationList: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotificationList: state => state,
    getNotificationListSuccess: (state, { payload }) => {
      state.notificationList = payload;
    },
    getNotificationListFailure: (state, { payload }) => {
      alert(payload.response?.data.message);
    },
    deleteAllNotification: state => {
      state.notificationList = [];
      notificationSuccess('알림 삭제', '모든 알림을 삭제했습니다.');
    },
    deleteNotification: (state, action: PayloadAction<number>) => {
      state.notificationList = state.notificationList.filter(x => x.id !== action.payload);
    },
  },
});
export const notificationActions = notificationSlice.actions;

function* getNotificationListSaga() {
  try {
    const response: AxiosResponse = yield call(notificationAPI.getNotificationList);
    yield put(notificationActions.getNotificationListSuccess(response));
  } catch (error) {
    yield put(notificationActions.getNotificationListFailure(error));
  }
}
function* deleteAllNotificationSaga() {
  yield call(notificationAPI.deleteAllNotification);
}
function* deleteNotificationSaga(action: PayloadAction<number>) {
  yield call(notificationAPI.deleteNotification, action.payload);
}

export default function* notificationSaga() {
  yield takeLatest(notificationActions.getNotificationList, getNotificationListSaga);
  yield takeLatest(notificationActions.deleteAllNotification, deleteAllNotificationSaga);
  yield takeLatest(notificationActions.deleteNotification, deleteNotificationSaga);
}
