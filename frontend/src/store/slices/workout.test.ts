import { configureStore } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as workoutAPI from '../apis/workout';
import workoutLogSaga, { initialState, workoutLogSlice, workoutLogActions } from './workout';

afterAll(() => jest.restoreAllMocks());
const simpleError = new Error('error!');
const getFitElementRequest: workoutAPI.getFitElementRequestType = {
  fitelement_id: 0,
};

const getFitElementResponse: workoutAPI.getFitElementResponseType = {
  type: 'test',
  id: 0,
  workout_type: 'test',
  period: 0,
  category: 'category',
  weight: 0,
  rep: 0,
  set: 0,
  time: 0,
  date: null,
};

const createWorkoutLogRequest: workoutAPI.createWorkoutLogRequestType = {
  username: 'user',
  type: 'log',
  workout_type: '데드리프트',
  period: 0,
  category: 'back',
  weight: 0,
  rep: 0,
  set: 0,
  time: 20,
  date: '2022-10-01',
};

const createWorkoutLogResponse: workoutAPI.createWorkoutLogResponseType = {
  workout_id: '0',
};

const getFitElementsRequest: workoutAPI.getFitElementsRequestType = {
  fitelements: [0],
};

const getDailyLogRequest: workoutAPI.getDailyLogRequestType = {
  year: 2022,
  month: 10,
  specific_date: 1,
  username: 'user',
  data: {
    username: 'user',
  },
};

// eslint-disable-next-line no-unused-vars
const getDailyLogResponse: workoutAPI.getDailyLogResponseType = {
  author: 0,
  date: '2022-10-01',
  memo: 'memo',
  calories: 0,
  images: [],
  fitelements: [],
  fit_elements: [
    {
      type: 'log',
      workout_type: 'type',
      period: 0,
      category: '',
      weight: 0,
      rep: 0,
      set: 0,
      time: 0,
      date: null,
    },
  ],
};

const createDailyLogRequest: workoutAPI.createDailyLogRequestType = {
  username: 'user',
  date: '2022-10-01',
  memo: 'memo',
  fitelements: [],
  year: 2022,
  month: 10,
  specific_date: 1,
};

const createDailyLogResponse: workoutAPI.createDailyLogResponseType = {
  dailylog_date: '2022-10-01',
};

const editMemoRequest: workoutAPI.editMemoRequestType = {
  username: 'user',
  memo: 'memo',
  year: 2022,
  month: 10,
  specific_date: 1,
};

const editImageRequest: workoutAPI.editImageRequestType = {
  username: 'user',
  image: 'profile-default.png',
  year: 2022,
  month: 10,
  specific_date: 1,
};

const editIndexRequest: workoutAPI.editIndexRequestType = {
  username: 'user',
  log_index: [1],
  year: 2022,
  month: 10,
  specific_date: 1,
};

const deleteImageRequest: workoutAPI.deleteImageRequestType = {
  username: 'user',
  image: 'profile-default.png',
  year: 2022,
  month: 10,
  specific_date: 1,
  delete: true,
};

const getCalendarInfoRequest: workoutAPI.getCalendarInfoRequestType = {
  username: 'user',
  year: 2022,
  month: 10,
};

const getRoutineRequest: workoutAPI.getRoutineRequestType = {
  username: 'user',
};

const getSpecificRoutineRequest: workoutAPI.getSpecificRoutineRequestType = {
  username: 'user',
  routine_id: 0,
};

// eslint-disable-next-line no-unused-vars
const addFitElementsRequest: workoutAPI.addFitElementsRequestType = {
  // paste
  username: 'user',
  fitelements: [0],
  year: 2022,
  month: 10,
  specific_date: 2,
};

// eslint-disable-next-line no-unused-vars
const addFitElementsResponse: workoutAPI.addFitElementsResponseType = {
  fitelements: [0],
};

const createRoutineWithFitElementsRequest: workoutAPI.createRoutineWithFitElementsRequestType = {
  username: 'user',
  fitelements: [],
};

