import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { MemoryRouter, Route, Routes } from 'react-router';
import { IProps as ElementProps } from '../../components/fitelement/FitElement';
import Routine from './Routine';
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

jest.mock('../../components/fitelement/FitElement', () => (props: ElementProps) => (
  <div data-testid="spyFitelement">
    <div>{props.id}</div>
    <div>{props.workout_type}</div>
  </div>
));

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

  it('change the state of selected routine', () => {
    render(component);
    const button = screen.getAllByText('test_routine')[0];
    fireEvent.click(button!);
    expect(mockDispatch).toBeCalledTimes(2);
  });

  it('change the state of selected routine', () => {
    render(component);
    const button = screen.getAllByText('test_routine2')[0];
    fireEvent.click(button!);
    expect(mockDispatch).toBeCalledTimes(2);
    // const fitelements = screen.getAllByTestId('spyFitelement');
    // expect(fitelements).toHaveLength(1);
  });
});
