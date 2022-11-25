import { render, screen } from '@testing-library/react';
import { FitElement } from './FitElement';

test('FitElement', () => {
  render(
    <FitElement
      key={0}
      id={0}
      type={'log'}
      workout_type={'데드리프트'}
      category={'등운동'}
      weight={0}
      rep={0}
      set={0}
      time={20}
    />,
  );
  expect(screen.getByText('데드리프트')).toBeInTheDocument();
});