describe('slices - workout', () => {
  jest.spyOn(console, 'warn').mockImplementation();
  describe('saga success', () => {
    test.each([
      [workoutLogActions.editMemo(editMemoRequest), initialState],
      [workoutLogActions.editImage(editImageRequest), initialState],
      [workoutLogActions.getSpecificRoutine(getSpecificRoutineRequest), initialState],
      [workoutLogActions.createRoutineWithFitElements(createRoutineWithFitElementsRequest), initialState],
    ])('reducer', (action, state) => {
      const store = configureStore({
        reducer: rootReducer,
      });
      store.dispatch(action);
      expect(store.getState().workout_log).toEqual(state);
    });
    test('getFitElement', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getFitElement, getFitElementRequest), getFitElementResponse]])
        .put({ type: 'workoutlog/getFitElementSuccess', payload: getFitElementResponse })
        .dispatch({ type: 'workoutlog/getFitElement', payload: getFitElementRequest })
        .hasFinalState({
          ...initialState,
          dailyLogCreate: { dailylog_date: null, status: false },
        })
        .run();
    });
    test('createWorkoutLog', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.createWorkoutLog, createWorkoutLogRequest), createWorkoutLogResponse]])
        .put({ type: 'workoutlog/createWorkoutLogSuccess', payload: createWorkoutLogResponse })
        .dispatch({ type: 'workoutlog/createWorkoutLog', payload: createWorkoutLogRequest })
        .hasFinalState({
          ...initialState,
          workoutCreate: {
            workout_id: '0',
            status: true,
          },
        })
        .run();
    });
    test('addFitElements', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.addFitElements, addFitElementsRequest), addFitElementsResponse]])
        .put({ type: 'workoutlog/addFitElementsSuccess', payload: addFitElementsResponse })
        .dispatch({ type: 'workoutlog/addFitElements', payload: addFitElementsRequest })
        .hasFinalState({
          ...initialState,
          add_fit_elements: {
            fitelements: [],
            status: false,
          },
        })
        .run();
    });
    test('getDailyLog', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getDailyLog, getDailyLogRequest), getDailyLogResponse]])
        .put({ type: 'workoutlog/getDailyLogSuccess', payload: getDailyLogResponse })
        .put({ type: 'workoutlog/getFitElements', payload: getDailyLogResponse })
        .dispatch({ type: 'workoutlog/getDailyLog', payload: getDailyLogRequest })
        .hasFinalState({
          ...initialState,
          daily_log: {
            isDailyLog: true,
            date: '2022-10-01',
            memo: 'memo',
            fit_element: [],
            calories: 0,
            images: [],
          },
        })
        .silentRun();
    });
    test('getDailyLog_false', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getDailyLog, getDailyLogRequest), { ...getDailyLogResponse, author: -1 }]])
        .put({ type: 'workoutlog/getDailyLogSuccess', payload: { ...getDailyLogResponse, author: -1 } })
        .put({ type: 'workoutlog/getFitElements', payload: { ...getDailyLogResponse, author: -1 } })
        .dispatch({ type: 'workoutlog/getDailyLog', payload: getDailyLogRequest })
        .hasFinalState({
          ...initialState,
          daily_log: {
            isDailyLog: false,
            date: '2022-10-01',
            memo: 'memo',
            fit_element: [],
            calories: 0,
            images: [],
          },
        })
        .run();
    });
    test('getFitElements', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getFitElements, getFitElementsRequest), getFitElementsRequest]])
        .put({ type: 'workoutlog/getFitElementsSuccess', payload: getFitElementsRequest })
        .dispatch({ type: 'workoutlog/getFitElements', payload: getFitElementsRequest })
        .hasFinalState({
          ...initialState,
          daily_fit_elements: { fitelements: [0] },
        })
        .silentRun();
    });
    test('getCalendarInfo', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([
          [
            call(workoutAPI.getCalendarInfo, getCalendarInfoRequest),
            { fitelements: [{ year: 2022, month: 10, date: 1, workouts: [], calories: 0 }] },
          ],
        ])
        .put({
          type: 'workoutlog/getCalendarInfoSuccess',
          payload: {
            fitelements: [
              {
                year: 2022,
                month: 10,
                date: 1,
                workouts: [],
                calories: 0,
              },
            ],
          },
        })
        .dispatch({ type: 'workoutlog/getCalendarInfo', payload: getCalendarInfoRequest })
        .hasFinalState({
          ...initialState,
          calendar_info: {
            fitelements: [{ year: 2022, month: 10, date: 1, workouts: [], calories: 0 }],
          },
        })
        .silentRun();
    });
    test('getRoutine', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getRoutine, getRoutineRequest), undefined]])
        .dispatch({ type: 'workoutlog/getRoutine', payload: getRoutineRequest })
        .hasFinalState({
          ...initialState,
          routine: undefined,
        })
        .silentRun();
    });

    test('createDailyLog', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.createDailyLog, createDailyLogRequest), createDailyLogResponse]])
        .put({ type: 'workoutlog/createDailyLogSuccess', payload: createDailyLogResponse })
        .dispatch({ type: 'workoutlog/createDailyLog', payload: createDailyLogRequest })
        .hasFinalState({
          ...initialState,
          dailyLogCreate: {
            dailylog_date: '2022-10-01',
            status: true,
          },
        })
        .silentRun();
    });
    test('deleteFitElement', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.deleteFitElement, { fitelement_id: 0, username: 'user' }), { id: 0 }]])
        .put({ type: 'workoutlog/deleteFitElementSuccess', payload: { id: 0 } })
        .dispatch({ type: 'workoutlog/deleteFitElement', payload: { fitelement_id: 0, username: 'user' } })
        .hasFinalState({
          ...initialState,
          fitelementDelete: 0,
        })
        .silentRun();
    });
    test('editMemo', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([
          [
            call(workoutAPI.editMemo, { memo: 'memo', username: 'user', year: 2022, month: 10, specific_date: 1 }),
            undefined,
          ],
        ])
        .dispatch({
          type: 'workoutlog/editMemo',
          payload: { memo: 'memo', username: 'user', year: 2022, month: 10, specific_date: 1 },
        })
        .hasFinalState({
          ...initialState,
        })
        .silentRun();
    });
    test('editRoutineTitle', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([
          [
            call(workoutAPI.editRoutineTitle, {
              username: 'user',
              title: 'new_title',
              routine_id: 1,
            }),
            { id: 1, content: 'new_title' },
          ],
        ])
        .put({ type: 'workoutlog/editRoutineTitleSuccess', payload: { id: 1, content: 'new_title' } })
        .dispatch({
          type: 'workoutlog/editRoutineTitle',
          payload: {
            username: 'user',
            title: 'new_title',
            routine_id: 1,
          },
        })
        .hasFinalState({
          ...initialState,
          edit_routine_success: {
            id: 1,
            content: 'new_title',
          },
        })
        .silentRun();
    });
    test('editImage', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([
          [
            call(workoutAPI.editImage, {
              image: 'test.png',
              username: 'user',
              year: 2022,
              month: 10,
              specific_date: 1,
            }),
            { image: 'test.png' },
          ],
        ])
        .put({ type: 'workoutlog/editImageSuccess', payload: { image: 'test.png' } })
        .dispatch({
          type: 'workoutlog/editImage',
          payload: {
            image: 'test.png',
            username: 'user',
            year: 2022,
            month: 10,
            specific_date: 1,
          },
        })
        .hasFinalState({
          ...initialState,
          imageSuccess: 'test.png',
        })
        .silentRun();
    });
    test('editIndex', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.editIndex, editIndexRequest), { log_index: [1, 2] }]])
        .put({ type: 'workoutlog/editIndexSuccess', payload: { log_index: [1, 2] } })
        .dispatch({
          type: 'workoutlog/editIndex',
          payload: editIndexRequest,
        })
        .hasFinalState({
          ...initialState,
          indexSuccess: [1, 2],
        })
        .silentRun();
    });
    test('deleteImage', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.deleteImage, deleteImageRequest), { image: 'test.jpg' }]])
        .put({ type: 'workoutlog/deleteImageSuccess', payload: { image: 'test.jpg' } })
        .dispatch({
          type: 'workoutlog/deleteImage',
          payload: deleteImageRequest,
        })
        .hasFinalState({
          ...initialState,
          deleteImageSuccess: 'test.jpg',
        })
        .silentRun();
    });
    test('getSpecificRoutine', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([
          [
            call(workoutAPI.getSpecificRoutine, { username: 'user', routine_id: 0 }),
            { name: 'routine1', fitelements: [] },
          ],
        ])
        .put({ type: 'workoutlog/getSpecificRoutineSuccess', payload: { name: 'routine1', fitelements: [] } })
        .put({ type: 'workoutlog/getSpecificRoutineFitElements', payload: { name: 'routine1', fitelements: [] } })
        .dispatch({ type: 'workoutlog/getSpecificRoutine', payload: { username: 'user', routine_id: 0 } })
        .hasFinalState({
          ...initialState,
          selected_routine: {
            name: 'routine1',
            fitelements: [],
          },
        })
        .silentRun();
    });
    test('createRoutineWithFitElements', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.createRoutineWithFitElements, createRoutineWithFitElementsRequest), { id: 1 }]])
        .put({ type: 'workoutlog/createRoutineWithFitElementsSuccess', payload: { id: 1 } })
        .dispatch({ type: 'workoutlog/createRoutineWithFitElements', payload: createRoutineWithFitElementsRequest })
        .hasFinalState({
          ...initialState,
          create_routine_id: 1,
        })
        .silentRun();
    });
    test('getFitElementType', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([
          [
            call(workoutAPI.getFitelementTypes),
            [
              {
                id: 0,
                class_name: 'test',
                class_type: 'test',
                color: 'test',
                tags: { id: 0, name: '', color: '', posts: 0, calories: 0 },
              },
            ],
          ],
        ])
        .put({
          type: 'workoutlog/getFitElementTypesSuccess',
          payload: [
            {
              id: 0,
              class_name: 'test',
              class_type: 'test',
              color: 'test',
              tags: { id: 0, name: '', color: '', posts: 0, calories: 0 },
            },
          ],
        })
        .dispatch({ type: 'workoutlog/getFitElementsType' })
        .hasFinalState({
          ...initialState,
          fitelement_types: [
            {
              id: 0,
              class_name: 'test',
              class_type: 'test',
              color: 'test',
              tags: { id: 0, name: '', color: '', posts: 0, calories: 0 },
            },
          ],
        })
        .silentRun();
    });
  });
  describe('saga failure', () => {
    test('getFitElement', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getFitElement, getFitElementRequest), throwError(simpleError)]])
        .put({ type: 'workoutlog/getFitElementFailure', payload: simpleError })
        .dispatch({ type: 'workoutlog/getFitElement', payload: getFitElementRequest })
        .hasFinalState({
          ...initialState,
          error: simpleError,
        })
        .silentRun();
    });
    test('getFitElements_failure', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getFitElements, getFitElementsRequest), throwError(simpleError)]])
        .put({ type: 'workoutlog/getFitElementsFailure', payload: simpleError })
        .dispatch({ type: 'workoutlog/getFitElements', payload: getFitElementsRequest })
        .hasFinalState({
          ...initialState,
          error: simpleError,
        })
        .silentRun();
    });
    test('createWorkoutLog', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.createWorkoutLog, createWorkoutLogRequest), throwError(simpleError)]])
        .put({ type: 'workoutlog/createWorkoutLogFailure', payload: simpleError })
        .dispatch({ type: 'workoutlog/createWorkoutLog', payload: createWorkoutLogRequest })
        .hasFinalState({ ...initialState, error: simpleError })
        .silentRun();
    });
    test('getDailyLog_failure', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getDailyLog, getDailyLogRequest), throwError(simpleError)]])
        .put({ type: 'workoutlog/getDailyLogFailure', payload: simpleError })
        .dispatch({ type: 'workoutlog/getDailyLog', payload: getDailyLogRequest })
        .hasFinalState({
          ...initialState,
          error: simpleError,
        })
        .silentRun();
    });
  });
});
