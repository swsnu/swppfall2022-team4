import { render, screen } from '@testing-library/react';
import ChatroomButton from './ChatroomButton';

const onClick = jest.fn();
beforeEach(() => jest.clearAllMocks());

describe('ChatroomButton', () => {
  test('user is empty', () => {
    render(<ChatroomButton user={null} clicked={onClick} active={false} />);
    expect(screen.getByText('(알수없음)')).toBeInTheDocument();
  });

  test('user is not empty', () => {
    render(
      <ChatroomButton
        user={{ username: 'username', nickname: 'nickname', image: 'image.png' }}
        clicked={onClick}
        active={false}
      />,
    );
    expect(screen.getByText('nickname')).toBeInTheDocument();
  });
});
