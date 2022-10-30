import { render, screen } from '@testing-library/react';
import Loading, { LoadingBox } from './Loading';

test('Loading', () => {
  render(<Loading />);
  expect(screen.getByText('FITogether')).toBeInTheDocument();
});

test('LoadingBox', () => {
  render(<LoadingBox r="80px" />);
});
