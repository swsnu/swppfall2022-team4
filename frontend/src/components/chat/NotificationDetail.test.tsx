import { render, screen } from '@testing-library/react';
import NotificationDetail from './NotificationDetail';

const onClick = jest.fn();
const onClickDelete = jest.fn();
beforeEach(() => jest.clearAllMocks());

test('NotificationDetail', () => {
  render(
    <NotificationDetail
      content="content"
      image="image"
      created="2022-11-11"
      clicked={onClick}
      clickedDelete={onClickDelete}
    />,
  );
  expect(screen.getByText('content')).toBeInTheDocument();
});
