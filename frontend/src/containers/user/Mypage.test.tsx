/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import Mypage from './Mypage';

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
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ username: 'username' }),
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
      <Mypage />
    </Provider>,
  );
  return store;
};

describe('[Mypage Page]', () => {
  describe('useEffect', () => {
    test('init', () => {
      setup();
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toBeCalledWith({ payload: 'username', type: 'user/getProfile' });
      expect(mockDispatch).toBeCalledWith({ payload: 'username', type: 'user/getProfileContent' });
    });

    test('error', () => {
      const mockAlert = jest.spyOn(global, 'alert').mockImplementation(msg => msg);
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'user/getProfileFailure',
          payload: { response: { status: 404, data: { message: 'error' } } },
        });
      });
      expect(mockAlert).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledTimes(1);
    });
  });

  test('get', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
    });

    expect(screen.getByText('nickname')).toBeInTheDocument();
    expect(screen.getByText('username')).toBeInTheDocument();
    expect(screen.getByText('남성')).toBeInTheDocument();
    expect(screen.getByText('180cm')).toBeInTheDocument();
    expect(screen.getByText('75kg')).toBeInTheDocument();
  });

  test('button', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
    });

    const editButton = screen.getByText('프로필 수정');
    fireEvent.click(editButton);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/edit_profile');

    const editIcon = screen.getByTestId('editProfileIcon');
    fireEvent.click(editIcon);
    expect(mockNavigate).toBeCalledTimes(2);
    expect(mockNavigate).toBeCalledWith('/edit_profile');
  });
});
