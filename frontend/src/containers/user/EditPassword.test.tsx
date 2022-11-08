/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import EditPassword from './EditPassword';

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
});
