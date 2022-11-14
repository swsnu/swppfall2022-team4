/* eslint-disable @typescript-eslint/no-explicit-any */
import { MemberElement } from './MemberElement';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import * as groupApi from '../../store/apis/group';

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
      <MemberElement id={1} image={'image'} username={'test'} cert_days={7} level={1} leader={true} myself={true}/>
    </Provider>,
  );
  return store;
};

describe('<MemberElement/>', () => {
  it('should render without errors', () => {
    setup();
    screen.getByText('test');
    screen.getByText('Level: 1');
  });
});
