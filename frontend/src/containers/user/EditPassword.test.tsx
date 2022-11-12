/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import EditPassword from './EditPassword';

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
      <EditPassword />
    </Provider>,
  );
  return store;
};

describe('[EditPassword Page]', () => {
  describe('useEffect', () => {
    test('editProfileSuccess', () => {
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'user/editProfileSuccess',
          payload: 'data',
        });
      });
      expect(mockNavigate).toBeCalledTimes(1);
    });
  });

  test('confirm', () => {
    const mockAlert = jest.spyOn(global, 'alert').mockImplementation(msg => msg);
    setup();

    const button = screen.getByText('Update');
    fireEvent.click(button);
    expect(mockAlert).toBeCalledTimes(1);

    fireEvent.change(screen.getByPlaceholderText(''), { target: { value: 'password' } });
    fireEvent.click(button);
    expect(mockAlert).toBeCalledTimes(2);

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Password Confirm'), { target: { value: 'password' } });
    fireEvent.click(button);
    expect(mockDispatch).toBeCalledTimes(1);
  });

  test('button', () => {
    setup();
    fireEvent.click(screen.getByText('Back'));
    expect(mockNavigate).toBeCalledTimes(1);
  });
});
