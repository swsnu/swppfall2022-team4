import { render, screen, fireEvent } from '@testing-library/react';
import GroupButton1 from './GroupButton1';

const onClick = jest.fn();
beforeEach(() => jest.clearAllMocks());

describe('<GroupButton1 />', () => {
  it('Should render GroupButton1', () => {
    render(<GroupButton1 content="content" clicked={onClick} disable={true} />);
    const button = screen.getByText('content');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
