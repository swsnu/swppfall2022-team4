/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as groupAPI from '../apis/group';

interface GroupState {
  groupList: {
    groups: groupAPI.Group[] | null;
    error: AxiosError | null;
  };
  groupCreate: {
    group_id: string | null;
    error: AxiosError | null;
  };
  groupDetail: {
    group: groupAPI.getGroupDetailResponseType | null;
    error: AxiosError | null;
  };
  groupDelete: boolean;
  groupMemberStatus: {
    member_status: string | null;
    error: AxiosError | null;
  };
  groupAction: {
    status: boolean;
    error: AxiosError | null;
  };
  groupMembers: {
    members: groupAPI.Member[] | null;
    error: AxiosError | null;
  };
  groupCerts: {
    all_certs: groupAPI.MemberCert[] | null;
    error: AxiosError | null;
  };
}

export const initialState: GroupState = {
  groupList: {
    groups: null,
    error: null,
  },
  groupCreate: {
    group_id: null,
    error: null,
  },
  groupDetail: {
    group: null,
    error: null,
  },
  groupDelete: false,
  groupMemberStatus: {
    member_status: null,
    error: null,
  },
  groupAction: {
    status: false,
    error: null,
  },
  groupMembers: {
    members: [],
    error: null,
  },
  groupCerts: {
    all_certs: [],
    error: null,
  },
};

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    stateRefresh: () => initialState,

    getGroups: state => {
      state.groupList.groups = null;
      state.groupList.error = null;
    },
    getGroupsSuccess: (state, { payload }) => {
      state.groupList.groups = payload.groups;
      state.groupList.error = null;
    },
    getGroupsFailure: (state, { payload }) => {
      state.groupList.groups = null;
      state.groupList.error = payload;
      alert(payload.response?.data.message);
    },
    createGroup: (state, action: PayloadAction<groupAPI.postGroupRequestType>) => {
      state.groupCreate.group_id = null;
      state.groupCreate.error = null;
    },
    createGroupSuccess: (state, { payload }) => {
      state.groupCreate.group_id = payload.id;
      state.groupCreate.error = null;
    },
    createGroupFailure: (state, { payload }) => {
      state.groupCreate.group_id = null;
      state.groupCreate.error = payload;
      alert(payload.response?.data.message);
    },
    getGroupDetail: (state, action: PayloadAction<string>) => {
      state.groupDetail.group = null;
      state.groupDetail.error = null;
    },
    getGroupDetailSuccess: (state, { payload }) => {
      state.groupDetail.group = payload;
      state.groupDetail.error = null;
    },
    getGroupDetailFailure: (state, { payload }) => {
      state.groupDetail.group = null;
      state.groupDetail.error = payload;
      alert(payload.response?.data.message);
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groupDelete = false;
    },
    deleteGroupSuccess: state => {
      state.groupDelete = true;
    },
    deleteGroupFailure: (state, { payload }) => {
      state.groupDelete = false;
      alert(payload.response?.data.message);
    },
    checkMemberStatus: (state, action: PayloadAction<string>) => {
      state.groupMemberStatus.member_status = null;
      state.groupMemberStatus.error = null;
    },
    checkMemberStatusSuccess: (state, { payload }) => {
      state.groupMemberStatus.member_status = payload.member_status;
      state.groupMemberStatus.error = null;
    },
    checkMemberStatusFailure: (state, { payload }) => {
      state.groupMemberStatus.member_status = null;
      state.groupMemberStatus.error = payload;
      alert(payload.response?.data.message);
    },
    getGroupMembers: (state, action: PayloadAction<string>) => {
      state.groupMembers.members = null;
      state.groupMembers.error = null;
    },
    getGroupMembersSuccess: (state, { payload }) => {
      state.groupMembers.members = payload.members;
      state.groupMembers.error = null;
    },
    getGroupMembersFailure: (state, { payload }) => {
      state.groupMembers.error = payload;
    },
    joinGroup: (state, action: PayloadAction<string>) => {
      state.groupAction.status = false;
      state.groupAction.error = null;
    },
    joinGroupSuccess: state => {
      state.groupAction.status = true;
      state.groupAction.error = null;
    },
    joinGroupFailure: (state, { payload }) => {
      state.groupAction.status = false;
      state.groupAction.error = payload;
      alert(payload.response?.data.message);
    },
    exitGroup: (state, action: PayloadAction<string>) => {
      state.groupAction.status = false;
      state.groupMemberStatus.error = null;
    },
    exitGroupSuccess: state => {
      state.groupAction.status = true;
      state.groupAction.error = null;
    },
    exitGroupFailure: (state, { payload }) => {
      state.groupAction.status = false;
      state.groupAction.error = payload;
      alert(payload.response?.data.message);
    },
    leaderChange: (state, action: PayloadAction<groupAPI.leaderChangeRequestType>) => {
      state.groupAction.status = false;
      state.groupMemberStatus.error = null;
    },
    leaderChangeSuccess: state => {
      state.groupAction.status = true;
      state.groupAction.error = null;
    },
    leaderChangeFailure: (state, { payload }) => {
      state.groupAction.status = false;
      state.groupAction.error = payload;
    },
    getCerts: (state, action: PayloadAction<groupAPI.getCertsRequestType>) => {
      state.groupCerts.all_certs = null;
      state.groupCerts.error = null;
    },
    getCertsSuccess: (state, { payload }) => {
      state.groupCerts.all_certs = payload.all_certs;
      state.groupCerts.error = null;
    },
    getCertsFailure: (state, { payload }) => {
      state.groupCerts.error = payload;
    },
    createCert: (state, action: PayloadAction<groupAPI.createCertRequestType>) => {
      state.groupCerts.all_certs = null;
      state.groupCerts.error = null;
    },
    createCertSuccess: (state, { payload }) => {
      state.groupCerts.all_certs = payload.all_certs;
      state.groupCerts.error = null;
    },
    createCertFailure: (state, { payload }) => {
      state.groupCerts.error = payload;
    },
  },
});
export const groupActions = groupSlice.actions;

