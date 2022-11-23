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
import { simplePosts, simpleTagVisuals } from 'store/slices/post.test';

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
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <PostEdit />
    </Provider>,
  );
  return store;
};

describe('[PostEdit Page]', () => {
  test('basic rendering', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
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
    expect(mockDispatch).toBeCalledTimes(2); // getTags, updatePostDetail
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
    expect(mockNavigate).toBeCalledTimes(0);

    screen.getByDisplayValue('First Post');
  });
  test('basic rendering with images', () => {
    // Second post for has image
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '2' });
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
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: undefined });
    setup();

    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).not.toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
  });
  test('edit cancle button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
    setup();
    const cancelBtn = screen.getByText('취소');
    fireEvent.click(cancelBtn);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/post/1');
  });
  test('edit confirm button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
    setup();
    const confirmBtn = screen.getByText('완료');
    fireEvent.click(confirmBtn); // cannot click.
    expect(mockDispatch).toBeCalledTimes(2); // getTags, updatePostDetail
  });
  test('edit confirm button after typing', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
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
    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        post_id: '1',
        title: 'Rullu',
        content: 'Ralla',
        tags: [],
        images: [],
        prime_tag: undefined,
      },
      type: 'post/editPost',
    });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
  });
  test('edit confirm button after typing with invalid id', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: undefined });
    setup();
    const confirmBtn = screen.getByText('완료');
    const titleInput = screen.getByPlaceholderText('제목');
    const contentInput = screen.getByPlaceholderText('내용');
    userEvent.type(titleInput, 'Rullu');
    userEvent.type(contentInput, 'Ralla');
    fireEvent.click(confirmBtn);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).not.toBeCalledWith({
      payload: {
        post_id: '1',
        title: 'Rullu',
        content: 'Ralla',
        tags: [],
        prime_tag: undefined,
      },
      type: 'post/editPost',
    });
    expect(mockDispatch).not.toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
  });
  test('post edit success', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'post/editPostSuccess',
        payload: undefined,
      });
    });
    expect(mockDispatch).toBeCalledTimes(4);
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/getTags' });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'post/stateRefresh' });
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: 'tag/clearTagState' });

    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith(`/post/1`);
  });
});
