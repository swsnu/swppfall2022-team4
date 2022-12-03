/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, getByText } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupJoinReq from './GroupJoinReq';
import * as groupApi from '../../store/apis/group';
import Router from 'react-router-dom';
import { TagVisual } from 'store/apis/tag';
import { userType } from '../../store/apis/user';

const request1: groupApi.MemberReq = {
  id: 1,
  username: 'req1',
  image: 'image',
  level: 1,
}

const request2: groupApi.MemberReq = {
  id: 2,
  username: 'req2',
  image: 'image',
  level: 1,
}

const request3: groupApi.MemberReq = {
  id: 3,
  username: 'req3',
  image: 'image',
  level: 1,
}

const requestsResponse: groupApi.getJoinReqResponseType = {
  requests: [request1, request2, request3],
}

const single_tag: TagVisual = {
  id: '1',
  name: '데드리프트',
  color: '#dbdbdb'
}

const user1: userType = {
  username: 'username',
  nickname: 'nickname',
  image: 'image',
};

const fitelement1: groupApi.Fitelement = {
  id: 1,
  type: 'goal',
  workout_type: '벤치프레스',
  category: '가슴운동',
  weight: 20,
  rep: 10,
  set: 10,
  time: 10,
};

const groupDetailResponse: groupApi.getGroupDetailResponseType = {
  group_id: 1,
  group_name: 'group_name',
  number: 10,
  start_date: '2019-01-01',
  end_date: '2019-01-01',
  free: true,
  group_leader: user1,
  member_number: 3,
  description: 'group_description',
  goal: [fitelement1],
  lat: 31,
  lng: 126,
  address: '봉천동',
  tags: [single_tag],
  prime_tag: single_tag,
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
      <GroupJoinReq />
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
        type: 'group/getRequestsSuccess',
        payload: requestsResponse,
      });
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
    screen.getByText('req1');
    screen.getAllByText('승인');

    const btn = screen.getByText('Back');
    fireEvent.click(btn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/');
  });
  it('action', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getRequestsSuccess',
        payload: requestsResponse,
      });
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
    screen.getByText('req1');

    act(() => {
      store.dispatch({
        type: 'group/postRequestSuccess',
      });
    });

    expect(mockDispatch).toBeCalledTimes(5);
  });
  it('no gr id', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: undefined });
    setup();
  });
  it('get requests failure', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getRequestsFailure',
      });
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
    screen.getByText('FITogether');
  });
})
