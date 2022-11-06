import { configureStore } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as chatAPI from '../apis/chat';
import chatSaga, { initialState, chatSlice, chatActions } from './chat';

const simpleError = new Error('error!');

jest.spyOn(global, 'alert').mockImplementation(msg => msg);

describe('slices - chat', () => {
  test.each([
    [chatActions.setSocket('socket'), { ...initialState, socket: 'socket' }],
    [chatActions.getChatroomList('11111111'), initialState],
    [chatActions.getChatroomListSuccess('data'), { ...initialState, chatroomList: 'data' }],
    [chatActions.getChatroomListFailure('error'), { ...initialState, error: 'error' }],
    [chatActions.getMessageList('11111111'), initialState],
    [chatActions.getMessageListSuccess('data'), { ...initialState, messageList: 'data' }],
    [chatActions.getMessageListFailure('error'), { ...initialState, error: 'error' }],
  ])('reducer', (action, state) => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(action);
    expect(store.getState().chat).toEqual(state);
  });

  describe('saga success', () => {
    test('getChatroomList', () => {
      return expectSaga(chatSaga)
        .withReducer(chatSlice.reducer)
        .provide([[call(chatAPI.getChatroomList, '11111111'), 'data']])
        .put({ type: 'chat/getChatroomListSuccess', payload: 'data' })
        .dispatch({ type: 'chat/getChatroomList', payload: '11111111' })
        .hasFinalState({ ...initialState, chatroomList: 'data' })
        .silentRun();
    });
    test('getMessageList', () => {
      return expectSaga(chatSaga)
        .withReducer(chatSlice.reducer)
        .provide([[call(chatAPI.getMessageList, '11111111'), 'data']])
        .put({ type: 'chat/getMessageListSuccess', payload: 'data' })
        .dispatch({ type: 'chat/getMessageList', payload: '11111111' })
        .hasFinalState({ ...initialState, messageList: 'data' })
        .silentRun();
    });
  });

  describe('saga failure', () => {
    test('getChatroomList', () => {
      return expectSaga(chatSaga)
        .withReducer(chatSlice.reducer)
        .provide([[call(chatAPI.getChatroomList, '11111111'), throwError(simpleError)]])
        .put({ type: 'chat/getChatroomListFailure', payload: simpleError })
        .dispatch({ type: 'chat/getChatroomList', payload: '11111111' })
        .hasFinalState({ ...initialState, error: simpleError })
        .silentRun();
    });
    test('getMessageList', () => {
      return expectSaga(chatSaga)
        .withReducer(chatSlice.reducer)
        .provide([[call(chatAPI.getMessageList, '11111111'), throwError(simpleError)]])
        .put({ type: 'chat/getMessageListFailure', payload: simpleError })
        .dispatch({ type: 'chat/getMessageList', payload: '11111111' })
        .hasFinalState({ ...initialState, error: simpleError })
        .silentRun();
    });
  });
});
