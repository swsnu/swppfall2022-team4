import { render, screen, fireEvent } from '@testing-library/react';
import Button1 from './Button1';
import Button2 from './Button2';
import Button3 from './Button3';
import Button4 from './Button3';

const onClick = jest.fn();
beforeEach(() => jest.clearAllMocks());

describe('Buttons', () => {
  test.each([
    [1, <Button1 content="content" clicked={onClick} />],
    [2, <Button2 content="content" clicked={onClick} />],
    [3, <Button3 content="content" clicked={onClick} />],
    [4, <Button4 content="content" clicked={onClick} />],
  ])('test %d', (_, element) => {
    render(element);
    const button = screen.getByText('content');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
