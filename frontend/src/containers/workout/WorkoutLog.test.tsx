import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { MemoryRouter, Route, Routes } from 'react-router';
import WorkoutLog from './WorkoutLog';
import { initialState, getMockStore } from 'test-utils/mock';

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

describe('workout_log', () => {
  let component: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    component = (
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<WorkoutLog />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });

  it('render without errors', () => {
    const view = render(component);
    expect(view).toBeTruthy();
  });

  it('navigate to routine', () => {
    render(component);
    const button = screen.getByText('루틴');
    fireEvent.click(button!);
    expect(mockNavigate).toBeCalledTimes(1);
  });

  it('createWorkoutLog', () => {
    render(component);
    const button = screen.getAllByText('완료')[0];
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('DayOnClick', () => {
    render(component);
    const button = screen.getAllByTestId('day_component')[0];
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('clickCalendarLeftButton', () => {
    render(component);
    const button = screen.getByText('<');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('clickCalendarRightButton', () => {
    render(component);
    const button = screen.getByText('>');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('addRoutineClick', () => {
    render(component);
    const button = screen.getByText('루틴추가');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('copyDailyLog', () => {
    render(component);
    const button = screen.getByText('내보내기');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('pasteDailyLog', () => {
    render(component);
    const button = screen.getByText('불러오기');
    fireEvent.click(button!);
    expect(mockDispatch).toBeCalledTimes(3);
  });

  it('memoOnClick', () => {
    render(component);
    const button = screen.getByTestId('memo_edit');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('confirm', () => {
    
  })
});
