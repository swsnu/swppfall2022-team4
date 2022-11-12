/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
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
  cert_days: 7,
  image: 'image',
  level: 1,
};

const mem2: groupApi.Member = {
  id: 2,
  username: 'test2',
  cert_days: 7,
  image: 'image',
  level: 1,
};

const membersResponse: groupApi.getGroupMembersResponseType = {
  members: [mem1, mem2],
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
    const btn = screen.getByText('Back');
    fireEvent.click(btn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/');
  });
});
