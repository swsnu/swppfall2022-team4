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
import { TagVisual } from 'store/apis/tag';

const user1: userType = {
  username: 'group_leader',
  nickname: 'test',
  image: 'image',
};

const single_tag: TagVisual = {
  id: '1',
  name: '데드리프트',
  color: '#dbdbdb',
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

const nullResponse: groupApi.getGroupDetailResponseType = {
  group_id: 1,
  group_name: 'group_name',
  number: null,
  start_date: null,
  end_date: null,
  free: false,
  group_leader: user1,
  member_number: 3,
  description: 'test',
  goal: [fitelement1],
  lat: null,
  lng: null,
  address: null,
  tags: [single_tag],
  prime_tag: single_tag,
};

const fullResponse: groupApi.getGroupDetailResponseType = {
  group_id: 1,
  group_name: 'group_name',
  number: 3,
  start_date: null,
  end_date: null,
  free: false,
  group_leader: user1,
  member_number: 3,
  description: 'test',
  goal: [fitelement1],
  lat: null,
  lng: null,
  address: null,
  tags: [single_tag],
  prime_tag: single_tag,
};

const leaderStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_leader',
};

const memberStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'group_member',
};

const pendingmemberStatusResponse: groupApi.checkGroupMemberResponseType = {
  member_status: 'request_member',
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
    screen.getAllByText('장소: 봉천동');
    screen.getByText('group_leader');
    screen.getByText('group_description');
    screen.getByText('Goal');
    screen.getByText('시작일 : 2019-01-01');
    screen.getByText('벤치프레스');
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

    const profile = screen.getByAltText('profile');
    fireEvent.click(profile);
    expect(mockNavigate).toBeCalledWith('/profile/group_leader');
    expect(mockNavigate).toBeCalledTimes(1);
  });
  it('failure response', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailFailure',
        payload: { response: { status: 404 } },
      });
    });
    expect(mockNavigate).toBeCalledWith('/not_found');
    expect(mockNavigate).toBeCalledTimes(1);
  });
  it('wrong url', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: undefined });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailFailure',
        payload: { response: { status: 404 } },
      });
    });
  });
  it('nullResponse', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse,
      });
    });
    screen.getByText('기간 없음');
    screen.getByText('인원수: 3명');
    screen.getByText('시작일 : 기한없음');
    screen.getByText('마감일 : 기한없음');
  });
  it('leader status', () => {
    const confirmMock = jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: leaderStatusResponse,
      });
    });
    const CertBtn = screen.getByText('운동 인증');
    const ChatBtn = screen.getByText('그룹 채팅');
    const memberBtn = screen.getByText('그룹 멤버');
    const PostBtn = screen.getByText('커뮤니티');
    const JoinReqBtn = screen.getByText('멤버 요청');
    const deleteBtn = screen.getByText('그룹 삭제');

    fireEvent.click(CertBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/cert');
    expect(mockNavigate).toBeCalledTimes(1);

    fireEvent.click(ChatBtn);
    expect(mockNavigate).toBeCalledWith('/group/chat/1');
    expect(mockNavigate).toBeCalledTimes(2);

    fireEvent.click(memberBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/member');
    expect(mockNavigate).toBeCalledTimes(3);

    fireEvent.click(PostBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/post');
    expect(mockNavigate).toBeCalledTimes(4);

    fireEvent.click(JoinReqBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/joinReq');
    expect(mockNavigate).toBeCalledTimes(5);

    fireEvent.click(deleteBtn);
    expect(confirmMock).toBeCalledWith('정말 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
  });

  it('member status', () => {
    const confirmMock = jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: memberStatusResponse,
      });
    });
    const CertBtn = screen.getByText('운동 인증');
    const ChatBtn = screen.getByText('그룹 채팅');
    const memberBtn = screen.getByText('그룹 멤버');
    const PostBtn = screen.getByText('커뮤니티');
    const leaveBtn = screen.getByText('그룹 탈퇴');

    fireEvent.click(CertBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/cert');
    expect(mockNavigate).toBeCalledTimes(1);

    fireEvent.click(ChatBtn);
    expect(mockNavigate).toBeCalledWith('/group/chat/1');
    expect(mockNavigate).toBeCalledTimes(2);

    fireEvent.click(memberBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/member');
    expect(mockNavigate).toBeCalledTimes(3);

    fireEvent.click(PostBtn);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/post');
    expect(mockNavigate).toBeCalledTimes(4);

    fireEvent.click(leaveBtn);
    expect(confirmMock).toBeCalledWith('정말 그룹을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
  });

  it('not member status & can join', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: notmemberStatusResponse,
      });
    });
    const joinBtn = screen.getByText('그룹 가입');

    fireEvent.click(joinBtn);
    act(() => {
      store.dispatch({
        type: 'group/joinGroupSuccess',
        payload: null,
      });
    });
  });

  it('not member status & pending', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: nullResponse,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: notmemberStatusResponse,
      });
    });
    const joinBtn = screen.getByText('그룹 가입');
    fireEvent.click(joinBtn);

    act(() => {
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: pendingmemberStatusResponse,
      });
    });
    screen.getByText('승인 대기');
  });

  it('not member status & can not join', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    const store = setup();
    expect(mockDispatch).toBeCalledWith({ payload: '1', type: 'group/getGroupDetail' });
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: fullResponse,
      });
      store.dispatch({
        type: 'group/checkMemberStatusSuccess',
        payload: notmemberStatusResponse,
      });
    });
    const joinBtn = screen.getByText('그룹 가입');

    fireEvent.click(joinBtn);
    expect(alertMock).toBeCalledWith('정원이 모두 찬 그룹입니다.');
  });

  // 이하부터 다시
  it('useEffect ', () => {
    jest.spyOn(window, 'alert').mockImplementation();
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailFailure',
        payload: { response: { data: { status: 404, message: 'error' } } },
      });
    });
  });
});
