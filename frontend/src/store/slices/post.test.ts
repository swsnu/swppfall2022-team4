import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as postAPI from '../apis/post';
import * as commentAPI from '../apis/comment';
import * as tagAPI from '../apis/tag';
import postSaga, { initialState, postSlice } from './post';

// Mock objects
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
const getPostDetailRequest: postAPI.postIdentifyingType = simplePostID;

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
    test('getPostDetail', () => {
      return expectSaga(postSaga)
        .withReducer(postSlice.reducer)
        .provide([[call(postAPI.getPostDetail, getPostDetailRequest), createPostResponse]])
        .put({ type: 'post/getPostDetailSuccess', payload: createPostResponse })
        .dispatch({ type: 'post/getPostDetail', payload: getPostDetailRequest })
        .hasFinalState({
          ...initialState,
          postCreate: {
            post_id: createPostResponse.post_id,
            status: true,
          },
        })
        .silentRun();
    });
  });

  // TODO: SAGA failure
});
