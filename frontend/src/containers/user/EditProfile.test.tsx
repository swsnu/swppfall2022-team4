/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import EditProfile from './EditProfile';
import { Store } from 'react-notifications-component';

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
  login_method: 'email',
};

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

beforeEach(() => {
  jest.clearAllMocks();
  Store.addNotification = jest.fn();
});
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

    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: { ...simpleProfile, gender: '' },
      });
    });
    fireEvent.click(button);
    expect(mockAlert).toBeCalledTimes(2);

    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: { ...simpleProfile, height: '' },
      });
    });
    fireEvent.click(button);
    expect(mockAlert).toBeCalledTimes(3);

    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
    });
    fireEvent.click(button);
    expect(mockDispatch).toBeCalledTimes(2);

    const nicknameInput = screen.getByPlaceholderText('Nickname');
    fireEvent.change(nicknameInput, { target: { value: '' } });
    fireEvent.click(button);
    expect(mockAlert).toBeCalledTimes(4);
  });

  test('signout', () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
    });

    const button = screen.getByText('회원 탈퇴');
    fireEvent.click(button);
    expect(mockConfirm).toBeCalledTimes(1);
  });

  test('buttons', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
    });

    fireEvent.click(screen.getByText('Back'));
    expect(mockNavigate).toBeCalledTimes(1);

    fireEvent.click(screen.getByText('비밀번호 변경'));
    expect(mockNavigate).toBeCalledTimes(2);
  });
});
