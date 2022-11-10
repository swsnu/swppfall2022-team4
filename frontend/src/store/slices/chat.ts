/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as chatAPI from 'store/apis/chat';

interface ChatState {
  socket: any;
  where: string | null;

  chatroomList: chatAPI.chatroomType[];
  messageList: chatAPI.messageType[];
  error: AxiosError | null;
}
export const initialState: ChatState = {
  socket: null,
  where: null,

  chatroomList: [],
  messageList: [],
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket: (state, { payload }) => {
      state.socket = payload;
    },
    setWhere: (state, { payload }) => {
      state.where = payload;
    },
    addMessage: (state, { payload }) => {
      state.messageList.push(payload);
    },
    getChatroomList: (state, action: PayloadAction<string>) => {
      state.error = null;
    },
    getChatroomListSuccess: (state, { payload }) => {
      state.chatroomList = payload;
      state.error = null;
    },
    getChatroomListFailure: (state, { payload }) => {
      state.chatroomList = [];
      state.error = payload;
      alert(payload.response?.data.message);
    },
    getMessageList: (state, action: PayloadAction<string>) => {
      state.messageList = [];
      state.error = null;
    },
    getMessageListSuccess: (state, { payload }) => {
      state.messageList = payload;
      state.error = null;
    },
    getMessageListFailure: (state, { payload }) => {
      state.messageList = [];
      state.error = payload;
      alert(payload.response?.data.message);
    },
  },
});
export const chatActions = chatSlice.actions;

function* getChatroomListSaga(action: PayloadAction<string>) {
  try {
    const response: AxiosResponse = yield call(chatAPI.getChatroomList, action.payload);
    yield put(chatActions.getChatroomListSuccess(response));
  } catch (error) {
    yield put(chatActions.getChatroomListFailure(error));
  }
}
function* getMessageListSaga(action: PayloadAction<string>) {
  try {
    const response: AxiosResponse = yield call(chatAPI.getMessageList, action.payload);
    yield put(chatActions.getMessageListSuccess(response));
  } catch (error) {
    yield put(chatActions.getMessageListFailure(error));
  }
}

export default function* chatSaga() {
  yield takeLatest(chatActions.getChatroomList, getChatroomListSaga);
  yield takeLatest(chatActions.getMessageList, getMessageListSaga);
}
