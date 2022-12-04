import { render } from '@testing-library/react';
import { LevelBadgeFn, UserBadge } from './UserBadge';

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

describe('[UserBadge Component]', () => {
  test('basic rendering of LevelBadgeFn', () => {
    render(LevelBadgeFn(1));
  });
  test('basic rendering of LevelBadgeFn2', () => {
    render(LevelBadgeFn(6));
  });
  test('basic rendering of LevelBadgeFn3', () => {
    render(LevelBadgeFn(12));
  });
  test('basic rendering of UserBadge', () => {
    render(<UserBadge nickname={'1'} level={1} />);
  });
});
