/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import PostCreate from './PostCreate';

import * as postAPI from '../../store/apis/post';
import * as tagAPI from '../../store/apis/tag';
import userEvent from '@testing-library/user-event';

import { Store } from 'react-notifications-component';
beforeEach(() => {
  Store.addNotification = jest.fn();
});
afterAll(() => jest.restoreAllMocks());

const simpleTagVisuals: tagAPI.TagVisual[] = [{ id: '1', name: 'interesting', color: '#101010' }];
const simpleTagVisuals2: tagAPI.TagVisual[] = [{ id: '2', name: 'tagtagtag', color: '#101010' }];
const simplePostID: postAPI.postIdentifyingType = {
  post_id: '59',
};
const getTagsResponse: tagAPI.getTagListResponseType = {
  tags: [
    {
      id: 1,
      class_name: 'hey',
      class_type: 'general',
      color: '#101010',
      tags: simpleTagVisuals,
    },
    {
      id: 2,
      class_name: 'place',
      class_type: 'place',
      color: '#111111',
      tags: simpleTagVisuals2,
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
const searchTagsResponse = {
  tags: [simpleTagVisuals[0]],
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
      payload: {
        title: 'Rullu',
        content: 'Ralla',
        author_name: 'username',
        tags: [],
        images: [],
        prime_tag: undefined,
      },
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

describe('[PostEditor Page - Tag]', () => {
  test('set tag', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });

    const tagClassOption = screen.getByRole('option', { name: getTagsResponse.tags[0].class_name }); // Tag Class
    expect((tagClassOption as HTMLOptionElement).selected).not.toBeTruthy();
    userEvent.selectOptions(screen.getByTestId('tagClassSelect'), tagClassOption);
    expect((tagClassOption as HTMLOptionElement).selected).toBeTruthy();

    const tagOption = screen.getByRole('option', { name: 'interesting' }); // Tag
    expect((tagOption as HTMLOptionElement).selected).not.toBeTruthy();
    userEvent.selectOptions(screen.getByTestId('tagSelect'), tagOption);
    expect((tagOption as HTMLOptionElement).selected).not.toBeTruthy(); // Tag Select would be cleared right after selection

    const selectedTag = screen.getByTestId(`selectedTag-${getTagsResponse.tags[0].id}`);
    expect(selectedTag).toBeValid();

    fireEvent.click(selectedTag); // Prime tag

    const duplicatedTagOption = screen.getByRole('option', { name: 'interesting' }); // Duplicated Tag
    userEvent.selectOptions(screen.getByTestId('tagSelect'), duplicatedTagOption);

    const selectedTagRemove = screen.getByTestId('tagBubbleXBtn');
    fireEvent.click(selectedTagRemove);
    const selectedTagAfterRemove = screen.queryByTestId(`selectedTag-${getTagsResponse.tags[0].id}`);
    expect(selectedTagAfterRemove).toBeNull();

    const tagClassOption2 = screen.getByRole('option', { name: 'place' }); // Tag Class
    userEvent.selectOptions(screen.getByTestId('tagClassSelect'), tagClassOption2);
    expect((tagClassOption2 as HTMLOptionElement).selected).toBeTruthy();
  });
  test('create tag class', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });

    const tagClassOption = screen.getByRole('option', { name: '- 태그 카테고리 생성 -' }); // Tag Class Create
    userEvent.selectOptions(screen.getByTestId('tagClassSelect'), tagClassOption);
    expect((tagClassOption as HTMLOptionElement).selected).toBeTruthy();

    const newTagClassInput = screen.getByPlaceholderText('카테고리 이름');
    userEvent.type(newTagClassInput, 'Humor');

    const randColorDice = screen.getByTestId('randColorDice');
    fireEvent.click(randColorDice);

    const newTagClassBtn = screen.getByText('분류 생성');
    fireEvent.click(newTagClassBtn);

    expect(mockDispatch).toBeCalledTimes(5);
    expect(mockDispatch).toBeCalledWith({
      payload: { name: 'Humor', color: expect.anything() },
      type: 'tag/createTagClass',
    });
  });
  test('search tag', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });

    const tagClassOption = screen.getByRole('option', { name: '- 태그 검색 -' }); // Tag Search
    userEvent.selectOptions(screen.getByTestId('tagClassSelect'), tagClassOption);
    expect((tagClassOption as HTMLOptionElement).selected).toBeTruthy();

    const tagSearchInput = screen.getByPlaceholderText('태그 이름');
    userEvent.type(tagSearchInput, 'nt');

    const searchTagBtn = screen.getByTestId('tagSearchBtn');
    fireEvent.click(searchTagBtn);

    act(() => {
      store.dispatch({
        type: 'tag/searchTagSuccess',
        payload: searchTagsResponse,
      });
    });

    const searchedTag = screen.getByTestId(`searchedTag-${getTagsResponse.tags[0].id}`);
    fireEvent.click(searchedTag);

    fireEvent.click(searchedTag); // Duplicated tag
  });
  test('create tag', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });

    const tagClassOption = screen.getByRole('option', { name: getTagsResponse.tags[0].class_name }); // Tag Class
    userEvent.selectOptions(screen.getByTestId('tagClassSelect'), tagClassOption);
    expect((tagClassOption as HTMLOptionElement).selected).toBeTruthy();

    const tagOption = screen.getByRole('option', { name: '- 태그 만들기 -' }); // Tag
    userEvent.selectOptions(screen.getByTestId('tagSelect'), tagOption);

    const tagNameInput = screen.getByPlaceholderText('생성할 태그 이름');
    userEvent.type(tagNameInput, 'Deadlift');

    const tagCreateBtn = screen.getByText('생성');
    fireEvent.click(tagCreateBtn);

    act(() => {
      store.dispatch({
        type: 'tag/createTagSuccess',
        payload: { tags: simpleTagVisuals2[0] },
      });
    });
  });
  test('select tag class when tagList is null', () => {
    setup();

    const tagClassOption = screen.getByRole('option', { name: '- 태그 검색 -' }); // Tag Class
    userEvent.selectOptions(screen.getByTestId('tagClassSelect'), tagClassOption);
    expect((tagClassOption as HTMLOptionElement).selected).toBeTruthy();
  });
});
