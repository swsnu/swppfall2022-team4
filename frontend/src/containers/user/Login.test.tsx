/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import Login from './Login';

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
  render(
    <Provider store={store}>
      <Login />
    </Provider>,
  );
  return store;
};

describe('[Login Page]', () => {
  describe('useEffect', () => {
    test('login success', () => {
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'user/setUser',
          payload: { username: 'username', nickname: 'nickname', image: 'image' },
        });
      });
      expect(mockNavigate).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledWith('/');
    });
  });

  test('login', () => {
    setup();
    const usernameInput = screen.getByPlaceholderText('ID');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');
    fireEvent.change(usernameInput, { target: { value: 'a' } });
    fireEvent.change(passwordInput, { target: { value: 'b' } });
    fireEvent.click(loginButton);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({ type: 'user/login', payload: { username: 'a', password: 'b' } });
  });
});
