/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import PostCreate from './PostCreate';

import * as postAPI from '../../store/apis/post';
import * as commentAPI from '../../store/apis/comment';
import * as tagAPI from '../../store/apis/tag';
import userEvent from '@testing-library/user-event';

const simpleTagVisuals: tagAPI.TagVisual[] = [{ id: '1', name: 'interesting', color: '#101010' }];
const simplePosts: postAPI.Post[] = [
  {
    id: '1',
    title: 'First Post',
    author_name: 'KJY',
    content: 'Post Contents',
    created: '2022-11-11',
    updated: '2022-11-12',
    like_num: 1,
    dislike_num: 2,
    scrap_num: 3,
    comments_num: 1,
    tags: simpleTagVisuals,
    prime_tag: simpleTagVisuals[0],
    liked: false,
    disliked: true,
    scraped: false,
  },
  {
    id: '2',
    title: 'Second Post',
    author_name: 'KJY2',
    content: 'Post Contents2',
    created: '2022-11-11',
    updated: '2022-11-11',
    like_num: 11,
    dislike_num: 21,
    scrap_num: 31,
    comments_num: 11,
    tags: [],
    prime_tag: undefined,
    liked: false,
    disliked: true,
    scraped: false,
  },
];
const simpleComments: commentAPI.Comment[] = [
  {
    id: '1',
    author_name: 'KJY',
    content: 'Comment Content longlong longlong',
    created: '2022-11-11',
    updated: '2022-11-12',
    like_num: 1,
    dislike_num: 2,
    parent_comment: null,
    replyActive: false,
    editActive: false,
    liked: false,
    disliked: false,
    post_id: '1',
  },
  {
    id: '2',
    author_name: 'KJY2',
    content: 'GETBYCOM',
    created: '2022-11-12',
    updated: '2022-11-12',
    like_num: 12,
    dislike_num: 1,
    parent_comment: null,
    replyActive: false,
    editActive: false,
    liked: false,
    disliked: false,
    post_id: '1',
  },
];
const simplePostID: postAPI.postIdentifyingType = {
  post_id: '59',
};
const simpleSearch = {
  search_keyword: 'searchKeyword',
};

const getPostsResponse: postAPI.getPostsResponseType = {
  posts: simplePosts,
  page: 2,
  page_size: 15,
  page_total: 7,
};
const getRecentCommentsResponse = {
  comments: simpleComments,
};
const getTagsResponse: tagAPI.getTagListResponseType = {
  tags: [
    {
      id: 1,
      class_name: 'workout',
      color: '#101010',
      tags: simpleTagVisuals,
    },
  ],
};
const createPostResponse: postAPI.postIdentifyingType = simplePostID;

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
      <PostCreate />
    </Provider>,
  );
  return store;
};
const setupWithoutUser = () => {
  const store = configureStore({ reducer: rootReducer });
  render(
    <Provider store={store}>
      <PostCreate />
    </Provider>,
  );
  return store;
};

const defaultPageConfig: postAPI.getPostsRequestType = {
  pageNum: 1,
  pageSize: 15,
  searchKeyword: undefined,
};

describe('[PostCreate Page]', () => {
  test('basic rendering', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });
    expect(mockDispatch).toBeCalledTimes(1); // getTags
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockNavigate).toBeCalledTimes(0);
  });
  test('write cancle button', () => {
    setup();
    const cancelBtn = screen.getByText('취소');
    fireEvent.click(cancelBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/post');
  });
  test('write confirm button', () => {
    setup();
    const confirmBtn = screen.getByText('완료');
    fireEvent.click(confirmBtn); // cannot click.
    expect(mockDispatch).toBeCalledTimes(1); // getTags
  });
  test('write confirm button after typing', () => {
    setup();
    const confirmBtn = screen.getByText('완료');
    const titleInput = screen.getByPlaceholderText('제목');
    const contentInput = screen.getByPlaceholderText('내용');
    userEvent.type(titleInput, 'Rullu');
    userEvent.type(contentInput, 'Ralla');
    fireEvent.click(confirmBtn);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: { title: 'Rullu', content: 'Ralla', author_name: 'username', tags: [], prime_tag: undefined },
      type: 'post/createPost',
    });
  });
  test('write confirm button after typing (undefined user)', () => {
    setupWithoutUser();
    const confirmBtn = screen.getByText('완료');
    const titleInput = screen.getByPlaceholderText('제목');
    const contentInput = screen.getByPlaceholderText('내용');
    userEvent.type(titleInput, 'Rullu');
    userEvent.type(contentInput, 'Ralla');
    fireEvent.click(confirmBtn);
    expect(mockDispatch).toBeCalledTimes(1);
  });
  test('post creation success', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/createPostSuccess',
        payload: createPostResponse,
      });
    });
    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'post/stateRefresh' });
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/clearTagState' });

    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(`/post/${createPostResponse.post_id}`);
  });
});
