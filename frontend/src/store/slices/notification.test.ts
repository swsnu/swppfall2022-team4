import { configureStore } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as notificationAPI from '../apis/notification';
import notificationSaga, { initialState, notificationSlice, notificationActions } from './notification';

const simpleError = new Error('error!');

jest.spyOn(global, 'alert').mockImplementation(msg => msg);

describe('slices - notification', () => {
  test.each([
    [notificationActions.getNotificationList(), initialState],
    [notificationActions.getNotificationListSuccess('data'), { ...initialState, notificationList: 'data' }],
    [notificationActions.getNotificationListFailure('error'), initialState],
    [notificationActions.deleteAllNotification(), initialState],
    [notificationActions.deleteNotification('1234'), initialState],
  ])('reducer', (action, state) => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(action);
    expect(store.getState().notification).toEqual(state);
  });

  describe('saga success', () => {
    test('getNotificationList', () => {
      return expectSaga(notificationSaga)
        .withReducer(notificationSlice.reducer)
        .provide([[call(notificationAPI.getNotificationList), 'data']])
        .put({ type: 'notification/getNotificationListSuccess', payload: 'data' })
        .dispatch({ type: 'notification/getNotificationList' })
        .hasFinalState({ ...initialState, notificationList: 'data' })
        .silentRun();
    });
    test('deleteAllNotification', () => {
      return expectSaga(notificationSaga)
        .withReducer(notificationSlice.reducer)
        .provide([[call(notificationAPI.deleteAllNotification), undefined]])
        .dispatch({ type: 'notification/deleteAllNotification' })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('deleteNotification', () => {
      return expectSaga(notificationSaga)
        .withReducer(notificationSlice.reducer)
        .provide([[call(notificationAPI.deleteNotification, '1234'), undefined]])
        .dispatch({ type: 'notification/deleteNotification', payload: '1234' })
        .hasFinalState(initialState)
        .silentRun();
    });
  });

  describe('saga failure', () => {
    test('getNotificationList', () => {
      return expectSaga(notificationSaga)
        .withReducer(notificationSlice.reducer)
        .provide([[call(notificationAPI.getNotificationList), throwError(simpleError)]])
        .put({ type: 'notification/getNotificationListFailure', payload: simpleError })
        .dispatch({ type: 'notification/getNotificationList' })
        .hasFinalState(initialState)
        .silentRun();
    });
  });
});
