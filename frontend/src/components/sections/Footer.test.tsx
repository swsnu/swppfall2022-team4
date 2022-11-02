import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('Footer', () => {
  render(<Footer />);
  expect(screen.getByText('FITogether')).toBeInTheDocument();
});
