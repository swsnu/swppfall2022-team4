import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

test('NotFound', () => {
  render(<NotFound />);
  expect(screen.getByText('404')).toBeInTheDocument();
});
