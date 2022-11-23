/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import TagDetailModal from './TagDetailModal';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'store';
import { Provider } from 'react-redux';
import { getTagListResponseType } from 'store/apis/tag';
import { act } from 'react-dom/test-utils';

jest.mock('react-transition-group', () => ({
  ...jest.requireActual('react-transition-group'),
  CSSTransition: (elem: any) => {
    // eslint-disable-next-line testing-library/no-node-access
    return <div>{elem.children.props.children}</div>;
  },
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const getTagsResponse: getTagListResponseType = {
  tags: [
    {
      id: 1,
      class_name: 'workout',
      class_type: 'workout',
      color: '#101010',
      tags: [
        { id: '1', name: 'tag1', color: '#101010' },
        { id: '2', name: 'tag2', color: '#101011' },
      ],
    },
  ],
  popularTags: [
    {
      id: '1',
      name: '1',
      color: '#111111',
    },
  ],
};

const mockDispatch = jest.fn();
const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <TagDetailModal
        isActive={false}
        onClose={jest.fn()}
        modalRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
        modalAnimRef={1 as unknown as React.MutableRefObject<null>}
        dispatch={mockDispatch}
      />
    </Provider>,
  );
  return store;
};

describe('[TagDetailModal Component]', () => {
  test('basic rendering', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });

    const tagBubble1 = screen.getByText('tag1');
    fireEvent.click(tagBubble1); // Filtering On
    fireEvent.click(tagBubble1); // Filtering Off
    // Close
    const closeBtn = screen.getByTestId('tagModalCloseBtn');
    fireEvent.click(closeBtn);
  });

  test('calories', () => {
    setup();

    const caloriesMode = screen.getByText('모드 전환');
    fireEvent.click(caloriesMode);
  });

  test('selected', () => {
    const store = configureStore({ reducer: rootReducer });
    store.dispatch({
      type: 'user/setUser',
      payload: { username: 'username', nickname: 'nickname', image: 'image' },
    });
    render(
      <Provider store={store}>
        <TagDetailModal
          isActive={false}
          onClose={jest.fn()}
          modalRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
          modalAnimRef={1 as unknown as React.MutableRefObject<null>}
          dispatch={mockDispatch}
        />
      </Provider>,
    );
  });
});
