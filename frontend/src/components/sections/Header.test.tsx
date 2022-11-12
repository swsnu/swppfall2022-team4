/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
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
  describe('button', () => {
    test('info', () => {
      setup();
      const button = screen.getByTestId('infoIcon');
      fireEvent.click(button);

      const logoutButton = screen.getByTestId('logoutButton');
      fireEvent.click(logoutButton);
      expect(mockDispatch).toBeCalledTimes(1);

      const mypageButton = screen.getByTestId('mypageButton');
      fireEvent.click(mypageButton);
      expect(mockNavigate).toBeCalledTimes(1);

      const chatButton = screen.getByTestId('chatButton');
      fireEvent.click(chatButton);
      expect(mockNavigate).toBeCalledTimes(2);
    });
  });
});