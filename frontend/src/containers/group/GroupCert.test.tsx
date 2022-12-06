/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupCert from './GroupCert';
import * as groupApi from '../../store/apis/group';
import { userType } from '../../store/apis/user';
import Router from 'react-router-dom';
import { TagVisual } from 'store/apis/tag';

const user1: userType = {
  username: 'username',
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
  end_date: '2023-01-01',
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

const mem: groupApi.MemberCert = {
  member: {
    username: 'username',
    nickname: 'test',
    image: 'image'
  },
  certs: [fitelement1],
  did: true,
}

const getCertsResponse: groupApi.getCertsResponseType = {
  all_certs: [mem]
}

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
        <GroupCert />
      </Provider>,
    );
    return store;
};

describe('group cert', () => {
  it('render with no errors', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
  });
  it('click date', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
    const future = screen.getByText(17);
    const past = screen.getByText(4);
    fireEvent.click(future);
    fireEvent.click(past);
    expect(mockDispatch).toBeCalledTimes(4);
  });
  it('set & submit goal', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
    });
    const option = screen.getByText('종류 : 벤치프레스 강도 : 10 반복 : 10 시간 : 10')
    const selectGoal = screen.getByTestId('selectGoal');
    const confirm = screen.getByText('완료');
    fireEvent.click(option)
    fireEvent.change(selectGoal, { target: { value: 0 } });
    fireEvent.click(confirm)
    expect(mockDispatch).toBeCalledTimes(3);
  });
  it('get & remove cert', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupDetailSuccess',
        payload: groupDetailResponse,
      });
      store.dispatch({
        type: 'group/getCertsSuccess',
        payload: getCertsResponse,
      });
    });
    const remove = screen.getByText('X');
    fireEvent.click(remove);
    expect(mockDispatch).toBeCalledTimes(3);
  });
})