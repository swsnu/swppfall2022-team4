/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import { KakaoLoginCallback } from './SocialLoginCallback';
import client from 'store/apis/client';

import { Store } from 'react-notifications-component';
import { notification } from 'utils/sendNotification';
import { AxiosError, AxiosResponse } from 'axios';
const addNotification = jest.fn();
beforeEach(() => {
  Store.addNotification = addNotification;
});
afterAll(() => jest.restoreAllMocks());

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    hash: '',
    key: 'default',
    pathname: '/oauth/kakao/',
    search: '?code=CODECODE',
    state: null,
  }),
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockClientGet = jest.fn();
const originalEnv = process.env;
beforeEach(() => {
  jest.clearAllMocks();
  process.env = {
    ...originalEnv,
    REACT_APP_KAKAO_KEY: 'Hi',
  };
});
afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  render(
    <Provider store={store}>
      <KakaoLoginCallback />
    </Provider>,
  );
  return store;
};

describe('[SocialLoginCallback Page]', () => {
  test('status 201', async () => {
    client.get = mockClientGet.mockImplementation(() =>
      Promise.resolve({ data: { access_token: 'kakao', username: 'un', nickname: 'nn', image: 'im' }, status: 201 }),
    );
    await act(() => {
      setup();
    });
    expect(mockClientGet).toBeCalledWith(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=Hi&redirect_uri=http://localhost:3000/oauth/kakao/&code=CODECODE`,
      { headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' } },
    );
    const signupBtn = screen.getByText('Sign up');
    fireEvent.click(signupBtn);
  });
  test('status 200', async () => {
    client.get = mockClientGet.mockImplementation(() =>
      Promise.resolve({ data: { access_token: 'kakao' }, status: 200 }),
    );
    await act(() => {
      setup();
    });
    expect(mockClientGet).toBeCalledWith(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=Hi&redirect_uri=http://localhost:3000/oauth/kakao/&code=CODECODE`,
      { headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' } },
    );
  });
  test('status 400', async () => {
    client.get = mockClientGet.mockImplementation(() =>
      Promise.reject({
        config: {},
        request: {},
        response: { data: 'str', status: 400 } as AxiosResponse,
      } as AxiosError),
    );
    await act(() => {
      setup();
    });
    expect(addNotification).toBeCalledWith({
      ...notification,
      title: 'User',
      message: '오류가 발생했습니다. 다시 시도해주세요.',
      type: 'danger',
    });
  });
  test('status 401', async () => {
    client.get = mockClientGet.mockImplementation(() =>
      Promise.reject({
        config: {},
        request: {},
        response: { data: { error: 'Hello' }, status: 401 } as AxiosResponse,
      } as AxiosError),
    );
    await act(() => {
      setup();
    });
    expect(addNotification).toBeCalledWith({
      ...notification,
      title: 'User',
      message: 'Hello',
      type: 'danger',
    });
  });
  test('status unknown', async () => {
    client.get = mockClientGet.mockImplementation(() => Promise.reject({}));
    await act(() => {
      setup();
    });
    expect(addNotification).toBeCalledWith({
      ...notification,
      title: 'User',
      message: '오류가 발생했습니다. 다시 시도해주세요.',
      type: 'danger',
    });
  });
  describe('basics', () => {
    test('signup success', () => {
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
  test('back to login', async () => {
    client.get = mockClientGet.mockImplementation(() =>
      Promise.resolve({ data: { access_token: 'kakao', username: 'un', nickname: 'nn', image: 'im' }, status: 201 }),
    );
    await act(() => {
      setup();
    });
    fireEvent.click(screen.getByText('Back to Login'));
    expect(mockNavigate).toBeCalledTimes(1);
  });
});
