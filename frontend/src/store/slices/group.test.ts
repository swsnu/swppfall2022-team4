import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as groupApi from '../apis/group';
import groupSaga, { initialState, groupSlice } from './group';
import { userType } from 'store/apis/user';

const simpleError = new Error('error!');

jest.spyOn(global, 'alert').mockImplementation(msg => msg);

const fitelement1: groupApi.Fitelement = {
  id: 1,
  type: 'goal',
  workout_type: 'test',
  category: 'test',
  weight: 20,
  rep: 20,
  set: 20,
  time: 20,
};

const fitelement2: groupApi.Fitelement = {
  id: 2,
  type: 'goal',
  workout_type: 'test',
  category: 'test',
  weight: 20,
  rep: 20,
  set: 20,
  time: 20,
};

const fitelementRequest: groupApi.FitelementRequestType = {
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
  cert_days: 6,
};

const member2: groupApi.Member = {
  id: 2,
  username: 'user34',
  image: 'image',
  level: 1,
  cert_days: 6,
};

const group1: groupApi.Group = {
  id: 1,
  group_name: 'test',
  number: 5,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  member_number: 3,
  free: true,
  my_group: 'group_leader',
  lat: 31,
  lng: 126,
  address: 'jeju',
  tags: [],
  prime_tag: undefined,
};

const group2: groupApi.Group = {
  id: 2,
  group_name: 'test',
  number: 5,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  member_number: 3,
  free: true,
  my_group: 'group_leader',
  lat: 31,
  lng: 126,
  address: 'jeju',
  tags: [],
  prime_tag: undefined,
};

const memcert1: groupApi.MemberCert = {
  member: {
    username: 'test',
    nickname: 'test',
    image: 'image',
  },
  certs: [fitelement1],
  did: true,
};

const memreq1: groupApi.MemberReq = {
  id: 1,
  username: 'req1',
  image: 'image',
  level: 1,
}

const memreq2: groupApi.MemberReq = {
  id: 2,
  username: 'req2',
  image: 'image',
  level: 2,
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
  goal: [fitelementRequest],
  lat: 30,
  lng: 127,
  address: 'jeju',
  tags: [],
  prime_tag: undefined,
};

const leaderChangeRequest: groupApi.leaderChangeRequestType = {
  group_id: '1',
  username: 'junho',
};

const getCertsRequest: groupApi.getCertsRequestType = {
  group_id: '1',
  year: 2022,
  month: 9,
  specific_date: 12,
};

const certRequest: groupApi.certRequestType = {
  group_id: '1',
  year: 2022,
  month: 9,
  specific_date: 12,
  fitelement_id: 1,
};

const joinLeaderRequest: groupApi.joinReqLeaderRequestType = {
  group_id: '1',
  username: 'user',
}

//response
const getGroupsResponse: groupApi.getGroupsResponseType = {
  groups: [group1, group2],
};

const postGroupResponse: groupApi.postGroupResponseType = {
  id: 1,
};

const checkMemberResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_leader',
};

const getGroupMembersResponse: groupApi.getGroupMembersResponseType = {
  members: [member1, member2],
  group_leader: 'user',
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
  lat: 30,
  lng: 127,
  address: 'jeju',
  tags: [],
  prime_tag: undefined,
};

const getCertsResponse: groupApi.getCertsResponseType = {
  all_certs: [memcert1],
};

