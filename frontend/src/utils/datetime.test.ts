import { processTime, timeAgoFormat } from './datetime';

describe('datetime', () => {
  test('timeAgoFormat', () => {
    expect(timeAgoFormat(new Date('2010-11-10T23:59:57.0'), new Date('2000-11-10T23:59:57.0'))).toEqual('오래전');
    expect(timeAgoFormat(new Date('2000-11-11T00:00:00.0'), new Date('2000-11-10T23:59:57.0'))).toEqual('3초 전');
    expect(timeAgoFormat(new Date('2000-11-11T00:01:30.0'), new Date('2000-11-10T23:59:57.0'))).toEqual('2분 전');
    expect(timeAgoFormat(new Date('2000-11-11T02:54:57.0'), new Date('2000-11-10T23:59:57.0'))).toEqual('3시간 전');
    expect(timeAgoFormat(new Date('2000-11-12T00:54:57.0'), new Date('2000-11-10T23:59:57.0'))).toEqual('2일 전');
  });
  test('processTime', () => {
    expect(processTime('2000-11-12T00:54:57.0')).toEqual(new Date('2000-11-12T00:54:57.0').toString());
  });
});
