/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupCreate from './GroupCreate';
import * as tagApi from '../../store/apis/tag';
import userEvent from '@testing-library/user-event';

const TagResponse: tagApi.TagClass[] = [
  {
    id: 1,
    class_name: '등운동',
    class_type: '등운동',
    color: 'gray',
    tags: [{ id: '1', name: '데드리프트', color: 'gray' }],
  },
  {
    id: 2,
    class_name: '가슴운동',
    class_type: '가슴운동',
    color: 'gray',
    tags: [{ id: '1', name: '벤치프레스', color: 'gray' }],
  },
];
const simpleTagVisuals: tagApi.TagVisual[] = [
  { id: '1', name: 'interesting', color: '#101010' },
  { id: '3', name: 'tag2', color: '#101010' },
];
const simpleTagVisuals2: tagApi.TagVisual[] = [{ id: '2', name: 'tagtagtag', color: '#101010' }];
const getTagsResponse: tagApi.getTagListResponseType = {
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
    {
      id: 3,
      class_name: 'workout',
      class_type: 'workout',
      color: '#122222',
      tags: [],
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
    type: 'workoutlog/getFitElementTypesSuccess',
    payload: TagResponse,
  });
  render(
    <Provider store={store}>
      <GroupCreate />
    </Provider>,
  );
  return store;
};

describe('setup test', () => {
  it('Initialize', () => {
    setup();
    const back = screen.getByText('Cancel');
    fireEvent.click(back);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group');
    expect(screen.getAllByRole('option').length).toBe(7); // Tag Option Added
  });
  it('no group name', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('no group description', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    userEvent.type(nameInput, 'group test');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('no date', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const descriptionInput = screen.getByPlaceholderText('그룹의 설명');
    const maxNumCheck = screen.getByTestId('maxNumCheck');
    userEvent.type(nameInput, 'group test');
    userEvent.type(descriptionInput, 'group description');
    fireEvent.click(maxNumCheck);
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('wrong date', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const descriptionInput = screen.getByPlaceholderText('그룹의 설명');
    const maxNumCheck = screen.getByTestId('maxNumCheck');
    const startInput = screen.getByTestId('start_date');
    const endInput = screen.getByTestId('end_date');

    userEvent.type(nameInput, 'group test');
    userEvent.type(descriptionInput, 'group description');
    fireEvent.click(maxNumCheck);
    userEvent.type(startInput, '2021-01-01');
    userEvent.type(endInput, '2019-01-01');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('good date & no goal', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const descriptionInput = screen.getByPlaceholderText('그룹의 설명');
    const maxNumCheck = screen.getByTestId('maxNumCheck');
    const startInput = screen.getByTestId('start_date');
    const endInput = screen.getByTestId('end_date');

    userEvent.type(nameInput, 'group test');
    userEvent.type(descriptionInput, 'group description');
    fireEvent.click(maxNumCheck);
    userEvent.type(startInput, '2019-01-01');
    userEvent.type(endInput, '2020-01-01');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('wrong goals', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const selectCategory = screen.getByTestId('category');
    const selectType = screen.getByTestId('workoutType');
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const addBtn = screen.getByText('추가');

    fireEvent.change(selectCategory, { target: { value: '등운동' } });
    fireEvent.change(selectType, { target: { value: '데드리프트' } });

    userEvent.type(weight, '10');
    fireEvent.click(addBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);

    userEvent.type(rep, '10');
    fireEvent.click(addBtn);
    expect(alertMock).toHaveBeenCalledTimes(2);

    userEvent.type(set, '10');
    fireEvent.click(addBtn);
    expect(alertMock).toHaveBeenCalledTimes(3);
  });
  it('create goal', () => {
    setup();
    const selectCategory = screen.getByTestId('category');
    const selectType = screen.getByTestId('workoutType');

    fireEvent.change(selectCategory, { target: { value: '등운동' } });
    fireEvent.change(selectType, { target: { value: '데드리프트' } });

    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const time = screen.getByTestId('time');

    userEvent.type(weight, '10');
    userEvent.type(rep, '10');
    userEvent.type(set, '10');
    userEvent.type(time, '10');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);

    const XBtn = screen.getByTestId('removeGoal');
    fireEvent.click(XBtn);
  });
  it('no address', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const maxNum = screen.getByTestId('maxNum');
    const setDate = screen.getByTestId('setDate');
    const descriptionInput = screen.getByPlaceholderText('그룹의 설명');
    const freeCheck = screen.getByTestId('freeCheck');
    userEvent.type(nameInput, 'group test');
    userEvent.type(maxNum, '10');
    fireEvent.click(setDate);
    fireEvent.click(freeCheck);
    userEvent.type(descriptionInput, 'group test');

    const selectCategory = screen.getByTestId('category');
    const selectType = screen.getByTestId('workoutType');
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const time = screen.getByTestId('time');

    fireEvent.change(selectCategory, { target: { value: '등운동' } });
    fireEvent.change(selectType, { target: { value: '데드리프트' } });
    userEvent.type(weight, '20');
    userEvent.type(rep, '20');
    userEvent.type(set, '20');
    userEvent.type(time, '20');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);

    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('save', () => {
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const maxNumCheck = screen.getByTestId('maxNumCheck');
    const setDate = screen.getByTestId('setDate');
    const descriptionInput = screen.getByPlaceholderText('그룹의 설명');
    const freeCheck = screen.getByTestId('freeCheck');
    const placeCheck = screen.getByTestId('placeCheck');
    userEvent.type(nameInput, 'group test');
    fireEvent.click(maxNumCheck);
    fireEvent.click(setDate);
    fireEvent.click(freeCheck);
    fireEvent.click(placeCheck);
    userEvent.type(descriptionInput, 'group test');

    const selectCategory = screen.getByTestId('category');
    const selectType = screen.getByTestId('workoutType');
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const time = screen.getByTestId('time');

    fireEvent.change(selectCategory, { target: { value: '등운동' } });
    fireEvent.change(selectType, { target: { value: '데드리프트' } });
    userEvent.type(weight, '20');
    userEvent.type(rep, '20');
    userEvent.type(set, '20');
    userEvent.type(time, '20');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);

    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(mockDispatch).toBeCalledTimes(3);
  });
  it('save & navigate', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/createGroupSuccess',
        payload: { id: '1' },
      });
    });
    expect(mockNavigate).toBeCalledTimes(1);
  });
  it('keyword', () => {
    setup();
    const placeInput = screen.getByPlaceholderText('장소 검색');
    userEvent.type(placeInput, '봉천동');
  });
  it('set tag', () => {
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
});
