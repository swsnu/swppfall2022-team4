import { render, screen, fireEvent } from '@testing-library/react';
import Passwords from './Passwords';

const onChanged = jest.fn();
beforeEach(() => jest.clearAllMocks());

test('Passwords', () => {
  render(
    <Passwords
      password="1234"
      passwordConfirm="1234"
      passwordWarning={{ color: '#000000', content: 'warning' }}
      passwordConfirmWarning={{ color: '#000000', content: 'warning' }}
      changed={onChanged}
    />,
  );
  const input = screen.getByPlaceholderText('Password');
  expect(input).toBeInTheDocument();
  fireEvent.change(input, { target: { value: 'change' } });
  expect(onChanged).toHaveBeenCalledTimes(1);
});
