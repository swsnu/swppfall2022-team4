/* eslint-disable @typescript-eslint/no-explicit-any */
import { JoinReqElement } from './JoinReqElement';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from 'store';
import Router from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: () => jest.fn(),
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  return store;
};

describe('<JoinReqElement/>', () => {
  it('not full', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    render(
      <Provider store={store}>
        <JoinReqElement id={1} image={'image'} username={'username'} level={1} is_full={false} />
      </Provider>,
    );
    screen.getByText('username');
    screen.getByText('Level: 1');

    const profile = screen.getByAltText('profile');
    fireEvent.click(profile);
    expect(mockNavigate).toBeCalledWith('/profile/username');

    const approveBtn = screen.getByText('승인');
    fireEvent.click(approveBtn);
    expect(mockDispatch).toBeCalledTimes(1);

    const discardBtn = screen.getByText('삭제');
    fireEvent.click(discardBtn);
    expect(mockDispatch).toBeCalledTimes(2);
  });
  it('wrong group id', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: undefined });
    const store = setup();
    render(
      <Provider store={store}>
        <JoinReqElement id={1} image={'image'} username={'username'} level={1} is_full={false} />
      </Provider>,
    );
    const approveBtn = screen.getByText('승인');
    fireEvent.click(approveBtn);
    const discardBtn = screen.getByText('삭제');
    fireEvent.click(discardBtn);
  });
  it('is full', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    render(
      <Provider store={store}>
        <JoinReqElement id={1} image={'image'} username={'username'} level={1} is_full={true} />
      </Provider>,
    );

    const approveBtn = screen.getByText('승인');
    fireEvent.click(approveBtn);
    expect(mockDispatch).toBeCalledTimes(0);

    const discardBtn = screen.getByText('삭제');
    fireEvent.click(discardBtn);
    expect(mockDispatch).toBeCalledTimes(1);
  });
});
