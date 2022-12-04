/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupPosts from './GroupPosts';
import Router from 'react-router-dom';

import * as postAPI from '../../store/apis/post';
import { simplePosts } from 'store/slices/post.test';

const getPostsResponse: postAPI.getPostsResponseType = {
  posts: simplePosts,
  page: 5,
  page_size: 20,
  page_total: 5,
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
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  store.dispatch({
    type: 'group/getGroupDetailSuccess',
    payload: {
      id: 1,
      group_name: '1',
      number: 1,
      start_date: '1',
      end_date: '1',
      member_number: 1,
      lat: 1,
      lng: 1,
      address: '1',
      free: true,
      my_group: '1',
      tags: [
        {
          id: '1',
          name: '1',
          color: '1',
          posts: 1,
          calories: 1,
        },
      ],
      prime_tag: {
        id: '1',
        name: '1',
        color: '1',
        posts: 1,
        calories: 1,
      },
    },
  });
  render(
    <Provider store={store}>
      <GroupPosts />
    </Provider>,
  );
  return store;
};

describe('[PostMain Page]', () => {
  test('basic rendering', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/getGroupPostsSuccess',
        payload: getPostsResponse,
      });
    });
    expect(mockDispatch).toBeCalledTimes(2);
  });

  test('write post button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    setup();
    const createPostBtn = screen.getByText('글 쓰기');
    fireEvent.click(createPostBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group/detail/1/post/create');
  });

  test('article item click', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
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
    expect(mockNavigate).toBeCalledWith(`/group/detail/1/post/1`);
  });

  test('without user', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ group_id: '1' });
    const store = configureStore({ reducer: rootReducer });
    render(
      <Provider store={store}>
        <GroupPosts />
      </Provider>,
    );
  });
});
