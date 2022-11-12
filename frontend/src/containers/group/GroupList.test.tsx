/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupList from './GroupList';
import * as groupApi from '../../store/apis/group';

const groupListResponse: groupApi.Group[] = [
    {
      id: 1,
      group_name: 'test',
      number: 5,
      member_number: 4,
      start_date: '2019-01-01',
      end_date: '2019-12-31',
    },
    {
      id: 2,
      group_name: 'test2',
      number: 5,
      member_number: 4,
      start_date: '2019-01-01',
      end_date: '2019-12-31',
    }
]

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
  it('test', () => {
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
});
