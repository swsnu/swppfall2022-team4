/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import { KakaoLoginCallback } from './SocialLoginCallback';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    hash: '',
    key: 'default',
    pathname: '/oauth/kakao/',
    search: '?code=CODECODE',
    state: null,
  }),
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  render(
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <Provider store={store}>
              <KakaoLoginCallback />
            </Provider>
          }
        />
      </Routes>
    </BrowserRouter>,
  );
  return store;
};

describe('[SocialLoginCallback Page]', () => {
  //   describe('useEffect', () => {
  //     test('signup success', () => {
  //       const store = setup();
  //       act(() => {
  //         store.dispatch({
  //           type: 'user/setUser',
  //           payload: { username: 'username', nickname: 'nickname', image: 'image' },
  //         });
  //       });
  //       expect(mockNavigate).toBeCalledTimes(1);
  //       expect(mockNavigate).toBeCalledWith('/');
  //     });
  //   });

  test('signup', () => {
    const mockAlert = jest.spyOn(global, 'alert').mockImplementation(msg => msg);
    setup();

    // const usernameInput = screen.getByPlaceholderText('ID');
    // const passwordInput = screen.getByPlaceholderText('Password');
    // const passwordConfirmInput = screen.getByPlaceholderText('Password Confirm');
    // const nicknameInput = screen.getByPlaceholderText('Nickname');
    // const maleCheckbox = screen.getByTestId('maleCheckbox');
    // const heightInput = screen.getByPlaceholderText('Height');
    // const weightInput = screen.getByPlaceholderText('Weight');
    // const ageInput = screen.getByPlaceholderText('Age');
    // const signupButton = screen.getByText('Sign up');

    // fireEvent.click(signupButton);
    // expect(mockAlert).toBeCalledTimes(1);

    // fireEvent.change(usernameInput, { target: { value: 'aaaaaaaa' } });
    // fireEvent.click(signupButton);
    // expect(mockAlert).toBeCalledTimes(2);

    // fireEvent.change(passwordInput, { target: { value: 'aaaaaaaa' } });
    // fireEvent.change(passwordConfirmInput, { target: { value: 'aaaaaaaa' } });
    // fireEvent.click(signupButton);
    // expect(mockAlert).toBeCalledTimes(3);

    // fireEvent.change(nicknameInput, { target: { value: 'aaaaaaaa' } });
    // fireEvent.click(signupButton);
    // expect(mockAlert).toBeCalledTimes(4);

    // fireEvent.click(maleCheckbox);
    // fireEvent.click(signupButton);
    // expect(mockAlert).toBeCalledTimes(5);

    // fireEvent.change(heightInput, { target: { value: 123 } });
    // fireEvent.change(weightInput, { target: { value: 123 } });
    // fireEvent.change(ageInput, { target: { value: 23 } });
    // fireEvent.click(signupButton);
    // expect(mockDispatch).toBeCalledTimes(1);
  });

  //   test('back to login', () => {
  //     setup();
  //     fireEvent.click(screen.getByText('Back to Login'));
  //     expect(mockNavigate).toBeCalledTimes(1);
  //   });
});
