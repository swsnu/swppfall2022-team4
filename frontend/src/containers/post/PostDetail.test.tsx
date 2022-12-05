/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { ReactNotifications, Store } from 'react-notifications-component';
import { Provider } from 'react-redux';
import Router from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { rootReducer } from 'store';
import PostDetail from './PostDetail';
import * as commentAPI from '../../store/apis/comment';
import userEvent from '@testing-library/user-event';
import { simplePosts, simpleUserInfo } from 'store/slices/post.test';
import { notification } from 'utils/sendNotification';

const simpleSearch = {
  search_keyword: 'searchKeyword',
};
export const simpleComments: commentAPI.Comment[] = [
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
    author: simpleUserInfo[1],
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
];

const addNotification = jest.fn();
beforeEach(() => {
  Store.addNotification = addNotification;
});
afterAll(() => jest.restoreAllMocks());

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

const setup = async () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  store.dispatch({
    type: 'user/setUser',
    payload: { username: 'KJY', nickname: 'nickname', image: 'image' },
  });
  // store.dispatch(chatActions.setSocket({ send: (x: any) => console.log(x) }));
  render(
    <Provider store={store}>
      <ReactNotifications />
      <PostDetail />
    </Provider>,
  );
  return store;
};

describe('[PostDetail Page]', () => {
  test('basic rendering my comment', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();
    expect(mockDispatch).toBeCalledTimes(2); // resetPost, updatePostDetail
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/getPostComment' });

    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[0]] },
      });
    });

    const firstComment = screen.getByText('Comment Content');
    expect(firstComment).toBeValid();

    // Edit
    const commentEditBtn = screen.getByText('수정');
    expect(commentEditBtn).not.toBeDisabled();
    fireEvent.click(commentEditBtn);
    expect(commentEditBtn).toBeDisabled();

    expect(mockDispatch).toBeCalledWith({ payload: { comment_id: '1' }, type: 'post/toggleCommentEdit' });
    act(() => {
      store.dispatch({
        type: 'post/toggleCommentEdit',
        payload: { comment_id: '1' },
      });
    });

    const commentEditInput = screen.getByTestId('commentEditInput');
    expect(commentEditInput).toHaveValue('Comment Content');

    // Cancel Comment Edit
    const commentEditCancelBtn = screen.getByText('취소');
    fireEvent.click(commentEditCancelBtn);

    // Re-activate Comment Edit
    fireEvent.click(commentEditBtn);
    userEvent.type(commentEditInput, 'MODIF');

    const commentEditConfirmBtn = screen.getByText('완료');
    fireEvent.click(commentEditConfirmBtn);

    expect(mockDispatch).toBeCalledWith({
      payload: { comment_id: '1', content: 'Comment ContentMODIF' },
      type: 'post/editComment',
    });

    act(() => {
      store.dispatch({
        type: 'post/toggleCommentEdit',
        payload: { comment_id: '1' },
      });
    });

    const commentDeleteBtn = screen.getByText('삭제');
    fireEvent.click(commentDeleteBtn);

    expect(mockDispatch).toBeCalledWith({
      payload: { comment_id: '1' },
      type: 'post/deleteComment',
    });

    const backToMainBtn = screen.getByTestId('backBtn');
    fireEvent.click(backToMainBtn);
    expect(mockNavigate).toBeCalledWith('/post');
  });
  test('useOnclickOutside', async () => {
    // Failed to cover callback function
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    jest.mock('usehooks-ts', () => ({
      ...jest.requireActual('usehooks-ts'),
      useOnClickOutside: (ref: any, callback: any) => callback(),
    }));
    await setup();
  });

  test('basic rendering not my comment', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();

    expect(mockDispatch).toBeCalledTimes(2); // resetPost, updatePostDetail
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/getPostComment' });

    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[1]] },
      });
    });

    const secondComment = screen.getByText('Comment Content2');
    expect(secondComment).toBeValid();

    // Like, Dislike
    const commentFuncLike = screen.getByTestId('commentFuncLike');
    fireEvent.click(commentFuncLike);
    expect(mockDispatch).toBeCalledWith({
      payload: { comment_id: simpleComments[1].comment_id, func_type: 'like' },
      type: 'post/commentFunc',
    });

    const commentFuncDislike = screen.getByTestId('commentFuncDislike');
    fireEvent.click(commentFuncDislike);
    expect(mockDispatch).toBeCalledWith({
      payload: { comment_id: simpleComments[1].comment_id, func_type: 'dislike' },
      type: 'post/commentFunc',
    });

    // Reply Open
    const commentReplyOpenBtn = screen.getByText('답글');
    fireEvent.click(commentReplyOpenBtn);

    expect(mockDispatch).toBeCalledWith({
      payload: { parent_comment: simpleComments[1].comment_id },
      type: 'post/toggleCommentReply',
    });
    act(() => {
      store.dispatch({
        type: 'post/toggleCommentReply',
        payload: { parent_comment: '2' },
      });
    });

    // Reply Input
    const commentReplyInput = screen.getByPlaceholderText('답글 입력');
    userEvent.type(commentReplyInput, 'REPLREPL');

    const commentReplySubmitBtn = screen.getByTestId('commentReplySubmitBtn');
    fireEvent.click(commentReplySubmitBtn);
  });

  test('basic rendering my post - edit, delete', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();

    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[0]] },
      });
    });

    const postCreateBtn = screen.getByText('글 쓰기');
    fireEvent.click(postCreateBtn);
    expect(mockNavigate).toBeCalledWith(`/post/create`);

    const postEditBtn = screen.getByText('글 편집');
    fireEvent.click(postEditBtn);
    expect(mockNavigate).toBeCalledWith(`/post/${simplePosts[0].post_id}/edit`);

    const postDeleteBtn = screen.getByText('글 삭제');
    fireEvent.click(postDeleteBtn);
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/deletePost' });

    act(() => {
      store.dispatch({
        type: 'post/deletePostSuccess',
        payload: { post_id: '1' },
      });
    });

    expect(mockNavigate).toBeCalledWith('/post');
  });

  test('basic rendering not my post', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '2' });
    const store = await setup();

    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[1],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[2]] },
      });
    });

    // Like, Dislike, Scrap
    const postFuncLike = screen.getByTestId('postFuncLike');
    fireEvent.click(postFuncLike);
    expect(mockDispatch).toBeCalledWith({
      payload: { post_id: simplePosts[1].post_id, func_type: 'like' },
      type: 'post/postFunc',
    });

    act(() => {
      store.dispatch({
        type: 'post/postFuncSuccess',
        payload: { type: 'like' },
      });
    });

    expect(addNotification).toBeCalledWith({
      ...notification,
      title: 'Post',
      message: '글 좋아요를 성공했어요!',
      type: 'success',
    });

    const postFuncDislike = screen.getByTestId('postFuncDislike');
    fireEvent.click(postFuncDislike);
    expect(mockDispatch).toBeCalledWith({
      payload: { post_id: simplePosts[1].post_id, func_type: 'dislike' },
      type: 'post/postFunc',
    });

    act(() => {
      store.dispatch({
        type: 'post/postFuncSuccess',
        payload: { type: 'dislike' },
      });
    });

    expect(addNotification).toBeCalledWith({
      ...notification,
      title: 'Post',
      message: '글 싫어요를 성공했어요!',
      type: 'success',
    });

    const postFuncScrap = screen.getByTestId('postFuncScrap');
    fireEvent.click(postFuncScrap);
    expect(mockDispatch).toBeCalledWith({
      payload: { post_id: simplePosts[1].post_id, func_type: 'scrap' },
      type: 'post/postFunc',
    });

    act(() => {
      store.dispatch({
        type: 'post/postFuncSuccess',
        payload: { type: 'scrap' },
      });
    });

    expect(addNotification).toBeCalledWith({
      ...notification,
      title: 'Post',
      message: '글 스크랩을 성공했어요!',
      type: 'success',
    });

    act(() => {
      store.dispatch({
        type: 'post/postFuncSuccess',
        payload: { type: 'ddd' },
      });
    });

    expect(addNotification).toBeCalledWith({
      ...notification,
      title: 'Post',
      message: '글 [알 수 없음]을 성공했어요!',
      type: 'success',
    });

    // Create
    const commentCreateBtn = screen.getByText('작성');
    expect(commentCreateBtn).toBeDisabled();

    const commentInput = screen.getByPlaceholderText('댓글 입력');
    userEvent.type(commentInput, 'NEWCOMM');

    expect(commentCreateBtn).not.toBeDisabled();
    fireEvent.click(commentCreateBtn);

    expect(mockDispatch).toBeCalledWith({
      payload: { content: 'NEWCOMM', author_name: 'KJY', post_id: '2', parent_comment: 'none' },
      type: 'post/createComment',
    });
  });
  test('basic rendering with invalid id', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: undefined });
    const store = await setup();

    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[0]] },
      });
    });

    // Create
    const commentCreateBtn = screen.getByText('작성');
    expect(commentCreateBtn).toBeDisabled();

    const commentInput = screen.getByPlaceholderText('댓글 입력');
    userEvent.type(commentInput, 'NEWCOMM');

    expect(commentCreateBtn).not.toBeDisabled();
    fireEvent.click(commentCreateBtn);

    // PostFunc
    const postFuncLike = screen.getByTestId('postFuncLike');
    fireEvent.click(postFuncLike);

    // PostDelete
    const postDeleteBtn = screen.getByText('글 삭제');
    fireEvent.click(postDeleteBtn);

    // CommentDelete
    const commentDeleteBtn = screen.getByText('삭제');
    fireEvent.click(commentDeleteBtn);
  });

  test('multiple comment', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();

    expect(mockDispatch).toBeCalledTimes(2); // resetPost, updatePostDetail
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/updatePostDetail' });
    expect(mockDispatch).toBeCalledWith({ payload: { post_id: '1' }, type: 'post/getPostComment' });

    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[1], simpleComments[3]] },
      });
    });
  });

  test('search', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();
    act(() => {
      store.dispatch({
        type: 'post/postSearch',
        payload: simpleSearch,
      });
    });

    const searchInput = screen.getByPlaceholderText('Search keyword');
    userEvent.type(searchInput, 'sssss');
    const searchClearBtn = screen.getByText('Clear');
    fireEvent.click(searchClearBtn);
    expect(searchInput).toHaveValue('');
    userEvent.type(searchInput, 'sssss');
    fireEvent.submit(searchInput);
  });

  test('modal test', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();
    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[1], simpleComments[3]] },
      });
    });

    const postAvatar = screen.getByAltText('postAvatar');
    fireEvent.click(postAvatar);

    const postCreateBtn = screen.getByText('글 쓰기');
    fireEvent.click(postCreateBtn);

    const commentAvatar = screen.getByAltText(`commentAvatar${simpleComments[1].comment_id}`);
    fireEvent.click(commentAvatar);
  });
  test('image modal test', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();
    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[0],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[1], simpleComments[3]] },
      });
    });

    const postImage = screen.getByTestId('postImage');
    fireEvent.click(postImage);
  });
  test('socket', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();
    const mockSend = jest.fn();

    act(() => {
      store.dispatch({
        type: 'post/updatePostDetailSuccess',
        payload: simplePosts[1],
      });
      store.dispatch({
        type: 'post/getPostCommentSuccess',
        payload: { comments: [simpleComments[1]] },
      });
      store.dispatch({
        type: 'chat/setSocket',
        payload: { send: mockSend },
      });
    });

    fireEvent.click(screen.getByTestId('postFuncLike'));
    expect(mockSend).toBeCalledTimes(1);
    fireEvent.click(screen.getByTestId('postFuncDislike'));
    expect(mockSend).toBeCalledTimes(2);
    fireEvent.click(screen.getByTestId('postFuncScrap'));
    expect(mockSend).toBeCalledTimes(3);
    fireEvent.click(screen.getByTestId('commentFuncLike'));
    expect(mockSend).toBeCalledTimes(4);
    fireEvent.click(screen.getByTestId('commentFuncDislike'));
    expect(mockSend).toBeCalledTimes(5);

    fireEvent.click(screen.getByText('답글'));
    act(() => {
      store.dispatch({
        type: 'post/toggleCommentReply',
        payload: { parent_comment: '2' },
      });
    });
    userEvent.type(screen.getByPlaceholderText('답글 입력'), 'REPLREPL');
    fireEvent.click(screen.getByTestId('commentReplySubmitBtn'));
    expect(mockSend).toBeCalledTimes(6);
  });

  test('chat navigate', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ post_id: '1' });
    const store = await setup();

    act(() => {
      store.dispatch({
        type: 'chat/createChatroomSuccess',
        payload: { id: 123 },
      });
    });

    expect(mockNavigate).toBeCalledTimes(1);
  });
});
