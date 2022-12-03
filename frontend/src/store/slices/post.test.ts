import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as postAPI from '../apis/post';
import * as commentAPI from '../apis/comment';
import * as tagAPI from '../apis/tag';
import postSaga, { initialState, postActions, postSlice } from './post';
import { throwError } from 'redux-saga-test-plan/providers';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'store';

import { Store } from 'react-notifications-component';

beforeEach(() => {
  Store.addNotification = jest.fn();
});
afterAll(() => jest.restoreAllMocks());

// Mock objects
const simpleError = new Error('error!');
export const simpleTagVisuals: tagAPI.TagVisual[] = [{ id: '1', name: 'interesting', color: '#101010' }];
export const simpleUserInfo: postAPI.UserInfo[] = [
  {
    username: 'KJY',
    nickname: 'KimV',
    avatar: 'kimv.jpeg',
    level: 3,
    exp: 99,
  },
  {
    username: 'KJY2',
    nickname: 'KimV2',
    avatar: 'kimv2.jpeg',
    level: 33,
    exp: 99,
  },
];
export const simplePosts: postAPI.Post[] = [
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
    has_image: true,
    images: ['1.png'],
    liked: true,
    disliked: true,
    scraped: true,
  },
  {
    post_id: '2',
    title: 'Second Post',
    author: simpleUserInfo[1],
    content: 'Post Contents2',
    created: '2022-11-11',
    updated: '2022-11-11',
    like_num: 11,
    dislike_num: 21,
    scrap_num: 31,
    comments_num: 11,
    tags: [],
    prime_tag: undefined,
    has_image: false,
    liked: false,
    disliked: false,
    scraped: false,
  },
];
const simplePostID: postAPI.postIdentifyingType = {
  post_id: '59',
};
const simpleImages: string[] = ['test_image1.jpg', 'test_image2.png'];
export const simpleComments: commentAPI.Comment[] = [
  {
    comment_id: '1',
    author: simpleUserInfo[0],
    content: 'GETBYCOMComment Content',
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
    content: 'short',
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
];

// Requests
const getPostsRequest: postAPI.getPostsRequestType = {
  pageNum: 1,
  pageSize: 15,
  searchKeyword: 'search',
  tags: [],
};
const createPostRequest: postAPI.createPostRequestType = {
  title: 'post title',
  content: 'post content',
  author_name: 'KJY',
  tags: simpleTagVisuals,
  images: simpleImages,
  prime_tag: simpleTagVisuals[0],
};
const updatePostDetailRequest: postAPI.postIdentifyingType = simplePostID;
const deletePostRequest: postAPI.postIdentifyingType = simplePostID;
const editPostRequest: postAPI.editPostRequestType = {
  post_id: '1',
  title: 'title modified',
  content: 'content modified',
  tags: simpleTagVisuals,
  images: simpleImages,
  prime_tag: simpleTagVisuals[0],
};
const getPostCommentRequest: postAPI.postIdentifyingType = simplePostID;
const postSearchRequest: postAPI.postSearchRequestType = {
  search_keyword: 'searching',
};
const createCommentReplyRequest: commentAPI.createCommentReplyType = {
  parent_comment: '1',
};
const editCommentRequest: commentAPI.editCommentRequestType = {
  comment_id: '2',
  content: 'modified comment',
};
const postFuncRequest: postAPI.postFuncRequestType = {
  post_id: '1',
  func_type: 'like',
};
const commentFuncRequest: commentAPI.commentFuncRequestType = {
  comment_id: '1',
  func_type: 'like',
};
const createCommentRequest: commentAPI.createCommentRequestType = {
  content: 'new comment',
  author_name: 'KJY',
  post_id: '2',
  parent_comment: '1',
};
const deleteCommentRequest: commentAPI.commentIdentifyingRequestType = {
  comment_id: '1',
};

// Responses
const getPostsResponse: postAPI.getPostsResponseType = {
  posts: simplePosts,
  page: 2,
  page_size: 15,
  page_total: 7,
};
const getPostsEmptyResponse: postAPI.getPostsResponseType = {
  posts: [],
  page: 2,
  page_size: 15,
  page_total: 7,
};
const getRecentCommentsResponse = {
  comments: simpleComments,
};
const createPostResponse: postAPI.postIdentifyingType = simplePostID;
const updatePostDetailResponse: postAPI.Post = simplePosts[0];
const getPostCommentResponse: commentAPI.getPostCommentResponseType = {
  comments: simpleComments,
};

describe('slices - posts', () => {
  describe('saga success', () => {
    test.each([
      [
        postActions.postSearch(postSearchRequest),
        {
          ...initialState,
          postSearch: postSearchRequest.search_keyword,
        },
      ],
      [postActions.getPostsMain(), initialState],
      [postActions.getPostsMainFailure('error'), initialState],
      [postActions.stateRefresh(), initialState],
      [postActions.toggleCommentReply(createCommentReplyRequest), initialState],
      [postActions.toggleCommentEdit(editCommentRequest), initialState],
      [postActions.resetPost(), initialState],
      [postActions.getGroupPosts({ group_id: '1' }), initialState],
      [
        postActions.getGroupPostsSuccess({ posts: 'data' }),
        { ...initialState, postList: { ...initialState.postList, posts: 'data' } },
      ],
      [
        postActions.getGroupPostsFailure('error'),
        { ...initialState, postList: { ...initialState.postList, error: 'error' } },
      ],
    ])('reducer', (action, state) => {
      const store = configureStore({
        reducer: rootReducer,
      });
      store.dispatch(action);
      expect(store.getState().post).toEqual(state);
    });
    test('comment Reply & Edit', () => {
      const store = configureStore({
        reducer: rootReducer,
      });
      store.dispatch(postActions.getPostCommentSuccess(getPostCommentResponse));
      store.dispatch(postActions.toggleCommentReply(createCommentRequest));
      store.dispatch(postActions.toggleCommentEdit(editCommentRequest));
      expect(store.getState().post.postComment.comments).toEqual([
        { ...simpleComments[0], replyActive: true },
        { ...simpleComments[1], editActive: true },
      ]);
      store.dispatch(postActions.toggleCommentReply(createCommentRequest));
      store.dispatch(postActions.toggleCommentEdit(editCommentRequest));
      expect(store.getState().post.postComment.comments).toEqual([
        { ...simpleComments[0], replyActive: false },
        { ...simpleComments[1], editActive: false },
      ]);
    });
    test('toggle, remove, clear tags', () => {
      const store = configureStore({
        reducer: rootReducer,
      });
      store.dispatch(postActions.toggleFilterTag(simpleTagVisuals[0]));
      expect(store.getState().post.filterTag).toEqual(simpleTagVisuals);
      store.dispatch(postActions.toggleFilterTag(simpleTagVisuals[0]));
      expect(store.getState().post.filterTag).toEqual([]);
      store.dispatch(postActions.removeFilterTag(simpleTagVisuals[0].id));
      expect(store.getState().post.filterTag).toEqual([]);
      store.dispatch(postActions.toggleFilterTag(simpleTagVisuals[0]));
      store.dispatch(postActions.clearFilterTag());
      expect(store.getState().post.filterTag).toEqual([]);
    });
    test('search - getPosts empty', () => {
      const store = configureStore({
        reducer: rootReducer,
      });
      store.dispatch(postActions.postSearch({ search_keyword: 'key' }));
      store.dispatch(postActions.getPostsSuccess(getPostsEmptyResponse));
    });
    test('getPostsMain', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.getPostsMain), getPostsResponse]])
        .put({ type: 'post/getPostsMainSuccess', payload: getPostsResponse })
        .dispatch({ type: 'post/getPostsMain' })
        .hasFinalState({
          ...initialState,
          main: getPostsResponse.posts,
        })
        .silentRun();
    });
    test('getGroupPosts', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.getGroupPosts, { group_id: '1' }), { posts: 'data' }]])
        .put({ type: 'post/getGroupPostsSuccess', payload: { posts: 'data' } })
        .dispatch({ type: 'post/getGroupPosts', payload: { group_id: '1' } })
        .hasFinalState({
          ...initialState,
          postList: {
            ...initialState.postList,
            posts: 'data',
          },
        })
        .silentRun();
    });
    test('getPosts', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.getPosts, getPostsRequest), getPostsResponse]])
        .put({ type: 'post/getPostsSuccess', payload: getPostsResponse })
        .dispatch({ type: 'post/getPosts', payload: getPostsRequest })
        .hasFinalState({
          ...initialState,
          postList: {
            posts: getPostsResponse.posts,
            pageNum: getPostsResponse.page,
            pageSize: getPostsResponse.page_size,
            pageTotal: getPostsResponse.page_total,
            error: null,
          },
        })
        .silentRun();
    });
    test('getRecentComments', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.getRecentComments), getRecentCommentsResponse]])
        .put({ type: 'post/getRecentCommentsSuccess', payload: getRecentCommentsResponse })
        .dispatch({ type: 'post/getRecentComments' })
        .hasFinalState({
          ...initialState,
          recentComments: {
            comments: getRecentCommentsResponse.comments,
          },
        })
        .silentRun();
    });
    test('createPost', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.createPost, createPostRequest), createPostResponse]])
        .put({ type: 'post/createPostSuccess', payload: createPostResponse })
        .dispatch({ type: 'post/createPost', payload: createPostRequest })
        .hasFinalState({
          ...initialState,
          postCreate: {
            post_id: createPostResponse.post_id,
            status: true,
          },
        })
        .silentRun();
    });
    test('updatePostDetail', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.updatePostDetail, updatePostDetailRequest), updatePostDetailResponse]])
        .put({ type: 'post/updatePostDetailSuccess', payload: updatePostDetailResponse })
        .dispatch({ type: 'post/updatePostDetail', payload: updatePostDetailRequest })
        .hasFinalState({
          ...initialState,
          postDetail: {
            post: updatePostDetailResponse,
            error: null,
          },
        })
        .silentRun();
    });
    test('deletePost', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.deletePost, deletePostRequest), undefined]])
        .put({ type: 'post/deletePostSuccess', payload: undefined })
        .dispatch({ type: 'post/deletePost', payload: deletePostRequest })
        .hasFinalState({
          ...initialState,
          postDelete: true,
        })
        .silentRun();
    });
    test('editPost', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.editPost, editPostRequest), undefined]])
        .put({ type: 'post/editPostSuccess', payload: undefined })
        .dispatch({ type: 'post/editPost', payload: editPostRequest })
        .hasFinalState({
          ...initialState,
          postEdit: true,
        })
        .silentRun();
    });
    test('getPostComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.getPostComment, getPostCommentRequest), getPostCommentResponse]])
        .put({ type: 'post/getPostCommentSuccess', payload: getPostCommentResponse })
        .dispatch({ type: 'post/getPostComment', payload: getPostCommentRequest })
        .hasFinalState({
          ...initialState,
          postComment: {
            comments: getPostCommentResponse.comments,
            error: null,
            commentFunc: false,
          },
        })
        .silentRun();
    });
    test('postFunc', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.postFunc, postFuncRequest), { type: 'like' }]])
        .put({ type: 'post/postFuncSuccess', payload: { type: 'like' } })
        .dispatch({ type: 'post/postFunc', payload: postFuncRequest })
        .hasFinalState({
          ...initialState,
          postFunc: true,
        })
        .silentRun();
    });
    test('commentFunc', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.commentFunc, commentFuncRequest), { type: 'like' }]])
        .put({ type: 'post/commentFuncSuccess', payload: { type: 'like' } })
        .dispatch({ type: 'post/commentFunc', payload: commentFuncRequest })
        .hasFinalState({
          ...initialState,
          postComment: {
            ...initialState.postComment,
            commentFunc: true,
          },
        })
        .silentRun();
    });
    test('createComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.createComment, createCommentRequest), undefined]])
        .put({ type: 'post/createCommentSuccess', payload: undefined })
        .dispatch({ type: 'post/createComment', payload: createCommentRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('editComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.editComment, editCommentRequest), undefined]])
        .put({ type: 'post/editCommentSuccess', payload: undefined })
        .dispatch({ type: 'post/editComment', payload: editCommentRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('deleteComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.deleteComment, deleteCommentRequest), undefined]])
        .put({ type: 'post/deleteCommentSuccess', payload: undefined })
        .dispatch({ type: 'post/deleteComment', payload: deleteCommentRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
  });

  describe('saga failure', () => {
    global.alert = jest.fn().mockImplementation(() => null);

    test('getPostsMain', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.getPostsMain), throwError(simpleError)]])
        .put({ type: 'post/getPostsMainFailure', payload: simpleError })
        .dispatch({ type: 'post/getPostsMain' })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('getGroupPosts', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.getGroupPosts, { group_id: '1' }), throwError(simpleError)]])
        .put({ type: 'post/getGroupPostsFailure', payload: simpleError })
        .dispatch({ type: 'post/getGroupPosts', payload: { group_id: '1' } })
        .hasFinalState({
          ...initialState,
          postList: {
            posts: null,
            pageNum: null,
            pageSize: null,
            pageTotal: null,
            error: simpleError,
          },
        })
        .silentRun();
    });
    test('getPosts', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.getPosts, getPostsRequest), throwError(simpleError)]])
        .put({ type: 'post/getPostsFailure', payload: simpleError })
        .dispatch({ type: 'post/getPosts', payload: getPostsRequest })
        .hasFinalState({
          ...initialState,
          postList: {
            posts: null,
            pageNum: null,
            pageSize: null,
            pageTotal: null,
            error: simpleError,
          },
        })
        .silentRun();
    });
    test('getRecentComments', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.getRecentComments), throwError(simpleError)]])
        .put({ type: 'post/getRecentCommentsFailure', payload: simpleError })
        .dispatch({ type: 'post/getRecentComments' })
        .hasFinalState({
          ...initialState,
        })
        .silentRun();
    });
    test('createPost', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.createPost, createPostRequest), throwError(simpleError)]])
        .put({ type: 'post/createPostFailure', payload: simpleError })
        .dispatch({ type: 'post/createPost', payload: createPostRequest })
        .hasFinalState({
          ...initialState,
          postCreate: {
            post_id: null,
            status: false,
          },
        })
        .silentRun();
    });
    test('updatePostDetail', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.updatePostDetail, updatePostDetailRequest), throwError(simpleError)]])
        .put({ type: 'post/updatePostDetailFailure', payload: simpleError })
        .dispatch({ type: 'post/updatePostDetail', payload: updatePostDetailRequest })
        .hasFinalState({
          ...initialState,
          postDetail: {
            post: null,
            error: simpleError,
          },
        })
        .silentRun();
    });
    test('deletePost', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.deletePost, deletePostRequest), throwError(simpleError)]])
        .put({ type: 'post/deletePostFailure', payload: simpleError })
        .dispatch({ type: 'post/deletePost', payload: deletePostRequest })
        .hasFinalState({
          ...initialState,
          postDelete: false,
        })
        .silentRun();
    });
    test('editPost', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.editPost, editPostRequest), throwError(simpleError)]])
        .put({ type: 'post/editPostFailure', payload: simpleError })
        .dispatch({ type: 'post/editPost', payload: editPostRequest })
        .hasFinalState({
          ...initialState,
          postEdit: false,
        })
        .silentRun();
    });
    test('getPostComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.getPostComment, getPostCommentRequest), throwError(simpleError)]])
        .put({ type: 'post/getPostCommentFailure', payload: simpleError })
        .dispatch({ type: 'post/getPostComment', payload: getPostCommentRequest })
        .hasFinalState({
          ...initialState,
          postComment: {
            comments: null,
            error: simpleError,
            commentFunc: false,
          },
        })
        .silentRun();
    });
    test('postFunc', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.postFunc, postFuncRequest), throwError(simpleError)]])
        .put({ type: 'post/postFuncFailure', payload: simpleError })
        .dispatch({ type: 'post/postFunc', payload: postFuncRequest })
        .hasFinalState({
          ...initialState,
          postFunc: false,
        })
        .silentRun();
    });
    test('createComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.createComment, createCommentRequest), throwError(simpleError)]])
        .put({ type: 'post/createCommentFailure', payload: simpleError })
        .dispatch({ type: 'post/createComment', payload: createCommentRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('editComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.editComment, editCommentRequest), throwError(simpleError)]])
        .put({ type: 'post/editCommentFailure', payload: simpleError })
        .dispatch({ type: 'post/editComment', payload: editCommentRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('deleteComment', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.deleteComment, deleteCommentRequest), throwError(simpleError)]])
        .put({ type: 'post/deleteCommentFailure', payload: simpleError })
        .dispatch({ type: 'post/deleteComment', payload: deleteCommentRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('commentFunc', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(commentAPI.commentFunc, commentFuncRequest), throwError(simpleError)]])
        .put({ type: 'post/commentFuncFailure', payload: simpleError })
        .dispatch({ type: 'post/commentFunc', payload: commentFuncRequest })
        .hasFinalState({
          ...initialState,
          postComment: {
            ...initialState.postComment,
            commentFunc: true,
          },
        })
        .silentRun();
    });
  });
});
