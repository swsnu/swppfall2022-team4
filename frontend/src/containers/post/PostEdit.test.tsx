/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Router from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import PostEdit from './PostEdit';
import * as tagAPI from '../../store/apis/tag';
import userEvent from '@testing-library/user-event';
import { simplePosts, simpleTagVisuals, simpleUserInfo } from 'store/slices/post.test';
import { Post } from 'store/apis/post';

const getTagsResponse: tagAPI.getTagListResponseType = {
  tags: [
    {
      id: 1,
      class_name: 'workout',
      class_type: 'workout',
      color: '#101010',
      tags: simpleTagVisuals,
    },
  ],
  popularTags: [
    {
      id: '1',
      name: '1',
      color: '#111111',
    },
  ],
};

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
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'KJY', nickname: 'nickname', image: 'image' }, // KJY is the author of the simplePosts[0]
  });
  render(
    <Provider store={store}>
      <PostEdit />
    </Provider>,
  );
  return store;
};

const setupOthers = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'Not KJY', nickname: 'nickname', image: 'image' }, // KJY is the author of the simplePosts[0]
  });
  render(
    <Provider store={store}>
      <PostEdit />
    </Provider>,
  );
  return store;
};

const ContentsPost: Post = {
  post_id: '1',
  title: 'Compicated Post',
  author: simpleUserInfo[1],
  content: 'Post Contents1',
  created: '2022-12-11',
  updated: '2022-12-11',
  like_num: 11,
  dislike_num: 21,
  scrap_num: 31,
  comments_num: 11,
  tags: [],
  prime_tag: undefined,
  has_image: false,
  liked: false,
  disliked: false,
  scraped: false,
  routine: {
    id: 3,
    name: 'routine',
    fitelements: [],
  },
  group: {
    id: 1,
    group_name: 'group',
    number: null,
    start_date: null,
    end_date: null,
    member_number: 3,
    lat: null,
    lng: null,
    address: null,
    free: false,
    my_group: 'not mine',
    tags: [],
    prime_tag: undefined,
  },
};
describe('[PostEdit Page]', () => {
  test('basic rendering', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
    });
    expect(mockDispatch).toBeCalledTimes(4); // getTags, updatePostDetail, getRoutine, getGroups
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
    expect(mockNavigate).toBeCalledTimes(0);

    screen.getByDisplayValue('First Post');
  });
  test('basic rendering with complex contensts', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: ContentsPost,
      });
    });
  });
  test('basic rendering for invalid author', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = setupOthers();
    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
    });
    expect(mockNavigate).toBeCalledTimes(1);
  });
  test('basic rendering(backend error)', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailFailure',
        payload: 'ERROR',
      });
    });
    expect(mockNavigate).toBeCalledTimes(1);
  });
  test('basic rendering with images', () => {
    // Second post for has image
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '2' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[1],
      });
    });

    screen.getByDisplayValue('Second Post');
  });
  test('basic rendering with invalid id', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: undefined });
    setup();

    expect(mockDispatch).toBeCalledTimes(3); // updatePostDetail, getRoutine, getGroups
    expect(mockDispatch).not.toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
  });
  test('edit cancle button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    global.confirm = () => true;
    setup();
    const cancelBtn = screen.getByText('취소');
    fireEvent.click(cancelBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/post/1');
  });
  test('edit confirm button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    setup();
    const confirmBtn = screen.getByText('완료');
    fireEvent.click(confirmBtn); // cannot click.
    expect(mockDispatch).toBeCalledTimes(4); // getTags, updatePostDetail, getRoutine, getGroups
  });
  test('edit confirm button after typing', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    setup();
    const confirmBtn = screen.getByText('완료');
    const titleInput = screen.getByPlaceholderText('제목');
    const contentInput = screen.getByPlaceholderText('내용');
    userEvent.type(titleInput, 'RulluRulluRulluRulluRulluRulluRulluRulluRulluRulluRulluRulluRulluRullu');
    userEvent.clear(titleInput);
    userEvent.type(titleInput, 'Rullu');
    userEvent.type(contentInput, 'Ralla'.repeat(200));
    userEvent.clear(contentInput);
    userEvent.type(contentInput, 'Ralla');
    fireEvent.click(confirmBtn);
    expect(mockDispatch).toBeCalledTimes(5); // getTags, getRoutine, getGroups, editPost, updatePostDetail
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        post_id: '1',
        title: 'Rullu',
        content: 'Ralla',
        tags: [],
        images: [],
        prime_tag: undefined,
        routine: '',
        group: '',
      },
      type: 'post/editPost',
    });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
  });
  test('edit confirm button after typing with invalid id', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: undefined });
    setup();
    const confirmBtn = screen.getByText('완료');
    const titleInput = screen.getByPlaceholderText('제목');
    const contentInput = screen.getByPlaceholderText('내용');
    userEvent.type(titleInput, 'Rullu');
    userEvent.type(contentInput, 'Ralla');
    fireEvent.click(confirmBtn);
    expect(mockDispatch).toBeCalledTimes(3); // getTags, getRoutine, getGroups
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).not.toBeCalledWith({
      payload: {
        post_id: '1',
        title: 'Rullu',
        content: 'Ralla',
        tags: [],
        prime_tag: undefined,
        routine: '',
        group: '',
      },
      type: 'post/editPost',
    });
    expect(mockDispatch).not.toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
  });
  test('post edit success', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/editPostSuccess',
        payload: undefined,
      });
    });
    expect(mockDispatch).toBeCalledTimes(6); // getTags, updatePostDetail, stateRefresh, clearTagState, getRoutine, getGroups
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'post/stateRefresh' });
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/clearTagState' });

    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(`/post/1`);
  });
});

describe('[Group - PostEdit Page]', () => {
  test('basic rendering', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1', group_id: '1' });
    setup();
  });
});
