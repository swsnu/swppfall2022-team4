import { timeAgoFormat } from './datetime';

describe('datetime', () => {
  test('timeAgoFormat', () => {
    expect(timeAgoFormat('2000-11-10T23:59:57.0')).toEqual('오래전');
  });
});
