/* eslint-disable @typescript-eslint/no-explicit-any */
import { JoinReqElement } from './JoinReqElement';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from 'store';
import Router from 'react-router-dom';
import { act } from 'react-dom/test-utils';

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
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  return store;
};

describe('<JoinReqElement/>', () => {
  test('not full', () => {
    const store = setup();
    const mockSend = jest.fn();
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    render(
      <Provider store={store}>
        <JoinReqElement id={1} image={'image'} username={'username'} level={1} is_full={false} />
      </Provider>,
    );

    act(() => {
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    screen.getByText('username');
    screen.getByText('Level: 1');

    const profile = screen.getByAltText('profile');
    fireEvent.click(profile);
    expect(mockNavigate).toBeCalledWith('/profile/username');

    const approveBtn = screen.getByText('승인');
    fireEvent.click(approveBtn);
    expect(mockDispatch).toBeCalledTimes(1);

    const discardBtn = screen.getByText('삭제');
    fireEvent.click(discardBtn);
    expect(mockDispatch).toBeCalledTimes(2);
  });

  test('wrong group id', () => {
    const store = setup();
    const mockSend = jest.fn();
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: undefined });
    render(
      <Provider store={store}>
        <JoinReqElement id={1} image={'image'} username={'username'} level={1} is_full={false} />
      </Provider>,
    );

    act(() => {
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    const approveBtn = screen.getByText('승인');
    fireEvent.click(approveBtn);
    const discardBtn = screen.getByText('삭제');
    fireEvent.click(discardBtn);
  });

  test('is full', () => {
    const store = setup();
    const mockSend = jest.fn();
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    render(
      <Provider store={store}>
        <JoinReqElement id={1} image={'image'} username={'username'} level={1} is_full={true} />
      </Provider>,
    );

    act(() => {
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    const approveBtn = screen.getByText('승인');
    fireEvent.click(approveBtn);
    expect(mockDispatch).toBeCalledTimes(0);

    const discardBtn = screen.getByText('삭제');
    fireEvent.click(discardBtn);
    expect(mockDispatch).toBeCalledTimes(1);
  });
});
