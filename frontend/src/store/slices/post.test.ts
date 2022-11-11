import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as postAPI from '../apis/post';
import * as commentAPI from '../apis/comment';
import * as tagAPI from '../apis/tag';
import postSaga, { initialState, postSlice } from './post';
import { throwError } from 'redux-saga-test-plan/providers';

// Mock objects
const simpleError = new Error('error!');
const simpleTagVisuals: tagAPI.TagVisual[] = [{ id: '1', name: 'interesting', color: '#101010' }];
const simplePosts: postAPI.Post[] = [
  {
    id: '1',
    title: 'First Post',
    author_name: 'KJY',
    content: 'Post Contents',
    created: '2022-11-11',
    updated: '2022-11-12',
    like_num: 1,
    dislike_num: 2,
    scrap_num: 3,
    comments_num: 1,
    tags: simpleTagVisuals,
    prime_tag: simpleTagVisuals[0],
    liked: false,
    disliked: true,
    scraped: false,
  },
  {
    id: '2',
    title: 'Second Post',
    author_name: 'KJY2',
    content: 'Post Contents2',
    created: '2022-11-11',
    updated: '2022-11-11',
    like_num: 11,
    dislike_num: 21,
    scrap_num: 31,
    comments_num: 11,
    tags: [],
    prime_tag: undefined,
    liked: false,
    disliked: true,
    scraped: false,
  },
];
const simplePostID: postAPI.postIdentifyingType = {
  post_id: '59',
};
const simpleComments: commentAPI.Comment[] = [
  {
    id: '1',
    author_name: 'KJY',
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
];

// Requests
const getPostsRequest: postAPI.getPostsRequestType = {
  pageNum: 1,
  pageSize: 15,
  searchKeyword: '',
};
const createPostRequest: postAPI.createPostRequestType = {
  title: 'post title',
  content: 'post content',
  author_name: 'KJY',
  tags: simpleTagVisuals,
  prime_tag: simpleTagVisuals[0],
};
const updatePostDetailRequest: postAPI.postIdentifyingType = simplePostID;
const deletePostRequest: postAPI.postIdentifyingType = simplePostID;
const editPostRequest: postAPI.editPostRequestType = {
  post_id: '1',
  title: 'title modified',
  content: 'content modified',
  tags: simpleTagVisuals,
  prime_tag: simpleTagVisuals[0],
};
const getPostCommentRequest: postAPI.postIdentifyingType = simplePostID;

// Responses
const getPostsResponse: postAPI.getPostsResponseType = {
  posts: simplePosts,
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
  });

  describe('saga failure', () => {
    global.alert = jest.fn().mockImplementation(() => null);

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
  });
});
