/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import Chat from './Chat';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1234' }),
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
      <Chat />
    </Provider>,
  );
  return store;
};

describe('[Chat Page]', () => {
  describe('useEffect', () => {
    test('init', () => {
      setup();
      expect(mockDispatch).toBeCalledTimes(4);
      expect(mockDispatch).toHaveBeenCalledWith({ payload: '1234', type: 'chat/setWhere' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'chat/getChatroomList' });
      expect(mockDispatch).toHaveBeenCalledWith({ payload: '1234', type: 'chat/getMessageList' });
    });
  });

  test('Chatroom', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'chat/getChatroomListSuccess',
        payload: [
          {
            id: 1234,
            user: {
              username: 'username',
              nickname: 'nickname',
              image: 'image',
            },
          },
        ],
      });
    });

    const chatroomButton = screen.getByText('nickname');
    fireEvent.click(chatroomButton);
    expect(mockNavigate).toBeCalledTimes(1);
  });
});
