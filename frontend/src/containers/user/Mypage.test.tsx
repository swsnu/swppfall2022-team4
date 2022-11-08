/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import Mypage from './Mypage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockNavigate,
  useParams: () => ({ username: 'username' }),
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
  });
});
