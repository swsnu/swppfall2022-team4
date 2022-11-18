/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import Mypage from './Mypage';
import { simplePosts, simpleTagVisuals, simpleUserInfo } from 'store/slices/post.test';

const simpleProfile = {
  username: 'username',
  nickname: 'nickname',
  image: 'image',
  gender: 'male',
  height: 180,
  weight: 75,
  age: 23,
  exp: 0,
  level: 1,
  created: '2011-12-11',
  is_follow: false,
  information: {
    post: [
      {
        post_id: '1',
        title: 'First Post',
        author: simpleUserInfo[0],
        content: 'Post Contents',
        created: '2022-11-11',
        updated: '2022-11-12',
        like_num: 1,
        dislike_num: 2,
        scrap_num: 3,
        comments_num: 1,
        tags: simpleTagVisuals,
        prime_tag: simpleTagVisuals[0],
        has_image: false,
        liked: true,
        disliked: true,
        scraped: true,
      },
    ],
    comment: [
      {
        comment_id: '1',
        author: simpleUserInfo[0],
        content: 'Comment Content',
        created: '2022-11-11',
        updated: '2022-11-12',
        like_num: 1,
        dislike_num: 2,
        parent_comment: null,
        replyActive: false,
        editActive: false,
        liked: false,
        disliked: false,
        post_id: '1',
      },
      {
        comment_id: '2',
        author: simpleUserInfo[1],
        content: 'Comment Content2',
        created: '2022-11-12',
        updated: '2022-11-12',
        like_num: 12,
        dislike_num: 1,
        parent_comment: null,
        replyActive: false,
        editActive: false,
        liked: false,
        disliked: false,
        post_id: '1',
      },
      {
        comment_id: '3',
        author: simpleUserInfo[1],
        content: 'Comment Content2',
        created: '2022-11-12',
        updated: '2022-11-12',
        like_num: 12,
        dislike_num: 1,
        parent_comment: null,
        replyActive: false,
        editActive: false,
        liked: false,
        disliked: false,
        post_id: '2',
      },
      {
        comment_id: '4',
        author_name: 'username',
        content: 'Commeent332',
        created: '2022-11-12',
        updated: '2022-11-12',
        like_num: 12,
        dislike_num: 1,
        parent_comment: 2,
        replyActive: false,
        editActive: false,
        liked: true,
        disliked: true,
        post_id: '1',
      },
    ],
    scrap: [simplePosts[0]],
    follower: [{ username: '1', nickname: '2', image: '3' }],
    following: [{ username: '1', nickname: '2', image: '3' }],
  },
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ username: 'username' }),
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const setup = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'username', nickname: 'nickname', image: 'image' },
  });
  render(
    <Provider store={store}>
      <Mypage />
    </Provider>,
  );
  return store;
};

describe('[Mypage Page]', () => {
  describe('useEffect', () => {
    test('init', () => {
      setup();
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith({ payload: 'username', type: 'user/getProfile' });
    });

    test('notfound', () => {
      const mockAlert = jest.spyOn(global, 'alert').mockImplementation(msg => msg);
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'user/getProfileFailure',
          payload: { response: { status: 404, data: { message: 'error' } } },
        });
      });
      expect(mockAlert).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledTimes(1);
    });

    test('chat', () => {
      const store = setup();
      act(() => {
        store.dispatch({
          type: 'chat/createChatroomSuccess',
          payload: { id: 12 },
        });
      });
      expect(mockNavigate).toBeCalledTimes(1);
    });
  });

  test('follow', () => {
    const store = setup();
    const mockSend = jest.fn();
    act(() => {
      store.dispatch({
        type: 'user/setUser',
        payload: { username: 'username2', nickname: 'nickname2', image: 'image2' },
      });
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    fireEvent.click(screen.getByText('Follow'));
    expect(mockSend).toBeCalledTimes(1);

    fireEvent.click(screen.getByText('Chat'));
    expect(mockDispatch).toBeCalledTimes(3);

    fireEvent.click(screen.getByTestId('chatButton'));
    expect(mockDispatch).toBeCalledTimes(4);
  });

  test('get', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
    });

    expect(screen.getByText('nickname')).toBeInTheDocument();
    expect(screen.getByText('username')).toBeInTheDocument();
    expect(screen.getByText('남성')).toBeInTheDocument();
    expect(screen.getByText('180cm')).toBeInTheDocument();
    expect(screen.getByText('75kg')).toBeInTheDocument();
  });

  test('button', () => {
    const store = setup();
    act(() => {
      store.dispatch({
        type: 'user/getProfileSuccess',
        payload: simpleProfile,
      });
    });

    const editButton = screen.getByText('프로필 수정');
    fireEvent.click(editButton);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/edit_profile');

    const editIcon = screen.getByTestId('editProfileIcon');
    fireEvent.click(editIcon);
    expect(mockNavigate).toBeCalledTimes(2);
    expect(mockNavigate).toBeCalledWith('/edit_profile');
  });
});