function* getGroupsSaga() {
  try {
    const response: AxiosResponse = yield call(groupAPI.getGroups);
    yield put(groupActions.getGroupsSuccess(response));
  } catch (error) {
    yield put(groupActions.getGroupsFailure(error));
  }
}
function* createGroupSaga(action: PayloadAction<groupAPI.postGroupRequestType>) {
  try {
    const response: AxiosResponse = yield call(groupAPI.postGroup, action.payload);
    yield put(groupActions.createGroupSuccess(response));
  } catch (error) {
    yield put(groupActions.createGroupFailure(error));
  }
}
function* getGroupDetailSaga(action: PayloadAction<string>) {
  try {
    const response: AxiosResponse = yield call(groupAPI.getGroupDetail, action.payload);
    yield put(groupActions.getGroupDetailSuccess(response));
  } catch (error) {
    yield put(groupActions.getGroupDetailFailure(error));
  }
}
function* deleteGroupSaga(action: PayloadAction<string>) {
  try {
    yield call(groupAPI.deleteGroup, action.payload);
    yield put(groupActions.deleteGroupSuccess());
  } catch (error) {
    yield put(groupActions.deleteGroupFailure(error));
  }
}
function* checkMemberStatusSaga(action: PayloadAction<string>) {
  try {
    const response: AxiosResponse = yield call(groupAPI.checkGroupMember, action.payload);
    yield put(groupActions.checkMemberStatusSuccess(response));
  } catch (error) {
    yield put(groupActions.checkMemberStatusFailure(error));
  }
}
function* getGroupMembersSaga(action: PayloadAction<string>) {
  try {
    const response: AxiosResponse = yield call(groupAPI.getGroupMembers, action.payload);
    yield put(groupActions.getGroupMembersSuccess(response));
  } catch (error) {
    yield put(groupActions.getGroupMembersFailure(error));
  }
}
function* joinGroupSaga(action: PayloadAction<string>) {
  try {
    yield call(groupAPI.joinGroup, action.payload);
    yield put(groupActions.joinGroupSuccess());
  } catch (error) {
    yield put(groupActions.joinGroupFailure(error));
  }
}
function* exitGroupSaga(action: PayloadAction<string>) {
  try {
    yield call(groupAPI.exitGroup, action.payload);
    yield put(groupActions.exitGroupSuccess());
  } catch (error) {
    yield put(groupActions.exitGroupFailure(error));
  }
}
function* leaderChangeSaga(action: PayloadAction<groupAPI.leaderChangeRequestType>) {
  try {
    yield call(groupAPI.leaderChange, action.payload);
    yield put(groupActions.leaderChangeSuccess());
  } catch (error) {
    yield put(groupActions.leaderChangeFailure(error));
  }
}
function* createCertSaga(action: PayloadAction<groupAPI.createCertRequestType>) {
  try {
    const response: AxiosResponse = yield call(groupAPI.createCert, action.payload);
    yield put(groupActions.createCertSuccess(response));
  } catch (error) {
    yield put(groupActions.createCertFailure(error));
  }
}
function* getCertsSaga(action: PayloadAction<groupAPI.getCertsRequestType>) {
  try {
    const response: AxiosResponse = yield call(groupAPI.getCerts, action.payload);
    yield put(groupActions.getCertsSuccess(response));
  } catch (error) {
    yield put(groupActions.getCertsFailure(error));
  }
}

export default function* groupSaga() {
  yield takeLatest(groupActions.getGroups, getGroupsSaga);
  yield takeLatest(groupActions.createGroup, createGroupSaga);
  yield takeLatest(groupActions.getGroupDetail, getGroupDetailSaga);
  yield takeLatest(groupActions.deleteGroup, deleteGroupSaga);
  yield takeLatest(groupActions.getGroupMembers, getGroupMembersSaga);
  yield takeLatest(groupActions.checkMemberStatus, checkMemberStatusSaga);
  yield takeLatest(groupActions.joinGroup, joinGroupSaga);
  yield takeLatest(groupActions.exitGroup, exitGroupSaga);
  yield takeLatest(groupActions.leaderChange, leaderChangeSaga);
  yield takeLatest(groupActions.createCert, createCertSaga);
  yield takeLatest(groupActions.getCerts, getCertsSaga);
}
