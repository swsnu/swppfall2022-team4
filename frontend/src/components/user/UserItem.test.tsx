import { fireEvent, render, screen } from '@testing-library/react';
import UserItem from './UserItem';

const onClick = jest.fn();
beforeEach(() => jest.clearAllMocks());

test('UserItem', () => {
  render(<UserItem user={{ username: 'username', nickname: 'nickname', image: 'image.png' }} clicked={onClick} />);
  expect(screen.getByText('nickname')).toBeInTheDocument();
  fireEvent.click(screen.getByText('nickname'));
  expect(onClick).toBeCalledTimes(1);
});
