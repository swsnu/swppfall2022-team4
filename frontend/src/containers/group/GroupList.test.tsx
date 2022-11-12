/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupList from './GroupList';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

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
    setup();
    // expect(mockDispatch).toBeCalledTimes(2);
  });
  it('button', () => {
    const store = setup();

    act(() => {
      store.dispatch({
        type: 'group/getGroupsSuccess',
        payload: {
          groups: [{ id: 1, group_name: 'temp', number: 1, start_date: 'sd', end_date: 'ed', member_number: 1 }],
        },
      });
    });

    // screen.debug();

    const createGroupBtn = screen.getByText('Create Group');
    fireEvent.click(createGroupBtn);
    expect(mockNavigate).toBeCalledTimes(0);
    expect(mockNavigate).toBeCalledWith('/group/create');
  });
});
