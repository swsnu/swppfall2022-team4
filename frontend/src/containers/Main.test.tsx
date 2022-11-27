/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import Main from './Main';

const posts = [
  {
    post_id: 1,
    title: 'First Post',
    author: { username: 'KJY', nickname: 'KimV', avatar: 'kimv.jpeg', level: 3, exp: 99 },
    content: 'Post Contents',
    created: '2022-05-22T00:00:00',
    updated: '2022-05-22T00:00:00',
    like_num: 1,
    dislike_num: 2,
    scrap_num: 3,
    comments_num: 1,
    prime_tag: { id: '1', name: 'interesting', color: '#101010' },
    has_image: false,
  },
];
const groups = [
  {
    id: 1,
    group_name: 'group_name',
    number: 10,
    start_date: '2019-01-01',
    end_date: '2019-01-01',
    free: true,
    member_number: 3,
    lat: null,
    lng: null,
    address: null,
  },
];
const fitElements = [
  {
    data: {
      id: 1,
      author: 1,
      type: 'log',
      workout_type: '실내 걷기',
      category: '유산소',
      period: null,
      weight: 234,
      rep: 22,
      set: 3,
      time: 3,
      date: '2022-11-27',
    },
  },
];

jest.mock('components/main/WorkoutChart', () => ({
  ...jest.requireActual('components/main/WorkoutChart'),
  WorkoutChart: () => () => <div />,
}));
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
      <Main />
    </Provider>,
  );
  return store;
};

describe('[Main Page]', () => {
  jest.spyOn(console, 'error').mockImplementation(msg => msg);

  test('init', () => {
    setup();
    expect(mockDispatch).toBeCalledTimes(5);
  });

  test('workoutlog', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'workoutlog/getFitElementsSuccess',
        payload: fitElements,
      });
    });
    expect(screen.getByText('실내 걷기')).toBeInTheDocument();
    fireEvent.click(screen.getByText('운동 기록 작성하러 가기'));
    expect(mockNavigate).toBeCalledTimes(1);

    act(() => {
      store.dispatch({
        type: 'group/getGroupsSuccess',
        payload: { groups: groups },
      });
    });

    expect(screen.getByText('group_name')).toBeInTheDocument();
  });

  test('post', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getPostsMainSuccess',
        payload: { posts: posts },
      });
    });
    expect(screen.getByText('First Post')).toBeInTheDocument();
    fireEvent.click(screen.getByText('게시글 더 보기'));
    expect(mockNavigate).toBeCalledTimes(1);
  });

  test('group', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/getGroupsSuccess',
        payload: { groups: groups },
      });
    });
    expect(screen.getByText('group_name')).toBeInTheDocument();
    fireEvent.click(screen.getByText('그룹 더 보기'));
    expect(mockNavigate).toBeCalledTimes(1);
  });
});
