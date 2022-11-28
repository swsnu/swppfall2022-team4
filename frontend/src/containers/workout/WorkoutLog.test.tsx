import { render, screen, fireEvent, getAllByTestId } from '@testing-library/react';
import { Provider } from 'react-redux';

import { MemoryRouter, Route, Routes } from 'react-router';
import WorkoutLog from './WorkoutLog';
import { initialState, getMockStore } from 'test-utils/mock';
import userEvent from '@testing-library/user-event';
import client from 'store/apis/client';

const originalEnv = process.env;

const store = getMockStore(initialState);
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('workout_log', () => {
  let component: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    component = (
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<WorkoutLog />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });

  it('render without errors', () => {
    const view = render(component);
    expect(view).toBeTruthy();
  });

  it('navigate to routine', () => {
    render(component);
    const button = screen.getByText('루틴');
    fireEvent.click(button!);
    expect(mockNavigate).toBeCalledTimes(1);
  });

  it('create workout log', () => {
    render(component);
    const selectType = screen.getAllByTestId('select_type')[0];
    const selectCategory = screen.getAllByTestId('select_category')[0];
    const time_input = screen.getAllByTestId('workout_time')[0];
    fireEvent.change(selectCategory, { target: { value: '등운동' } });
    fireEvent.change(selectType, { target: { value: '데드리프트' } });
    userEvent.type(time_input, '10');
    const button = screen.getAllByText('완료')[1];
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('create workout log(유산소)', () => {
    render(component);
    const selectType = screen.getAllByTestId('select_type')[0];
    const selectCategory = screen.getAllByTestId('select_category')[0];
    const time_input = screen.getAllByTestId('workout_time')[0];
    fireEvent.change(selectCategory, { target: { value: '유산소' } });
    fireEvent.change(selectType, { target: { value: '수영' } });
    userEvent.type(time_input, '10');
    const button = screen.getAllByText('완료')[1];
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('create workout log(운동종류 x)', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    render(component);
    const selectType = screen.getAllByTestId('select_type')[0];
    const selectCategory = screen.getAllByTestId('select_category')[0];
    fireEvent.change(selectCategory, { target: { value: '' } });
    fireEvent.change(selectType, { target: { value: '' } });
    const button = screen.getAllByText('완료')[1];
    fireEvent.click(button!);

    expect(alertMock).toBeCalledWith('운동종류를 입력해주세요.');
  });

  it('create workout log(시간 x)', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    render(component);
    const time_input = screen.getAllByTestId('workout_time')[0];

    userEvent.selectOptions(screen.getAllByTestId('select_category')[0], '등운동');
    expect((screen.getByText('등운동') as HTMLOptionElement).selected).toBeTruthy();

    userEvent.selectOptions(screen.getAllByTestId('select_type')[0], '데드리프트');
    expect((screen.getAllByText('데드리프트')[0] as HTMLOptionElement).selected).toBeTruthy();

    userEvent.type(time_input, '0');
    const button = screen.getAllByText('완료')[1];
    fireEvent.click(button!);

    expect(alertMock).toBeCalledWith('시간을 입력해야 해요.');
  });

  test('image upload', async () => {
    render(component);
    const mockClientGet = jest.fn();
    client.post = mockClientGet.mockImplementation(() => Promise.resolve({ data: { title: 'image' } }));

    const imageUploadBtn = screen.getAllByTestId('FileInput_DailyLog')[0];
    fireEvent.click(imageUploadBtn);

    const blob = new Blob(['hahaha']);
    const file = new File([blob], 'image.jpg');
    const input = screen.getByTestId('dailylog_upload');

    userEvent.upload(input, file);

    const deleteImageBtn = await screen.findByText('삭제');
    expect(deleteImageBtn).toBeInTheDocument();
  });

  test('image upload error', async () => {
    const alertMock = jest.fn();
    global.alert = alertMock.mockImplementation(() => null);
    render(component);
    const mockClientGet = jest.fn();
    client.post = mockClientGet.mockImplementation(() => Promise.reject({}));

    const imageUploadBtn = screen.getAllByTestId('FileInput_DailyLog')[0];
    fireEvent.click(imageUploadBtn);

    const blob = new Blob(['hahaha']);
    const file = new File([blob], 'image.jpg');
    const input = screen.getByTestId('dailylog_upload');

    await userEvent.upload(input, file);
    expect(alertMock).toBeCalledWith('이미지 업로드 오류');
  });

  test('image upload error ENV', async () => {
    process.env = {
      ...originalEnv,
      REACT_APP_API_IMAGE_UPLOAD: undefined,
    };
    const alertMock = jest.fn();
    global.alert = alertMock.mockImplementation(() => null);
    render(component);
    const mockClientGet = jest.fn();
    client.post = mockClientGet.mockImplementation(() => Promise.resolve({ data: { title: 'image' } }));

    const imageUploadBtn = screen.getAllByTestId('FileInput_DailyLog')[0];
    fireEvent.click(imageUploadBtn);

    const blob = new Blob(['hahaha']);
    const file = new File([blob], 'image.jpg');
    const input = screen.getByTestId('dailylog_upload');

    userEvent.upload(input, file);

    const deleteImageBtn = await screen.findByText('삭제');
    expect(deleteImageBtn).toBeInTheDocument();
  });

  it('DayOnClick', () => {
    render(component);
    const button = screen.getAllByTestId('day_component')[0];
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('clickCalendarLeftButton', () => {
    render(component);
    const button = screen.getByText('<');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('clickCalendarRightButton', () => {
    render(component);
    const button = screen.getByText('>');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('addRoutineClick', () => {
    render(component);
    const button = screen.getByText('루틴추가');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('copyDailyLog', () => {
    render(component);
    const button = screen.getByText('내보내기');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('pasteDailyLog', () => {
    render(component);
    const button = screen.getByText('불러오기');
    fireEvent.click(button!);
    expect(mockDispatch).toBeCalledTimes(4);
  });

  it('memoOnClick', () => {
    render(component);
    const button = screen.getByTestId('memo_edit_button');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('memoOnClick_2', () => {
    render(component);
    const button_2 = screen.getByTestId('memo_edit_button');
    fireEvent.click(button_2!);
    const button_1 = screen.getByTestId('memo_cancel_button');
    const button = screen.getByTestId('memo_submit_button');

    const memo_input = screen.getAllByTestId('memo_input')[0];
    userEvent.type(memo_input, 'memo');

    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalled();

    userEvent.type(memo_input, 'memo2');
    fireEvent.click(button_1!);
  });

  it('click day component', () => {
    render(component);
    const day_component = screen.getAllByTestId('day_component')[8];
    fireEvent.click(day_component!);

    const day_component_2 = screen.getAllByTestId('day_component')[35];
    fireEvent.click(day_component_2!);
  });

  it('click month mover', () => {
    render(component);
    const left_button = screen.getAllByTestId('left_button')[0];
    const right_button = screen.getAllByTestId('right_button')[0];

    for (let i = 0; i < 3; i++) {
      fireEvent.click(right_button!);
    }
    for (let i = 0; i < 3; i++) {
      fireEvent.click(left_button!);
    }
    for (let i = 0; i < 24; i++) {
      fireEvent.click(right_button!);
    }
  });
});
