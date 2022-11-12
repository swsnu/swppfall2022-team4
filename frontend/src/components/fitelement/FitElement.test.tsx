import { render, screen } from '@testing-library/react';
import { FitElement } from './FitElement';

test('FitElement', () => {
  render(
    <FitElement
      key={0}
      id={0}
      type={''}
      workout_type={'workout_type_test'}
      category={''}
      weight={0}
      rep={0}
      set={0}
      time={0}
    />,
  );
  expect(screen.getByText('workout_type_test')).toBeInTheDocument();
});
