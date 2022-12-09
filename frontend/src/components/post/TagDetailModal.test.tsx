/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import TagDetailModal from './TagDetailModal';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'store';
import { Provider } from 'react-redux';
import { getTagListResponseType } from 'store/apis/tag';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

jest.mock('react-transition-group', () => ({
  ...jest.requireActual('react-transition-group'),
  CSSTransition: (elem: any) => {
    // eslint-disable-next-line testing-library/no-node-access
    return <div>{elem.children.props.children}</div>;
  },
}));
interface IPropsChromePicker {
  onChange: (color: string) => void;
}
jest.mock('react-color', () => ({
  ...jest.requireActual('react-color'),
  ChromePicker: ({ onChange }: IPropsChromePicker) => (
    <div onClick={() => onChange('#111111')} data-testid="chromePicker"></div>
  ),
}));

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const getTagsResponse: getTagListResponseType = {
  tags: [
    {
      id: 1,
      class_name: 'workout',
      class_type: 'workout',
      color: '#101010',
      tags: [
        { id: '1', name: 'tag1', color: '#101010', calories: 3.2 },
        { id: '2', name: 'tag2', color: '#101011', calories: 0.3 },
      ],
    },
    {
      id: 2,
      class_name: 'general',
      class_type: 'general',
      color: '#ff1010',
      tags: [
        { id: '3', name: 'tag3', color: '#101010' },
        { id: '4', name: 'tag4', color: '#101011' },
      ],
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

const simpleProfile = {
  username: 'username',
  nickname: 'nickname',
  image: 'image',
  gender: 'male',
  height: 180,
  weight: 1,
  age: 23,
  exp: 0,
  level: 1,
  created: '2011-12-11',
  is_follow: false,
  information: {
    post: [],
    comment: [],
    scrap: [],
    follower: [{ username: '1', nickname: '2', image: '3' }],
    following: [{ username: '1', nickname: '2', image: '3' }],
  },
};

const mockDispatch = jest.fn();
const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  store.dispatch({
    type: 'user/getProfileSuccess',
    payload: simpleProfile,
  });
  render(
    <Provider store={store}>
      <TagDetailModal
        isActive={false}
        onClose={jest.fn()}
        modalRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
        modalAnimRef={1 as unknown as React.MutableRefObject<null>}
        dispatch={mockDispatch}
      />
    </Provider>,
  );
  act(() => {
    store.dispatch({
      type: 'tag/getTagsSuccess',
      payload: getTagsResponse,
    });
  });
  return store;
};

describe('[TagDetailModal Component]', () => {
  test('basic rendering', () => {
    setup();

    // Close
    const closeBtn = screen.getByTestId('tagModalCloseBtn');
    fireEvent.click(closeBtn);
  });
  test('filtering test', () => {
    const store = setup();

    // Filtering Test
    const tagBubble1 = screen.getByText('tag1 | 3.20');
    fireEvent.click(tagBubble1); // Filtering On
    act(() => {
      store.dispatch({
        type: 'post/toggleFilterTag',
        payload: getTagsResponse.tags[0],
      });
    });
    fireEvent.click(tagBubble1); // Filtering Off
    act(() => {
      store.dispatch({
        type: 'post/toggleFilterTag',
        payload: getTagsResponse.tags[0],
      });
    });
  });
  test('tag create basic test', () => {
    setup();

    // Filtering Test
    const tagCreates = screen.getAllByText('눌러서 추가');
    expect(tagCreates).toHaveLength(2);
    // Workout Tag Create
    fireEvent.click(tagCreates[0]); // Workout Create

    const cancelBtn = screen.getByText('취소');
    fireEvent.click(cancelBtn); // Test Cancel

    expect(screen.queryByPlaceholderText('새로운 태그 이름')).toBeNull();
  });
  test('tag create test', () => {
    setup();

    // Filtering Test
    const tagCreates = screen.getAllByText('눌러서 추가');
    expect(tagCreates).toHaveLength(2);
    // Workout Tag Create
    fireEvent.click(tagCreates[0]); // Workout Create

    const createBtn = screen.getByTestId('tagModalTagCreate');
    expect(createBtn).toBeDisabled();

    const workoutNameInput = screen.getByPlaceholderText('새로운 태그 이름');
    userEvent.type(workoutNameInput, 'newWork123123123123');
    const workoutCalInput = screen.getByPlaceholderText('운동 칼로리(kcal/min/kg)');
    userEvent.type(workoutCalInput, '3.33');

    expect(createBtn).not.toBeDisabled();
    fireEvent.click(createBtn);
  });
  test('tag category create test', () => {
    setup();

    // Filtering Test
    const newCateogryBtn = screen.getByText('새로운 카테고리');
    fireEvent.click(newCateogryBtn);
    const chromePicker = screen.getByTestId('chromePicker');
    fireEvent.click(chromePicker);
    const randColorBtn = screen.getByText('랜덤 색상');
    fireEvent.click(randColorBtn);
    const newCategoryNameInput = screen.getByPlaceholderText('새로운 카테고리 이름');
    userEvent.type(newCategoryNameInput, '123456789101112');
    const newCategorySubmitBtn = screen.getByTestId('tagModalCategoryCreate');
    fireEvent.click(newCategorySubmitBtn);
  });
  test('calories', () => {
    setup();

    const caloriesMode = screen.getByText('모드 전환');
    fireEvent.click(caloriesMode);
  });
  test('tag ranking tab', () => {
    setup();

    const rankingTab = screen.getByText('인기있는 태그');
    fireEvent.click(rankingTab);
    const listTab = screen.getByText('태그 목록');
    fireEvent.click(listTab);
  });
});
