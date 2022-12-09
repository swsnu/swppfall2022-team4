/* eslint-disable @typescript-eslint/no-explicit-any */
import { MemberElement } from './MemberElement';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from 'store';
import Router from 'react-router-dom';
import { act } from 'react-dom/test-utils';

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
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  return store;
};

describe('<MemberElement/>', () => {
  it('not leader & myself', () => {
    const store = setup();
    render(
      <Provider store={store}>
        <MemberElement
          id={1}
          image={'image'}
          username={'username'}
          cert_days={7}
          level={1}
          is_leader={false}
          leader={false}
          myself={true}
        />
      </Provider>,
    );

    const mockSend = jest.fn();
    act(() => {
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    screen.getByText('username');
    screen.getByText('7 일째 인증 중!');
    screen.getByText('Level: 1');

    const profile = screen.getByAltText('profile');
    fireEvent.click(profile);
    expect(mockNavigate).toBeCalledWith('/profile/username');
  });
  it('leader & not myself', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    render(
      <Provider store={store}>
        <MemberElement
          id={1}
          image={'image'}
          username={'username'}
          cert_days={7}
          level={1}
          is_leader={false}
          leader={true}
          myself={false}
        />
      </Provider>,
    );

    const mockSend = jest.fn();
    act(() => {
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    const leaderChangeBtn = screen.getByText('그룹장 위임');
    fireEvent.click(leaderChangeBtn);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledTimes(2);
    expect(mockNavigate).toBeCalledWith('/group/detail/1');
  });
  it('group id failure', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: undefined });
    const store = setup();
    render(
      <Provider store={store}>
        <MemberElement
          id={1}
          image={'image'}
          username={'username'}
          cert_days={7}
          level={1}
          is_leader={false}
          leader={true}
          myself={false}
        />
      </Provider>,
    );

    const mockSend = jest.fn();
    act(() => {
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    const leaderChangeBtn = screen.getByText('그룹장 위임');
    fireEvent.click(leaderChangeBtn);
  });
});
