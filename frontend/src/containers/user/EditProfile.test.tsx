/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import EditProfile from './EditProfile';

const simpleProfile = {
  username: 'username',
  nickname: 'nickname',
  image: 'image',
  gender: 'male',
  height: 180,
  weight: 75,
  age: 23,
  exp: 0,
  level: 1,
  created: '2011-12-11',
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as any),
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
      <EditProfile />
    </Provider>,
  );
  return store;
};

describe('[EditProfile Page]', () => {
  describe('useEffect', () => {
    test('init', () => {
      setup();
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith({ payload: 'username', type: 'user/getProfile' });
    });

    test('getProfileSuccess', () => {
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'user/getProfileSuccess',
          payload: simpleProfile,
        });
      });
      expect(screen.getByDisplayValue('nickname')).toBeInTheDocument();
    });

    test('editProfileSuccess', () => {
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'user/editProfileSuccess',
          payload: true,
        });
      });
      expect(mockNavigate).toBeCalledTimes(1);
    });

    test('signoutSuccess', () => {
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'user/signoutSuccess',
          payload: true,
        });
      });
      expect(mockNavigate).toBeCalledTimes(1);
    });
  });

  test('confirm', () => {
    const mockAlert = jest.spyOn(global, 'alert').mockImplementation(msg => msg);
    const store = setup();

    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: { ...simpleProfile, nickname: '' },
      });
    });
    const button = screen.getByText('Update');
    fireEvent.click(button);
    expect(mockAlert).toBeCalledTimes(1);
  });
});
