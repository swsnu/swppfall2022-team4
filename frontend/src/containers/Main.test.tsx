import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { MemoryRouter, Route, Routes } from 'react-router';
import Main from './Main';

import { initialState, getMockStore } from 'test-utils/mock';

const store = getMockStore(initialState);
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: () => mockDispatch,
}));

describe('main', () => {
  let component: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    component = (
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  test('render without errors', () => {
  });
});
