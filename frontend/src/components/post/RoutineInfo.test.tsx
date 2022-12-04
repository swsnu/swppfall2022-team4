import { render, screen } from '@testing-library/react';
import { RoutineTypeInPost } from 'store/slices/workout';
import { RoutineInfo } from './RoutineInfo';

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const testMockRoutine: RoutineTypeInPost = {
  id: 1,
  name: '1',
  fitelements: [{ workout_type: '등운동', workout_name: '1', weight: 1, rep: 1, set: 1, time: 1 }],
};

describe('[RoutineInfo Component]', () => {
  test('basic rendering of RoutineInfo', () => {
    render(<RoutineInfo routine={testMockRoutine} />);
    // expect(screen.getByText('종류')).toBeInTheDocument();
  });
  test('X', () => {
    render(<RoutineInfo routine={null} />);
  });
});
