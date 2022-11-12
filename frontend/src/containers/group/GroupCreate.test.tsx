/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import GroupCreate from './GroupCreate';
import userEvent from '@testing-library/user-event';

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
  it('init', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/stateRefresh',
        payload: undefined,
      });
    })
    const back = screen.getByText('Back');
    fireEvent.click(back);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group');
  });
  it('init', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'group/stateRefresh',
        payload: undefined,
      });
    })
    const back = screen.getByText('Back');
    fireEvent.click(back);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/group');
  });
  it('no write', () => {
    const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
    setup();
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1)
  })
  it('no write', () => {
    const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    userEvent.type(nameInput, 'group test');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1)
  })
  it('no write', () => {
    const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const numberInput = screen.getByDisplayValue('0');
    userEvent.type(nameInput, 'group test');
    userEvent.type(numberInput, '1');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
    expect(alertMock).toHaveBeenCalledTimes(1)
  })
  it('wrong date', () => {
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const descriptionInput = screen.getByPlaceholderText('그룹의 설명');
    const numberInput = screen.getByDisplayValue('0');
    const startInput = screen.getByTestId('start_date');
    const endInput = screen.getByTestId('end_date');
    userEvent.type(nameInput, 'group test');
    userEvent.type(descriptionInput, 'group description');
    userEvent.type(numberInput, '10');
    userEvent.type(startInput, '2021-01-01');
    userEvent.type(endInput, '2019-01-02');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
  })
  it('no write', () => {
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const numberInput = screen.getByDisplayValue('0');
    const startInput = screen.getByTestId('start_date');
    const endInput = screen.getByTestId('end_date');
    userEvent.type(nameInput, 'group test');
    userEvent.type(numberInput, '10');
    userEvent.type(startInput, '2019-01-01');
    userEvent.type(endInput, '2019-01-02');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
  })
  it('no write', () => {
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const numberInput = screen.getByDisplayValue('0');
    userEvent.type(nameInput, 'group test');
    userEvent.type(numberInput, '10');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
  })
  it('save', () => {
    setup();
    const nameInput = screen.getByPlaceholderText('그룹의 이름');
    const descriptionInput = screen.getByPlaceholderText('그룹의 설명');
    const numberInput = screen.getByDisplayValue('0');
    const startInput = screen.getByTestId('start_date');
    const endInput = screen.getByTestId('end_date');
    userEvent.type(nameInput, 'group test');
    userEvent.type(descriptionInput, 'group description');
    userEvent.type(numberInput, '10');
    userEvent.type(startInput, '2019-01-01');
    userEvent.type(endInput, '2019-01-02');
    const saveBtn = screen.getByText('Create');
    fireEvent.click(saveBtn);
  })
});