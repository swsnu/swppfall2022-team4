import { fireEvent, render, screen } from '@testing-library/react';
import { Group } from 'store/apis/group';
import { GroupInfo } from './GroupInfo';

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const mockNavigate = jest.fn();
const testMockGroup: Group = {
  id: 1,
  group_name: '1',
  number: 1,
  start_date: '1',
  end_date: '1',
  member_number: 1,
  lat: 1,
  lng: 1,
  address: '1',
  free: true,
  my_group: '1',
  tags: [
    {
      id: '1',
      name: '1',
      color: '1',
      posts: 1,
      calories: 1,
    },
  ],
  prime_tag: {
    id: '1',
    name: '1',
    color: '1',
    posts: 1,
    calories: 1,
  },
};

describe('[GroupInfo Component]', () => {
  test('basic rendering of GroupInfo', () => {
    render(<GroupInfo group={testMockGroup} navigate={mockNavigate} />);
    fireEvent.click(screen.getByText('태그된 그룹'));
    expect(mockNavigate).toBeCalledTimes(1);
  });
  test('basic rendering of GroupInfo2', () => {
    render(
      <GroupInfo
        group={{ ...testMockGroup, prime_tag: undefined, number: null, start_date: null }}
        navigate={mockNavigate}
      />,
    );
  });
  test('X', () => {
    render(<GroupInfo group={null} navigate={jest.fn()} />);
  });
});
