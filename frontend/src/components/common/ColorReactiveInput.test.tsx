import { render } from '@testing-library/react';
import ColorReactiveInput from './ColorReactiveInput';

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const setup = () => {
  render(<ColorReactiveInput colorProp="#000000" />);
};

describe('[ColorReactiveInput Page]', () => {
  test('basic rendering', () => {
    setup();
  });
});
