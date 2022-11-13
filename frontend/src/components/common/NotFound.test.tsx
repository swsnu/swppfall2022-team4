import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from './NotFound';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

test('NotFound', () => {
  render(<NotFound />);
  expect(screen.getByText('404')).toBeInTheDocument();
  const button = screen.getByText('Home');
  expect(button).toBeInTheDocument();
  fireEvent.click(button);
  expect(mockNavigate).toHaveBeenCalledTimes(1);
});
