import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as infoAPI from '../apis/information';
import { throwError } from 'redux-saga-test-plan/providers';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'store';

import { Store } from 'react-notifications-component';
import { simplePosts } from './post.test';
import informationSaga, { infoActions, informationSlice, initialState } from './information';
beforeEach(() => {
  Store.addNotification = jest.fn();
});
afterAll(() => jest.restoreAllMocks());

// Mock objects
const simpleError = new Error('error!');

// Requests
const getInformationRequest: infoAPI.getInformationRequestType = {
  information_name: 'Deadlift',
};

// Responses
const getInformationResponse = {
  basic: {
    name: 'Deadlift',
  },
  posts: simplePosts,
  youtubes: ['1', '2'],
  articles: ['3', '4'],
};

describe('slices - information', () => {
  describe('saga success', () => {
    test.each([[infoActions.initializeInformation(), initialState]])('reducer', action => {
      const store = configureStore({
        reducer: rootReducer,
      });
      store.dispatch(action);
    });
    test('getInformation', () => {
      return expectSaga(informationSaga)
        .withReducer(informationSlice.reducer)
        .provide([[call(infoAPI.getInformation, getInformationRequest), getInformationResponse]])
        .put({ type: 'info/getInformationSuccess', payload: getInformationResponse })
        .dispatch({ type: 'info/getInformation', payload: getInformationRequest })
        .hasFinalState({
          ...initialState,
          contents: getInformationResponse,
        })
        .silentRun();
    });
  });

  describe('saga failure', () => {
    global.alert = jest.fn().mockImplementation(() => null);
    test('getInformation ETC', () => {
      return expectSaga(informationSaga)
        .withReducer(informationSlice.reducer)
        .provide([[call(infoAPI.getInformation, getInformationRequest), throwError(simpleError)]])
        .put({ type: 'info/getInformationFailure', payload: simpleError })
        .dispatch({ type: 'info/getInformation', payload: getInformationRequest })
        .hasFinalState({
          ...initialState,
          error: 'ETC',
        })
        .silentRun();
    });
    test('getInformation NOTFOUND', () => {
      return expectSaga(informationSaga)
        .withReducer(informationSlice.reducer)
        .provide([
          [
            call(infoAPI.getInformation, getInformationRequest),
            throwError({ ...simpleError, response: { status: 404 } } as Error),
          ],
        ])
        .put({ type: 'info/getInformationFailure', payload: { ...simpleError, response: { status: 404 } } as Error })
        .dispatch({ type: 'info/getInformation', payload: getInformationRequest })
        .hasFinalState({
          ...initialState,
          error: 'NOTFOUND',
        })
        .silentRun();
    });
  });
});
