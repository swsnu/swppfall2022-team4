import { render, screen, fireEvent } from '@testing-library/react';
import Input1 from './Input1';

const onChanged = jest.fn();
beforeEach(() => jest.clearAllMocks());

describe('Inputs', () => {
  test.each([
    [1, <Input1 type="text" placeholder="placeholder" name="name" value="value" changed={e => onChanged(e)} />],
  ])('test %d', (_, element) => {
    render(element);
    const input = screen.getByPlaceholderText('placeholder');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'change' } });
    expect(onChanged).toHaveBeenCalledTimes(1);
  });
});
