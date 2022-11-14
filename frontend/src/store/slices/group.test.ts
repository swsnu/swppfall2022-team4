import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as groupApi from '../apis/group';
import groupSaga, { initialState, groupSlice } from './group';
import { userType } from 'store/apis/user';

const simpleError = new Error('error!');

jest.spyOn(global, 'alert').mockImplementation(msg => msg);

const fitelement1: groupApi.Fitelement = {
  type: 'goal',
  workout_type: 'test',
  category: 'test',
  weight: 20,
  rep: 20,
  set: 20,
  time: 20,
};

const fitelement2: groupApi.Fitelement = {
  type: 'goal',
  workout_type: 'test',
  category: 'test',
  weight: 20,
  rep: 20,
  set: 20,
  time: 20,
};

const member1: groupApi.Member = {
  id: 1,
  username: 'user12',
  image: 'image',
  level: 1,
}

const member2: groupApi.Member = {
  id: 2,
  username: 'user34',
  image: 'image',
  level: 1,
}

const group1: groupApi.Group = {
  id: 1,
  group_name: 'test',
  number: 5,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  member_number: 3,
}

const group2: groupApi.Group = {
  id: 2,
  group_name: 'test',
  number: 5,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  member_number: 3,
}

//request
const postGroupRequest: groupApi.postGroupRequestType = {
  group_name: 'test',
  number: 7,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  description: 'test',
  free: true,
  group_leader: 'test',
  goal: [fitelement1],
};

//response
const getGroupsResponse: groupApi.getGroupsResponseType = {
  groups: [group1, group2],
};

const postGroupResponse: groupApi.postGroupResponseType = {
  id: 1,
}

const checkMemberResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_leader',
};

const getGroupMembersResponse: groupApi.getGroupMembersResponseType = {
  members: [member1, member2],
};

const getGroupDetailResponse: groupApi.getGroupDetailResponseType = {
  group_id: 1,
  group_name: 'test',
  number: 7,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  description: 'test',
  free: true,
  group_leader: { username: 'test', nickname: 'test', image: 'image' },
  goal: [fitelement1, fitelement2],
  member_number: 3,
};

//test
describe('Group', () => {
  describe('saga success', () => {
    it('getGroups', () => {
      return expectSaga(groupSaga)
        .withReducer(groupSlice.reducer)
        .provide([[call(groupApi.getGroups), getGroupsResponse]])
        .put({ type: 'group/getGroupsSuccess', payload: getGroupsResponse })
        .dispatch({ type: 'group/getGroups' })
        .hasFinalState({
          ...initialState,
          groupList: {
            groups: getGroupsResponse.groups,
            error: null,
          },
        })
        .silentRun();
    });
    it('postGroup', () => {
      return expectSaga(groupSaga)
        .withReducer(groupSlice.reducer)
        .provide([[call(groupApi.postGroup, postGroupRequest), postGroupResponse]])
        .put({
          type: 'group/createGroupSuccess',
          payload: postGroupResponse,
        })
        .dispatch({
          type: 'group/createGroup',
          payload: postGroupRequest,
        })
        .hasFinalState({
          ...initialState,
          groupCreate: {
            group_id: postGroupResponse.id,
            error: null,
          },
        })
        .silentRun();
    });
  });
  it('getGroupDetail', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getGroupDetail, '1'), getGroupDetailResponse]])
      .put({
        type: 'group/getGroupDetailSuccess',
        payload: getGroupDetailResponse,
      })
      .dispatch({ type: 'group/getGroupDetail', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupDetail: {
          group: getGroupDetailResponse,
          error: null,
        },
      })
      .silentRun();
  });
  it('deleteGroup', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.deleteGroup, '1'), undefined]])
      .put({ type: 'group/deleteGroupSuccess', payload: undefined })
      .dispatch({ type: 'group/deleteGroup', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupDelete: true,
      })
      .silentRun();
  });
  it('member_check', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.checkGroupMember, '1'), checkMemberResponse]])
      .put({
        type: 'group/checkMemberStatusSuccess',
        payload: checkMemberResponse,
      })
      .dispatch({ type: 'group/checkMemberStatus', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupMemberStatus: {
          member_status: checkMemberResponse.member_status,
          error: null,
        },
      })
      .silentRun();
  });
  it('getGroupMembers', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getGroupMembers, '1'), getGroupMembersResponse]])
      .put({
        type: 'group/getGroupMembersSuccess',
        payload: getGroupMembersResponse,
      })
      .dispatch({ type: 'group/getGroupMembers', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupMembers: {
          members: getGroupMembersResponse.members,
          error: null,
        },
      })
      .silentRun();
  });
  it('joinGroup', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.joinGroup, '1'), undefined]])
      .put({ type: 'group/joinGroupSuccess', payload: undefined })
      .dispatch({ type: 'group/joinGroup', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: true,
          error: null,
        },
      })
      .silentRun();
  });
  it('exitGroup', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.exitGroup, '1'), undefined]])
      .put({ type: 'group/exitGroupSuccess', payload: undefined })
      .dispatch({ type: 'group/exitGroup', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: true,
          error: null,
        },
      })
      .silentRun();
  });
});
//----------------------------------------------------------------
describe('saga failure', () => {
  it('getGroups', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getGroups), throwError(simpleError)]])
      .put({ type: 'group/getGroupsFailure', payload: simpleError })
      .dispatch({ type: 'group/getGroups' })
      .hasFinalState({
        ...initialState,
        groupList: {
          groups: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('postGroup', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.postGroup, postGroupRequest), throwError(simpleError)]])
      .put({ type: 'group/createGroupFailure', payload: simpleError })
      .dispatch({ type: 'group/createGroup', payload: postGroupRequest })
      .hasFinalState({
        ...initialState,
        groupCreate: {
          group_id: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('getGroupDetail', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getGroupDetail, '1'), throwError(simpleError)]])
      .put({ type: 'group/getGroupDetailFailure', payload: simpleError })
      .dispatch({ type: 'group/getGroupDetail', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupDetail: {
          group: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('deleteGroup', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.deleteGroup, '1'), throwError(simpleError)]])
      .put({ type: 'group/deleteGroupFailure', payload: simpleError })
      .dispatch({ type: 'group/deleteGroup', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupDelete: false,
      })
      .silentRun();
  });
  it('member_check', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.checkGroupMember, '1'), throwError(simpleError)]])
      .put({ type: 'group/checkMemberStatusFailure', payload: simpleError })
      .dispatch({ type: 'group/checkMemberStatus', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupMemberStatus: {
          member_status: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('getGroupMembers', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getGroupMembers, '1'), throwError(simpleError)]])
      .put({ type: 'group/getGroupMembersFailure', payload: simpleError })
      .dispatch({ type: 'group/getGroupMembers', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupMembers: {
          members: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('joinGroup', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.joinGroup, '1'), throwError(simpleError)]])
      .put({ type: 'group/joinGroupFailure', payload: simpleError })
      .dispatch({ type: 'group/joinGroup', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: false,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('exitGroup', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.exitGroup, '1'), throwError(simpleError)]])
      .put({ type: 'group/exitGroupFailure', payload: simpleError })
      .dispatch({ type: 'group/exitGroup', payload: '1' })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: false,
          error: simpleError,
        },
      })
      .silentRun();
  });
});
