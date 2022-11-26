/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupCreate from './GroupCreate';
import * as tagApi from '../../store/apis/tag';
import userEvent from '@testing-library/user-event';

const TagResponse: tagApi.TagClass[] = [{
  id: 1,
  class_name: 'back',
  class_type: 'back',
  color: 'gray',
  tags: [{id:'1', name:'back', color: 'gray'}]
},{
  id: 2,
  class_name: 'chest',
  class_type: 'chest',
  color: 'gray',
  tags: [{id:'1', name:'chest', color: 'gray'}]
}
]

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
      <GroupCreate />
    </Provider>,
  );
  return store;
};

describe('setup test', () => {
  it('init1', () => {
    setup();
    const back = screen.getByText('Back');
    fireEvent.click(back);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group');
  });
  it('no group name', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('no max number', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    userEvent.type(nameInput, 'group test');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('no max number check & no date', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    userEvent.type(nameInput, 'group test');
    const maxNumCheck = screen.getByTestId('maxNumCheck');
    fireEvent.click(maxNumCheck);
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('wrong date', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const maxNumCheck = screen.getByTestId('maxNumCheck');
    const startInput = screen.getByTestId('start_date');
    const endInput = screen.getByTestId('end_date');
    userEvent.type(nameInput, 'group test');
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
    const maxNum = screen.getByTestId('maxNum');
    const startInput = screen.getByTestId('start_date');
    const endInput = screen.getByTestId('end_date');
    userEvent.type(nameInput, 'group test');
    userEvent.type(maxNum, '10');
    userEvent.type(startInput, '2019-01-01');
    userEvent.type(endInput, '2019-01-02');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('Get fit types', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    expect(screen.getAllByRole('option').length).toBe(2)
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('wrong goal', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    
    const weight = screen.getByTestId('weight');
    
    userEvent.type(weight, '10');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('wrong goal', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    
    userEvent.type(weight, '10');
    userEvent.type(rep, '10');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('wrong goal', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    
    userEvent.type(weight, '10');
    userEvent.type(rep, '10');
    userEvent.type(set, '10');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });
  it('good goal', () => {
    setup();
    
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const time = screen.getByTestId('time');
    
    userEvent.type(weight, '20');
    userEvent.type(rep, '20');
    userEvent.type(set, '20');
    userEvent.type(time, '20');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);
    
    //screen.getByText('1');
  });
  it('good goal & remove goal', () => {
    setup();
    
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const time = screen.getByTestId('time');
    
    userEvent.type(weight, '20');
    userEvent.type(rep, '20');
    userEvent.type(set, '20');
    userEvent.type(time, '20');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);
    //const XBtn = screen.getByTestId('removeGoal');
    //fireEvent.click(XBtn);
  });
  it('good goal & no description', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const maxNumCheck = screen.getByTestId('maxNumCheck');
    const setDate = screen.getByTestId('setDate');
    userEvent.type(nameInput, 'group test');
    fireEvent.click(maxNumCheck);
    fireEvent.click(setDate);

    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const time = screen.getByTestId('time');
    
    userEvent.type(weight, '20');
    userEvent.type(rep, '20');
    userEvent.type(set, '20');
    userEvent.type(time, '20');
    //const addBtn = screen.getByText('추가');
    //fireEvent.click(addBtn);

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

    
    const weight = screen.getByTestId('weight');
    const rep = screen.getByTestId('rep');
    const set = screen.getByTestId('set');
    const time = screen.getByTestId('time');
    
    userEvent.type(weight, '20');
    userEvent.type(rep, '20');
    userEvent.type(set, '20');
    userEvent.type(time, '20');
    const addBtn = screen.getByText('추가');
    fireEvent.click(addBtn);

    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    //expect(mockDispatch).toBeCalledTimes(1);
  });
  it('save & navigate', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/createGroupSuccess',
        payload: {id: '1'},
      });
    });
    expect(mockNavigate).toBeCalledTimes(1);
  });
  it('keyword', () => {
    setup();
    const placeInput = screen.getByPlaceholderText('장소 검색');
    userEvent.type(placeInput, '봉천동');
  });
});
