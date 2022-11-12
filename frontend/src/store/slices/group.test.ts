import { configureStore, isAsyncThunkAction } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as groupApi from '../apis/group';
import groupSaga, { groupSlice, groupActions } from './group';
import initialState from "./group";


const simpleError = new Error('error');

const member1: groupApi.Member = {
  id: 1,
  username: 'user1',
  cert_days: 7,
  image: 'image',
  level: 1
}
const member2: groupApi.Member = {
  id: 1,
  username: 'user1',
  cert_days: 7,
  image: 'image',
  level: 1
}

const fitelement1: groupApi.Fitelement = {
  type: 'goal',
  workout_type: 'test',
  category: 'test',
  weight: 20,
  rep: 20,
  set: 20,
  time: 20
}

const fitelement2: groupApi.Fitelement = {
  type: 'goal',
  workout_type: 'test',
  category: 'test',
  weight: 20,
  rep: 20,
  set: 20,
  time: 20
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
  goal: [fitelement1]
}

//response
const getGroupsResponse: groupApi.getGroupsResponseType = {
  groups: [
    {
      id: 1,
      group_name: 'test',
      number: 5,
      start_date: '2019-01-01',
      end_date: '2019-12-31',
      member_number: 3
    },
    {
      id: 2,
      group_name: 'test',
      number: 5,
      start_date: '2019-01-01',
      end_date: '2019-12-31',
      member_number: 3
    }
  ]
}

const checkMemberResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_leader'
}

const getGroupMembersResponse: groupApi.getGroupMembersResponseType = {
  members: [member1, member2]
}

const getGroupDetailResponse: groupApi.GroupDetail = {
  group_id: 1,
  group_name: 'test',
  number: 7,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  description: 'test',
  free: true,
  group_leader: {username: 'test', nickname: 'test', image: 'image'},
  goal: [fitelement1, fitelement2],
  member_number: 3
}

//test
describe('Group', () => {
  describe('saga success', () => {
    it('getGroups', () => {
      return expectSaga(groupSaga)
        .withReducer(groupSlice.reducer)
        .provide([[call(groupApi.getGroups), getGroupsResponse]])
        .put({ type: 'group/getGroupsSuccess', payload: getGroupsResponse})
        .dispatch({ type:'group/getGroups'})
        .hasFinalState({
          ...initialState,
          groupList: {
            groups: getGroupsResponse.groups,
            error: null
          }
    })
      .silentRun();
    });
  });
  describe('saga failure', () => {
    it('getGroups', () => {
      return expectSaga(groupSaga)
        .withReducer(groupSlice.reducer)
        .provide([[call(groupApi.getGroups), throwError(simpleError)]])
        .put({ type: 'group/getGroupsFailure', payload: simpleError})
        .dispatch({ type:'getGroups'})
        .hasFinalState({
          ...initialState,
          groupList: {
            groups: null,
            error: simpleError,
          },
      })
      .silentRun();
    });
  });
})