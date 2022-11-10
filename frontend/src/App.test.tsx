import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from 'store';
import App from './App';

jest.mock('components/sections/Header', () => () => <div />);
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

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  return store;
};

describe('App', () => {
  test('login page', () => {
    setup();
    window.scrollTo = jest.fn().mockImplementation(() => true);
    expect(screen.getByText('FITogether')).toBeInTheDocument();
  });
});
