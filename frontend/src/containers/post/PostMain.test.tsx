/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import PostMain from './PostMain';

import * as postAPI from '../../store/apis/post';
import * as tagAPI from '../../store/apis/tag';
import userEvent from '@testing-library/user-event';
import { simpleComments, simplePosts, simpleTagVisuals } from 'store/slices/post.test';
import { TagDetailModalIprops } from 'components/post/TagDetailModal';

jest.mock('../../components/post/TagDetailModal.tsx', () => (props: TagDetailModalIprops) => (
  <div data-testid="spyTagModal">
    <button data-testid="spyTagModalDelete" onClick={props.onClose}>
      delete
    </button>
  </div>
));

const simpleSearch = {
  search_keyword: 'searchKeyword',
};

const getPostsResponse: postAPI.getPostsResponseType = {
  posts: simplePosts,
  page: 5,
  page_size: 15,
  page_total: 5,
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
    expect(mockDispatch).toBeCalledTimes(3); // getTags, getPosts, getRecentComments
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
    expect(mockNavigate).toBeCalledWith(`/post/${getPostsResponse.posts[0].post_id}`);
  });
  test('search', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/postSearch',
        payload: simpleSearch,
      });
    });
    expect(mockNavigate).toBeCalledTimes(0);

    const searchInput = screen.getByPlaceholderText('Search keyword');
    userEvent.type(searchInput, 'sssss');
    const searchClearBtn = screen.getByText('Clear');
    fireEvent.click(searchClearBtn);
    expect(searchInput).toHaveValue('');
    userEvent.type(searchInput, 'sssss');
    fireEvent.submit(searchInput);
  });
  test('sidebar recent comment button', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getRecentCommentsSuccess',
        payload: getRecentCommentsResponse,
      });
    });
    const sidebarComment = screen.getByText('GETBYCOMComm...');
    fireEvent.click(sidebarComment);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(`/post/${simpleComments[1].post_id}`);
  });
  test('paginator', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getPostsSuccess',
        payload: getPostsResponse,
      });
    });

    const lastPage = screen.getByText('▶︎▶︎');
    const nextPage = screen.getByText('▶︎');
    const prevPage = screen.getByText('◀');
    const firstPage = screen.getByText('◀◀');

    expect(firstPage).toBeDisabled();
    expect(prevPage).toBeDisabled();
    expect(lastPage).not.toBeDisabled();
    fireEvent.click(lastPage);

    expect(lastPage).toBeDisabled();
    expect(nextPage).toBeDisabled();

    lastPage.removeAttribute('disabled');
    fireEvent.click(lastPage);

    nextPage.removeAttribute('disabled');
    fireEvent.click(nextPage);

    fireEvent.click(prevPage);
    expect(nextPage).not.toBeDisabled();

    fireEvent.click(nextPage);
    fireEvent.click(firstPage);

    const page4 = screen.getByText('4');
    fireEvent.click(page4);
  });

  test('modal test', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getPostsSuccess',
        payload: getPostsResponse,
      });
    });

    const tagModal = screen.getByText('자세히보기');
    fireEvent.click(tagModal);

    const tagModalClose = screen.getByTestId('spyTagModalDelete');
    fireEvent.click(tagModalClose);
  });
});
