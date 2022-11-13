import { render, screen } from '@testing-library/react';
import Loading, { LoadingBox, LoadingWithoutMinHeight } from './Loading';

test('Loading', () => {
  render(<Loading />);
  expect(screen.getByText('FITogether')).toBeInTheDocument();
});

test('Loading without MinHeight', () => {
  render(<LoadingWithoutMinHeight />);
  expect(screen.getByText('FITogether')).toBeInTheDocument();
});

test('LoadingBox', () => {
  render(<LoadingBox r="80px" />);
});
