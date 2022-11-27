/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'jest-canvas-mock';
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

jest.mock('react-chartjs-2', () => {
  const { forwardRef } = require('react');
  const Line = forwardRef((props: any, ref: any) => <div ref={ref} {...props}></div>);
  const Bar = forwardRef((props: any, ref: any) => <div ref={ref} {...props}></div>);
  return {
    Line,
    Bar,
  };
});

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
  test('main page', () => {
    setup();
    window.scrollTo = jest.fn().mockImplementation(() => true);
    expect(screen.getByText('FITogether')).toBeInTheDocument();
  });
});
