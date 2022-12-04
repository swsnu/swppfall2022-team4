import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { MemoryRouter, Route, Routes } from 'react-router';
import { IProps as ElementProps } from '../../components/fitelement/FitElement';
import Routine from './Routine';
import { initialState, getMockStore } from 'test-utils/mock';
import userEvent from '@testing-library/user-event';

const store = getMockStore(initialState);
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

describe('routine', () => {
  let component: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    component = (
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Routine />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });

  it('render without errors', () => {
    const view = render(component);
    expect(view).toBeTruthy();
  });

  it('navigate to workout', () => {
    render(component);
    const calendarButton = screen.getByText('< 달력으로 돌아가기');
    fireEvent.click(calendarButton!);
    expect(mockNavigate).toBeCalledTimes(1);
  });

  it('change the state of selected routine2', async () => {
    render(component);
    const button = screen.getAllByText('test_routine')[0];
    fireEvent.click(button);
    expect(mockDispatch).toBeCalledTimes(2);
  });

  it('change the state of selected routine', () => {
    render(component);
    const button = screen.getAllByText('test_routine2')[0];
    fireEvent.click(button);
    expect(mockDispatch).toBeCalledTimes(2);
  });

  it('edit routine title', () => {
    render(component);
    const select_title = screen.getAllByText('test_routine')[0];
    fireEvent.click(select_title);
    const button = screen.getByTestId('title_edit_button');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('edit routine title_2', () => {
    render(component);
    const select_title = screen.getAllByText('test_routine')[0];
    fireEvent.click(select_title);
    const button_2 = screen.getByTestId('title_edit_button');
    fireEvent.click(button_2!);
    const button_1 = screen.getByTestId('title_cancel_button');
    const button = screen.getByTestId('title_submit_button');

    const edit_input = screen.getAllByTestId('edit_input')[0];
    userEvent.type(edit_input, 'new_title');

    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();

    userEvent.type(edit_input, 'new_title');
    fireEvent.click(button_1!);
  });
});
