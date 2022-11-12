import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { MemoryRouter, Route, Routes } from 'react-router';
import Routine from './Routine';
import { initialState, getMockStore } from 'test-utils/mock';

const store = getMockStore(initialState);

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
});
