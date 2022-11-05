import { AxiosError, AxiosResponse } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as groupAPI from '../apis/group';
import * as Effect from 'redux-saga/effects';

interface GroupState {
  groupList: {
    groups: groupAPI.Group[] | null;
    error: AxiosError | null;
  };
  groupDetail: {
    groupdetail: groupAPI.GroupDetail | null;
    error: AxiosError | null;
  };
  groupCreate: {
    status: boolean;
    group_id: string | null;
  };
  groupDelete: boolean;
}

const initialState: GroupState = {
  groupList: {
    groups: null,
    error: null,
  },
  groupDetail: {
    groupdetail: null,
    error: null,
  },
  groupCreate: {
    status: false,
    group_id: null,
  },
  groupDelete: false,
};

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    getGroups: (state, action: PayloadAction<string>) => {
      console.log('getGroups!');
      state.groupList.groups = null;
      state.groupList.error = null;
    },
    getGroupsSuccess: (state, { payload }) => {
      state.groupList.groups = payload;
    },
    getGroupsFailure: (state, { payload }) => {
      state.groupList.error = payload;
    },
    createGroup: (state, action: PayloadAction<groupAPI.postGroupRequestType>) => {
      state.groupCreate.group_id = null;
      state.groupCreate.status = false;
    },
    createGroupSuccess: (state, { payload }) => {
      console.log(payload);
      state.groupCreate.group_id = payload.id;
      state.groupCreate.status = true;
    },
    createGroupFailure: (state, { payload }) => {
      state.groupCreate.status = false;
    },
    getGroupDetail: (state, action: PayloadAction<groupAPI.getGroupDetailRequestType>) => {
      state.groupDetail.groupdetail = null;
      state.groupDetail.error = null;
    },
    getGroupDetailSuccess: (state, { payload }) => {
      state.groupDetail.groupdetail = payload;
    },
    getGroupDetailFailure: (state, { payload }) => {
      state.groupDetail.error = payload;
    },
    deleteGroup: (state, action: PayloadAction<groupAPI.deleteGroupRequestType>) => {
      state.groupDelete = false;
    },
    deleteGroupSuccess: (state, { payload }) => {
      state.groupDelete = true;
    },
    deleteGroupFailure: (state, { payload }) => {
      state.groupDelete = false;
    },
    stateRefresh: state => {
      state.groupCreate.status = false;
      state.groupDelete = false;
    },
  },
});
export const groupActions = groupSlice.actions;

function* getGroupsSaga(action: PayloadAction<string>) {
  try {
    const response: AxiosResponse = yield Effect.call(groupAPI.getGroups, action.payload);
    yield Effect.put(groupActions.getGroupsSuccess(response));
  } catch (error) {
    yield Effect.put(groupActions.getGroupsFailure(error));
  }
}

function* createGroupSaga(action: PayloadAction<groupAPI.postGroupRequestType>) {
  try {
    const response: AxiosResponse = yield Effect.call(groupAPI.postGroup, action.payload);
    yield Effect.put(groupActions.createGroupSuccess(response));
  } catch (error) {
    yield Effect.put(groupActions.createGroupFailure(error));
  }
}

function* getGroupDetailSaga(action: PayloadAction<groupAPI.getGroupDetailRequestType>) {
  try {
    const response: AxiosResponse = yield Effect.call(groupAPI.getGroupDetail, action.payload);
    yield Effect.put(groupActions.getGroupDetailSuccess(response));
  } catch (error) {
    yield Effect.put(groupActions.getGroupDetailFailure(error));
  }
}

function* deleteGroupSaga(action: PayloadAction<groupAPI.deleteGroupRequestType>) {
  try {
    const response: AxiosResponse = yield Effect.call(groupAPI.deleteGroup, action.payload);
    yield Effect.put(groupActions.deleteGroupSuccess(response));
  } catch (error) {
    yield Effect.put(groupActions.deleteGroupFailure(error));
  }
}

export default function* groupSaga() {
  yield Effect.takeLatest(groupActions.getGroups, getGroupsSaga);
  yield Effect.takeLatest(groupActions.createGroup, createGroupSaga);
  yield Effect.takeLatest(groupActions.getGroupDetail, getGroupDetailSaga);
  yield Effect.takeLatest(groupActions.deleteGroup, deleteGroupSaga);
}
