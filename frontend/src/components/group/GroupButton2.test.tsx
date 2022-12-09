import { render, screen, fireEvent } from '@testing-library/react';
import GroupButton2 from './GroupButton2';

const onClick = jest.fn();
beforeEach(() => jest.clearAllMocks());

describe('<GroupButton2 />', () => {
  it('Should render GroupButton2', () => {
    render(<GroupButton2 content="content" clicked={onClick} end={true} />);
    const button = screen.getByText('content');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