const getRequestsResponse: groupApi.getJoinReqResponseType = {
  requests: [memreq1, memreq2],
}

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
          group_leader: getGroupMembersResponse.group_leader,
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
  it('leaderChange', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.leaderChange, leaderChangeRequest), undefined]])
      .put({ type: 'group/leaderChangeSuccess', payload: undefined })
      .dispatch({ type: 'group/leaderChange', payload: leaderChangeRequest })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: true,
          error: null,
        },
      })
      .silentRun();
  });
  it('getCerts', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getCerts, getCertsRequest), getCertsResponse]])
      .put({
        type: 'group/getCertsSuccess',
        payload: getCertsResponse,
      })
      .dispatch({ type: 'group/getCerts', payload: getCertsRequest })
      .hasFinalState({
        ...initialState,
        groupCerts: {
          all_certs: getCertsResponse.all_certs,
          error: null,
        },
      })
      .silentRun();
  });
  it('createCert', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.createCert, certRequest), getCertsResponse]])
      .put({
        type: 'group/createCertSuccess',
        payload: getCertsResponse,
      })
      .dispatch({ type: 'group/createCert', payload: certRequest })
      .hasFinalState({
        ...initialState,
        groupCerts: {
          all_certs: getCertsResponse.all_certs,
          error: null,
        },
      })
      .silentRun();
  });
  it('deleteCert', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.deleteCert, certRequest), getCertsResponse]])
      .put({
        type: 'group/deleteCertSuccess',
        payload: getCertsResponse,
      })
      .dispatch({ type: 'group/deleteCert', payload: certRequest })
      .hasFinalState({
        ...initialState,
        groupCerts: {
          all_certs: getCertsResponse.all_certs,
          error: null,
        },
      })
      .silentRun();
  });
  it('getRequests', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getRequests, '1'), getRequestsResponse]])
      .put({
        type: 'group/getRequestsSuccess',
        payload: getRequestsResponse,
      })
      .dispatch({ type: 'group/getRequests', payload: '1' })
      .hasFinalState({
        ...initialState,
        reqMembers: {
          requests: getRequestsResponse.requests,
          error: null,
        },
      })
      .silentRun();
  });
  it('postRequest', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.postRequest, joinLeaderRequest), undefined]])
      .put({
        type: 'group/postRequestSuccess',
        payload: undefined,
      })
      .dispatch({ type: 'group/postRequest', payload: joinLeaderRequest })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: true,
          error: null,
        },
      })
      .silentRun();
  });
  it('deleteRequest', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.deleteRequest, joinLeaderRequest), undefined]])
      .put({
        type: 'group/deleteRequestSuccess',
        payload: undefined,
      })
      .dispatch({ type: 'group/deleteRequest', payload: joinLeaderRequest })
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
//----------------------------------------------------------------------------------------------------------------
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
          group_leader: null,
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
  it('leaderChange', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.leaderChange, leaderChangeRequest), throwError(simpleError)]])
      .put({ type: 'group/leaderChangeFailure', payload: simpleError })
      .dispatch({ type: 'group/leaderChange', payload: leaderChangeRequest })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: false,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('getCerts', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getCerts, getCertsRequest), throwError(simpleError)]])
      .put({ type: 'group/getCertsFailure', payload: simpleError })
      .dispatch({ type: 'group/getCerts', payload: getCertsRequest })
      .hasFinalState({
        ...initialState,
        groupCerts: {
          all_certs: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('createCert', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.createCert, certRequest), throwError(simpleError)]])
      .put({ type: 'group/createCertFailure', payload: simpleError })
      .dispatch({ type: 'group/createCert', payload: certRequest })
      .hasFinalState({
        ...initialState,
        groupCerts: {
          all_certs: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('deleteCert', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.deleteCert, certRequest), throwError(simpleError)]])
      .put({ type: 'group/deleteCertFailure', payload: simpleError })
      .dispatch({ type: 'group/deleteCert', payload: certRequest })
      .hasFinalState({
        ...initialState,
        groupCerts: {
          all_certs: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('getRequests', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.getRequests, '1'), throwError(simpleError)]])
      .put({ type: 'group/getRequestsFailure', payload: simpleError })
      .dispatch({ type: 'group/getRequests', payload: '1' })
      .hasFinalState({
        ...initialState,
        reqMembers: {
          requests: null,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('postRequest', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.postRequest, joinLeaderRequest), throwError(simpleError)]])
      .put({ type: 'group/postRequestFailure', payload: simpleError })
      .dispatch({ type: 'group/postRequest', payload: joinLeaderRequest })
      .hasFinalState({
        ...initialState,
        groupAction: {
          status: false,
          error: simpleError,
        },
      })
      .silentRun();
  });
  it('deleteRequest', () => {
    return expectSaga(groupSaga)
      .withReducer(groupSlice.reducer)
      .provide([[call(groupApi.deleteRequest, joinLeaderRequest), throwError(simpleError)]])
      .put({ type: 'group/deleteRequestFailure', payload: simpleError })
      .dispatch({ type: 'group/deleteRequest', payload: joinLeaderRequest })
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
