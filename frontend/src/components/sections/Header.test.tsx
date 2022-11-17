/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { rootReducer } from 'store';
import Header from './Header';

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
  window.scrollTo = jest.fn().mockImplementation(() => null);
  window.confirm = jest.fn().mockImplementation(() => true);

  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>,
  );
  return store;
};

describe('Header', () => {
  test('button', () => {
    const store = setup();

    fireEvent.click(screen.getByTestId('notificationIcon'));
    expect(screen.getByTestId('notificationIcon')).toBeInTheDocument();
    act(() => {
      store.dispatch({
        type: 'notification/getNotificationListSuccess',
        payload: [
          {
            id: 1234,
            category: 'comment',
            content: 'content',
            image: 'image',
            link: '/link',
            created: '2022-11-11',
          },
        ],
      });
    });
    fireEvent.click(screen.getByTestId('notificationIcon'));
    expect(screen.getByTestId('notificationIcon')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('notificationIcon'));

    fireEvent.click(screen.getByText('더 보기'));
    expect(mockNavigate).toBeCalledTimes(1);
    fireEvent.click(screen.getByText('content'));
    expect(mockNavigate).toBeCalledTimes(2);

    const button = screen.getByTestId('infoIcon');
    fireEvent.click(button);

    const logoutButton = screen.getByTestId('logoutButton');
    fireEvent.click(logoutButton);
    expect(mockDispatch).toBeCalledTimes(3);

    const mypageButton = screen.getByTestId('mypageButton');
    fireEvent.click(mypageButton);
    expect(mockNavigate).toBeCalledTimes(3);

    const chatButton = screen.getByTestId('chatButton');
    fireEvent.click(chatButton);
    expect(mockNavigate).toBeCalledTimes(4);
  });
});
