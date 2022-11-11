/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import PostMain from './PostMain';

import * as postAPI from '../../store/apis/post';
import * as commentAPI from '../../store/apis/comment';
import * as tagAPI from '../../store/apis/tag';

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  //   useParams: () => ({ username: 'username' }),
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
      <PostMain />
    </Provider>,
  );
  return store;
};

const defaultPageConfig: postAPI.getPostsRequestType = {
  pageNum: 1,
  pageSize: 15,
  searchKeyword: undefined,
};

describe('[PostMain Page]', () => {
  test('basic rendering', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getPostsSuccess',
        payload: getPostsResponse,
      });
      store.dispatch({
        type: 'post/getRecentCommentsSuccess',
        payload: getRecentCommentsResponse,
      });
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });
    expect(mockDispatch).toBeCalledTimes(3); // getTags, getPosts, getRecentComments, getPostsSuccess
    expect(mockDispatch).toBeCalledWith({ payload: defaultPageConfig, type: 'post/getPosts' });
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'post/getRecentComments' });
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockNavigate).toBeCalledTimes(0);
  });
  test('write post button', () => {
    setup();
    const createPostBtn = screen.getByText('글 쓰기');
    fireEvent.click(createPostBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/post/create');
  });
  test('article item click', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getPostsSuccess',
        payload: getPostsResponse,
      });
    });
    const articleItem = screen.getAllByTestId('ArticleItem');
    expect(articleItem).toHaveLength(2);
    fireEvent.click(articleItem[0]);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(`/post/${getPostsResponse.posts[0].id}`);
  });
  test('search', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getPostsSuccess',
        payload: getPostsResponse,
      });
      store.dispatch({
        type: 'post/getRecentCommentsSuccess',
        payload: getRecentCommentsResponse,
      });
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
      store.dispatch({
        type: 'post/postSearch',
        payload: simpleSearch,
      });
    });
    expect(mockNavigate).toBeCalledTimes(0);
  });
  test('sidebar recent comment button', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getRecentCommentsSuccess',
        payload: getRecentCommentsResponse,
      });
    });
    const sidebarComment = screen.getByText('GETBYCOM');
    fireEvent.click(sidebarComment);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(`/post/${simpleComments[1].post_id}`);
  });
  // test('error', () => {
  //   const mockAlert = jest.spyOn(global, 'alert').mockImplementation(msg => msg);
  //   const store = setup();
  //   act(() => {
  //     store.dispatch({
  //       type: 'user/getProfileFailure',
  //       payload: { response: { status: 404, data: { message: 'error' } } },
  //     });
  //   });
  //   expect(mockAlert).toBeCalledTimes(1);
  //   expect(mockNavigate).toBeCalledTimes(1);
  // });
});

//   test('get', () => {
//     const store = setup();
//     act(() => {
//       store.dispatch({
//         type: 'user/getProfileSuccess',
//         payload: simpleProfile,
//       });
//     });

//     expect(screen.getByText('nickname')).toBeInTheDocument();
//     expect(screen.getByText('username')).toBeInTheDocument();
//     expect(screen.getByText('남성')).toBeInTheDocument();
//     expect(screen.getByText('180cm')).toBeInTheDocument();
//     expect(screen.getByText('75kg')).toBeInTheDocument();
//   });

//   test('button', () => {
//     const store = setup();
//     act(() => {
//       store.dispatch({
//         type: 'user/getProfileSuccess',
//         payload: simpleProfile,
//       });
//     });

//     const editButton = screen.getByText('프로필 수정');
//     fireEvent.click(editButton);
//     expect(mockNavigate).toBeCalledTimes(1);
//     expect(mockNavigate).toBeCalledWith('/edit_profile');

//     const editIcon = screen.getByTestId('editProfileIcon');
//     fireEvent.click(editIcon);
//     expect(mockNavigate).toBeCalledTimes(2);
//     expect(mockNavigate).toBeCalledWith('/edit_profile');
//   });
