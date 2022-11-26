/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from 'store';
import InformationLobby from './InformationLobby';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { simplePosts, simpleTagVisuals } from 'store/slices/post.test';
import * as tagAPI from '../../store/apis/tag';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const getTagsResponse: tagAPI.getTagListResponseType = {
  tags: [
    {
      id: 1,
      class_name: 'workout',
      class_type: 'workout',
      color: '#101010',
      tags: simpleTagVisuals,
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
const getInformationResponse = {
  basic: {
    name: 'Deadlift',
  },
  posts: simplePosts,
  youtubes: ['1', '2'],
  articles: ['3', '4'],
};

const setup = () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <InformationLobby />
    </Provider>,
  );
  return store;
};

describe('[InformationLobby Page]', () => {
  test('basic rendering', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'info/getInformationSuccess',
        payload: getInformationResponse,
      });
      store.dispatch({
        type: 'tag/getTagsSuccess',
        payload: getTagsResponse,
      });
    });

    const searchInput = screen.getByPlaceholderText('Search keyword');
    userEvent.type(searchInput, 'Deadlift');
    fireEvent.submit(searchInput);
    const searchClearBtn = screen.getByText('Clear');
    fireEvent.click(searchClearBtn);
    expect(searchInput).toHaveValue('');
    userEvent.type(searchInput, 'sssss');
    fireEvent.submit(searchInput);

    const tagBubble = screen.getByText('interesting');
    fireEvent.click(tagBubble);
    expect(mockNavigate).toBeCalledWith(`/information/interesting`);
  });
});
