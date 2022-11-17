import { render, screen } from '@testing-library/react';
import NotificationItem from './NotificationItem';

const onClick = jest.fn();
const onClickDelete = jest.fn();
beforeEach(() => jest.clearAllMocks());

test('NotificationItem', () => {
  render(
    <NotificationItem
      content="content"
      image="image"
      created="2022-11-11"
      clicked={onClick}
      clickedDelete={onClickDelete}
    />,
  );
  expect(screen.getByText('content')).toBeInTheDocument();
});
