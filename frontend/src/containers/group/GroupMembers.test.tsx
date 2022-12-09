/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupMembers from './GroupMembers';
import * as groupApi from '../../store/apis/group';
import Router from 'react-router-dom';

const mem1: groupApi.Member = {
  id: 1,
  username: 'test1',
  image: 'image',
  level: 1,
  cert_days: 6,
};

const mem2: groupApi.Member = {
  id: 2,
  username: 'test2',
  image: 'image',
  level: 1,
  cert_days: 6,
};

const mem3: groupApi.Member = {
  id: 2,
  username: 'username',
  image: 'image',
  level: 1,
  cert_days: 6,
};

const membersResponse: groupApi.getGroupMembersResponseType = {
  members: [mem1, mem2, mem3],
  group_leader: 'test1',
};

const leaderStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_leader',
};

const memberStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_member',
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <GroupMembers />
    </Provider>,
  );
  return store;
};

describe('setup test', () => {
  it('init', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupMembersSuccess',
        payload: membersResponse,
      });
    });
    screen.getByText('그룹 멤버');
    screen.getByText('👑 test1');
  });
  it('btn', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupMembersSuccess',
        payload: membersResponse,
      });
    });
  });
  it('init useEffect', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    setup();
    expect(mockDispatch).toBeCalledTimes(2);
  });
  it('no group_id', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: undefined });
    setup();
  });
  //Here!
  it('no memberList', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupMemberFailure',
        payload: null,
      });
    });
  });
  it('group leader', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupMembersSuccess',
        payload: membersResponse,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: leaderStatusResponse,
      });
    });
    screen.getAllByText('그룹장 위임');
  });
  it('group member', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupMembersSuccess',
        payload: membersResponse,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: memberStatusResponse,
      });
    });
  });
  it('myself', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupMembersSuccess',
        payload: membersResponse,
      });
    });
    screen.getByText('username');
  });
  it('loading', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupMembersFailure',
        payload: null,
      });
    });
    screen.getByText('FITogether');
  });
});
