import { render, screen } from '@testing-library/react';
import { Hover } from './Hover';

type fitElementType = {
  type: string;
  workout_type: string;
  period: number;
  category: string;
  color: string;
  weight: number;
  rep: number;
  set: number;
  time: number;
  date: string | null;
};

test('Hover', () => {
  render(<Hover key={0} workouts={[]} types={[]} />);
  expect(screen.getByText('기록된 운동이 없습니다!')).toBeInTheDocument();
});

test('Hover_1', () => {
  const fitElement_example: fitElementType = {
    type: 'log',
    workout_type: 'back',
    period: 0,
    category: '데드리프트',
    color: '#111111',
    weight: 0,
    rep: 0,
    set: 0,
    time: 10,
    date: '2022-10-14',
  };
  render(<Hover key={0} workouts={[fitElement_example]} types={[]} />);
  expect(screen.getByText('1 종류')).toBeInTheDocument();
});

test('Hover_2', () => {
  const fitElement_example: fitElementType = {
    type: 'log',
    workout_type: 'back',
    period: 0,
    category: '데드리프트',
    color: '#111111',
    weight: 0,
    rep: 0,
    set: 0,
    time: 10,
    date: '2022-10-14',
  };
  render(<Hover key={0} workouts={[fitElement_example, fitElement_example]} types={[]} />);
  expect(screen.getByText('2 종류')).toBeInTheDocument();
});
