/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupDetail from './GroupDetail';
import * as groupApi from '../../store/apis/group';
import { userType } from '../../store/apis/user';
import Router from 'react-router-dom';

const user1: userType = {
  username: 'test',
  nickname: 'test',
  image: 'image',
};

const fitelement1: groupApi.Fitelement = {
  id: 1,
  type: 'goal',
  workout_type: 'test',
  category: 'test',
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
  description: 'test',
  goal: [fitelement1],
  lat: null,
  lng: null,
  address: null,
};

const nullResponse1: groupApi.getGroupDetailResponseType = {
  group_id: 1,
  group_name: 'group_name',
  number: 3,
  start_date: null,
  end_date: null,
  free: true,
  group_leader: user1,
  member_number: 3,
  description: 'test',
  goal: [fitelement1],
  lat: null,
  lng: null,
  address: null,
};

const nullResponse2: groupApi.getGroupDetailResponseType = {
  group_id: 1,
  group_name: 'group_name',
  number: null,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  free: true,
  group_leader: user1,
  member_number: 3,
  description: 'test',
  goal: [fitelement1],
  lat: null,
  lng: null,
  address: null,
};

const leaderStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_leader',
};

const memberStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_member',
};

const notmemberStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'not_member',
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
      <GroupDetail />
    </Provider>,
  );
  return store;
};

describe('setup test', () => {
  it('all response', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
    screen.getByText('group_name');
    screen.getByText('2019-01-01 ~ 2019-01-01');
    screen.getByText('인원수: 3명 / 10명');
    screen.getByText('장소: 장소 없음');
  });
  it('back button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
    const back = screen.getByText('Back');
    fireEvent.click(back);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group');
  });
  it('null init1', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse1,
      });
    });
    screen.getByText('기간 없음');
    screen.getByText('시작일 : 기한없음');
    screen.getByText('마감일 : 기한없음');
  });
  it('null init2', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse2,
      });
    });
    screen.getByText('인원수: 3명');
  });
  it('leader status', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse1,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: leaderStatusResponse,
      });
    });
    const CertBtn = screen.getByText('Cert');
    const memberBtn = screen.getByText('Member');
    const deleteBtn = screen.getByText('Delete');

    fireEvent.click(memberBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/member');

    fireEvent.click(deleteBtn);
    expect(mockNavigate).toBeCalledTimes(1);

    fireEvent.click(CertBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/cert');
    expect(mockNavigate).toBeCalledTimes(2);
  });

  it('member status', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse1,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: memberStatusResponse,
      });
    });
    const CertBtn = screen.getByText('Cert');
    const memberBtn = screen.getByText('Member');
    const leaveBtn = screen.getByText('Leave');

    fireEvent.click(memberBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/member');

    fireEvent.click(leaveBtn);
    expect(mockNavigate).toBeCalledTimes(1);

    fireEvent.click(CertBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/cert');
    expect(mockNavigate).toBeCalledTimes(2);
  });

  it('not member status', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse2,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: notmemberStatusResponse,
      });
    });
    const joinBtn = screen.getByText('Join');

    fireEvent.click(joinBtn);
  });

  it('not member status & can not join', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse1,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: notmemberStatusResponse,
      });
    });
    const joinBtn = screen.getByText('Join');

    fireEvent.click(joinBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  // 이하부터 다시
  it('useEffect ', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailFailure',
        payload: {response: {status: 404}},
      });
    });
    screen.debug();
  });
});
