import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as tagAPI from '../apis/tag';
import tagSaga, { initialState, tagActions, tagSlice } from './tag';
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
const simpleTagVisuals: tagAPI.TagVisual[] = [{ id: '1', name: 'interesting', color: '#101010' }];

// Requests
const createTagClassRequest: tagAPI.createTagClassRequestType = {
  name: 'new category',
  color: '#101010',
};
const createTagRequest: tagAPI.createTagRequestType = {
  name: 'new category',
  classId: '1',
};
const searchTagRequest: tagAPI.searchTagRequestType = {
  class_name: 'category1',
  tag_name: 'tag1',
};
// Responses
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
const createTagResponse: tagAPI.tagVisualsResponseType = {
  tags: simpleTagVisuals,
};
const searchTagResponse: tagAPI.tagVisualsResponseType = {
  tags: simpleTagVisuals,
};

describe('slices - tags', () => {
  describe('saga success', () => {
    test.each([
      [tagActions.searchTagClear(), initialState],
      [tagActions.clearTagState(), initialState],
    ])('reducer', (action, state) => {
      const store = configureStore({
        reducer: rootReducer,
      });
      store.dispatch(action);
      expect(store.getState().tag).toEqual(state);
    });
    test('getTag', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.getTags), getTagsResponse]])
        .put({ type: 'tag/getTagsSuccess', payload: getTagsResponse })
        .dispatch({ type: 'tag/getTags' })
        .hasFinalState({
          ...initialState,
          tagList: getTagsResponse.tags,
          popularTags: getTagsResponse.popularTags,
        })
        .silentRun();
    });
    test('createTagClass', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.createTagClass, createTagClassRequest), undefined]])
        .put({ type: 'tag/createTagClassSuccess', payload: undefined })
        .dispatch({ type: 'tag/createTagClass', payload: createTagClassRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('createTag', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.createTag, createTagRequest), createTagResponse]])
        .put({ type: 'tag/createTagSuccess', payload: createTagResponse })
        .dispatch({ type: 'tag/createTag', payload: createTagRequest })
        .hasFinalState({ ...initialState, tagCreate: createTagResponse.tags })
        .silentRun();
    });
    test('searchTag', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.searchTag, searchTagRequest), searchTagResponse]])
        .put({ type: 'tag/searchTagSuccess', payload: searchTagResponse })
        .dispatch({ type: 'tag/searchTag', payload: searchTagRequest })
        .hasFinalState({ ...initialState, tagSearch: searchTagResponse.tags })
        .silentRun();
    });
  });

  describe('saga failure', () => {
    global.alert = jest.fn().mockImplementation(() => null);

    test('getTag', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.getTags), throwError(simpleError)]])
        .put({ type: 'tag/getTagsFailure', payload: simpleError })
        .dispatch({ type: 'tag/getTags' })
        .hasFinalState({
          ...initialState,
          error: simpleError,
        })
        .silentRun();
    });
    test('createTagClass', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.createTagClass, createTagClassRequest), throwError(simpleError)]])
        .put({ type: 'tag/createTagClassFailure', payload: simpleError })
        .dispatch({ type: 'tag/createTagClass', payload: createTagClassRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('createTag', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.createTag, createTagRequest), throwError(simpleError)]])
        .put({ type: 'tag/createTagFailure', payload: simpleError })
        .dispatch({ type: 'tag/createTag', payload: createTagRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('searchTag', () => {
      return expectSaga(tagSaga)
        .withReducer(tagSlice.reducer)
        .provide([[call(tagAPI.searchTag, searchTagRequest), throwError(simpleError)]])
        .put({ type: 'tag/searchTagFailure', payload: simpleError })
        .dispatch({ type: 'tag/searchTag', payload: searchTagRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
  });
});
