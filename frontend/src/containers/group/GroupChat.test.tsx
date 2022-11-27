/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupChat from './GroupChat';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ group_id: '1234' }),
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
  render(
    <Provider store={store}>
      <GroupChat />
    </Provider>,
  );
  return store;
};

describe('[GroupChat Page]', () => {
  describe('useEffect', () => {
    test('init', () => {
      setup();
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({ payload: '1234', type: 'chat/getGroupMessageList' });
    });
  });

  test('sendMessage', () => {
    const store = setup();
    const mockSend = jest.fn();
    act(() => {
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    const input = screen.getByPlaceholderText('채팅을 입력하세요.');
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    expect(mockSend).toBeCalledTimes(1);

    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(screen.getByTestId('sendIcon'));
    expect(mockSend).toBeCalledTimes(2);
  });
});
