/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupList from './GroupList';
import * as groupApi from '../../store/apis/group';
import userEvent from '@testing-library/user-event';

const groupListResponse: groupApi.Group[] = [
  {
    id: 1,
    group_name: 'test',
    number: 5,
    member_number: 4,
    start_date: '2019-01-01',
    end_date: '2019-12-31',
    lat: null,
    lng: null,
    address: null,
    tags: [],
    prime_tag: undefined,
  },
  {
    id: 2,
    group_name: 'test2',
    number: 5,
    member_number: 4,
    start_date: '2019-01-01',
    end_date: '2019-12-31',
    lat: null,
    lng: null,
    address: null,
    tags: [],
    prime_tag: undefined,
  },
  {
    id: 3,
    group_name: 'test3',
    number: 5,
    member_number: 4,
    start_date: '2019-01-01',
    end_date: '2019-12-31',
    lat: 31,
    lng: 126,
    address: 'place',
    tags: [],
    prime_tag: undefined,
  },
];

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
      <GroupList />
    </Provider>,
  );
  return store;
};

describe('setup test', () => {
  it('create Btn', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupsSuccess',
        payload: {
          groups: groupListResponse,
        },
      });
    });

    const createGroupBtn = screen.getByText('Create Group');
    fireEvent.click(createGroupBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group/create');
  });
  it('detail Btn', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupsSuccess',
        payload: {
          groups: groupListResponse,
        },
      });
    });
    const detailBtn = screen.getByText('test');
    fireEvent.click(detailBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/');
  });
  it('sort Btn', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupsSuccess',
        payload: {
          groups: groupListResponse,
        },
      });
    });
    const recentBtn = screen.getByText('최신순');
    const oldBtn = screen.getByText('오래된순');
    const closeBtn = screen.getByText('가까운순');
    fireEvent.click(recentBtn);
    fireEvent.click(oldBtn);
    fireEvent.click(closeBtn);
  });
  it('search Input', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupsSuccess',
        payload: {
          groups: groupListResponse,
        },
      });
    });
    const searchInput = screen.getByPlaceholderText('그룹 검색...');
    userEvent.type(searchInput, '2');
  });
});
