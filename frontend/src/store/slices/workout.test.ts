import { configureStore } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as workoutAPI from '../apis/workout';
import workoutLogSaga, { initialState, workoutLogSlice, workoutLogActions } from './workout';
import { AxiosError } from 'axios';

const simpleError = new Error('error!');
const axiosError = new AxiosError('Network Error');
const getFitElementRequest: workoutAPI.getFitElementRequestType = {
  fitelement_id: 0,
};

const getFitElementResponse: workoutAPI.getFitElementResponseType = {
  type: 'test',
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

const getSpecificRoutineFitElementsRequest: workoutAPI.getSpecificRoutineFitElementsRequestType = {
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

const getDailyLogResponse: workoutAPI.getDailyLogResponseType = {
  author: 0,
  date: '2022-10-01',
  memo: 'memo',
  calories: 0,
  fitelements: [
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
  image: '',
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

const getDailyFitElementsRequest: workoutAPI.getDailyFitElementsRequestType = {
  fitelements: [],
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

const addFitElementsRequest: workoutAPI.addFitElementsRequestType = {
  // paste
  username: 'user',
  fitelements: [0],
  year: 2022,
  month: 10,
  specific_date: 2,
};

const addFitElementsResponse: workoutAPI.addFitElementsResponseType = {
  fitelements: [0],
};

const createRoutineWithFitElementsRequest: workoutAPI.createRoutineWithFitElementsRequestType = {
  username: 'user',
  fitelements: [],
};

describe('slices - workout', () => {
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
          }
        })
        .run();
    });
    // test('addFitElements', () => {
    //   console.log("add0")
    //   return expectSaga(workoutLogSaga)
    //     .withReducer(workoutLogSlice.reducer)
    //     .provide([[call(workoutAPI.addFitElements, addFitElementsRequest), addFitElementsResponse]])
    //     .put({ type: 'workoutlog/addFitElementsSuccess', payload: addFitElementsResponse })
    //     .hasFinalState({ ...initialState })
    //     .run();
    // })
    // test('getDailyLog', () => {
    //   return expectSaga(workoutLogSaga)
    //     .withReducer(workoutLogSlice.reducer)
    //     .provide([[call(workoutAPI.getDailyLog, getDailyLogRequest), getDailyLogResponse]])
    //     .put({ type: 'workoutlog/getDailyLogSuccess', payload: getDailyLogResponse })
    //     .hasFinalState({ ...initialState })
    //     .run(false);
    // });
    test('getFitElements', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getFitElements, getFitElementsRequest), getFitElementsRequest]])
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
        .provide([[call(workoutAPI.getCalendarInfo, getCalendarInfoRequest), undefined]])
        .dispatch({ type: 'workoutlog/getCanlendarInfo', payload: getCalendarInfoRequest })
        .hasFinalState(initialState)
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
        .dispatch({ type: 'workoutlog/createDailyLog', payload: createDailyLogRequest})
        .hasFinalState({
          ...initialState,
          dailyLogCreate: {
            dailylog_date: '2022-10-01',
            status: true
          }
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
    test('getFitElements', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getDailyLog, getDailyLogRequest), throwError(simpleError)]])
        .put({ type: 'workoutlog/getDailyLogFailure', payload: simpleError })
        .dispatch({ type: 'workoutlog/getDailyLog', payload: getDailyLogRequest })
        .hasFinalState({
          ...initialState,
          error: simpleError,
        })
        .run();
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
  });
});
