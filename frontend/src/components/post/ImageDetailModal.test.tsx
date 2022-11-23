/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import ImageDetailModal from './ImageDetailModal';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'store';
import { Provider } from 'react-redux';

jest.mock('react-transition-group', () => ({
  ...jest.requireActual('react-transition-group'),
  CSSTransition: (elem: any) => {
    // eslint-disable-next-line testing-library/no-node-access
    return <div>{elem.children.props.children}</div>;
  },
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <ImageDetailModal
        isActive={false}
        onClose={jest.fn()}
        modalRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
        modalAnimRef={1 as unknown as React.MutableRefObject<null>}
        activeImage={'Hi.jpg'}
      />
    </Provider>,
  );
  return store;
};

describe('[ImageDetailModal Component]', () => {
  test('basic rendering', () => {
    setup();

    const closeBtn = screen.getByTestId('tagModalCloseBtn');
    fireEvent.click(closeBtn);
  });
});
