/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Router from 'react-router-dom';
import { rootReducer } from 'store';
import InformationDetail from './InformationDetail';
import { simplePosts } from 'store/slices/post.test';
import { Youtube } from 'store/apis/information';
import { act } from 'react-dom/test-utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

// window.location.href mock
global.window = Object.create(window);
const url = 'http://dummy.com';
Object.defineProperty(window, 'location', {
  value: {
    href: url,
  },
  writable: true,
});

beforeEach(() => {
  jest.clearAllMocks();
});
afterAll(() => jest.restoreAllMocks());

const simpleYoutubes: Youtube[] = [
  {
    video_id: '1',
    title: 'title1',
    thumbnail: 'thumb1',
    channel: 'wha!',
    published: 'yesterday',
  },
];

const getInfoSuccessResponse = {
  basic: {
    name: 'Deadlift',
  },
  posts: simplePosts,
  youtubes: simpleYoutubes,
  articles: 'any',
};

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <InformationDetail />
    </Provider>,
  );
  return store;
};

describe('[InformationDetail Page]', () => {
  test('basic rendering', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ name: 'Deadlift' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'info/getInformationSuccess',
        payload: getInfoSuccessResponse,
      });
    });

    const youtubeItem = screen.getByText('wha!');
    fireEvent.click(youtubeItem);

    const postItem = screen.getByText('First Post');
    fireEvent.click(postItem);
  });
  test('basic rendering when params undefined & Info error', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ name: undefined });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'info/getInformationFailure',
        payload: { ...new Error('hi'), response: { status: 404 } } as Error,
      });
    });
    act(() => {
      store.dispatch({
        type: 'info/getInformationFailure',
        payload: { ...new Error('hi'), response: { status: 403 } } as Error, //ETC
      });
    });
  });
});
