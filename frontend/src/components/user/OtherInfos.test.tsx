import { render, screen, fireEvent } from '@testing-library/react';
import OtherInfos from './OtherInfos';

const onChanged = jest.fn();
const mockStateDispatch = jest.fn();
beforeEach(() => jest.clearAllMocks());

const setup = (gender: string) => {
  render(
    <OtherInfos
      nickname="nickname"
      gender={gender}
      height="180"
      weight="80"
      age="20"
      nicknameWarning={{ color: '#000000', content: 'warning' }}
      bodyWarning={{ color: '#000000', content: 'warning' }}
      changed={onChanged}
      stateDispatch={mockStateDispatch}
    />,
  );
};

describe('OtherInfos', () => {
  test('gender is empty', () => {
    setup('');
    const input = screen.getByPlaceholderText('Nickname');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'change' } });
    expect(onChanged).toHaveBeenCalledTimes(1);

    const maleCheckbox = screen.getByTestId('maleCheckbox');
    const femaleCheckbox = screen.getByTestId('femaleCheckbox');
    fireEvent.click(maleCheckbox);
    expect(mockStateDispatch).toHaveBeenCalledTimes(1);
    fireEvent.click(femaleCheckbox);
    expect(mockStateDispatch).toHaveBeenCalledTimes(2);
  });

  test('male', () => {
    setup('male');
    expect(screen.getByTestId('maleCheck2box')).toBeInTheDocument();
  });

  test('female', () => {
    setup('female');
    expect(screen.getByTestId('femaleCheck2box')).toBeInTheDocument();
  });
});
