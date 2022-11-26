/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from 'store';
import Notification from './Notification';

const simpleNotificationList = [
  {
    id: 1,
    content: 'content1',
    image: 'image1',
    link: 'link1',
    created: 'created1',
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
  store.dispatch({
    type: 'notification/getNotificationListSuccess',
    payload: simpleNotificationList,
  });
  render(
    <Provider store={store}>
      <Notification />
    </Provider>,
  );
  return store;
};

describe('[Notification Page]', () => {
  describe('useEffect', () => {
    test('init', () => {
      setup();
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith({ type: 'notification/getNotificationList' });
    });
  });

  test('home', () => {
    setup();
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toBeCalledTimes(1);
  });

  test('deleteAll', () => {
    global.confirm = jest.fn().mockImplementation(() => true);
    setup();
    fireEvent.click(screen.getByText('모두 삭제'));
    expect(mockDispatch).toBeCalledTimes(2);
  });

  test('clickLink', () => {
    setup();
    fireEvent.click(screen.getByText('content1'));
    expect(mockNavigate).toBeCalledTimes(1);
  });
});
