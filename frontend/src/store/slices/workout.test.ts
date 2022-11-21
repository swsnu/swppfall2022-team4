import { configureStore } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as workoutAPI from '../apis/workout';
import workoutLogSaga, { initialState, workoutLogSlice, workoutLogActions } from './workout';

const simpleError = new Error('error!');
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
    username: 'user'
  },
};

const getDailyLogResponse: workoutAPI.getDailyLogResponseType = {
  date: null,
  memo: 'memo',
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
  image: ""
};

const createworkoutLogRequest: workoutAPI.createWorkoutLogRequestType = {
  username: 'user',
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

const getCalendarInfoRequest: workoutAPI.getCalendarInfoRequestType = {
  username: 'user',
  year: 2022,
  month: 10,
};

const getRoutineRequest: workoutAPI.getRoutineRequestType = {
  username: 'user'
};

const getSpecificRoutineRequest: workoutAPI.getSpecificRoutineRequestType = {
  username: 'user',
  routine_id: 0,
};

const addFitElementsRequest: workoutAPI.addFitElementsRequestType = {
  username: 'user',
  fitelements: [1],
  year: 2022,
  month: 10,
  specific_date: 1,
};

const createRoutineWithFitElementsRequest: workoutAPI.createRoutineWithFitElementsRequestType = {
  username: 'user',
  fitelements: [],
};

describe('slices - workout', () => {
  test.each([
    [workoutLogActions.getFitElement(getFitElementRequest), initialState],
    [workoutLogActions.getFitElementSuccess(getFitElementResponse), initialState],
    [workoutLogActions.getFitElementFailure('error'), initialState],
    [workoutLogActions.createWorkoutLog(createworkoutLogRequest), initialState],
    [
      workoutLogActions.createWorkoutLogSuccess(createWorkoutLogResponse),
      {
        ...initialState,
        dailyLogCreate: { dailylog_date: null, status: false },
      },
    ],
    [workoutLogActions.getDailyLog(getDailyLogRequest), initialState],
    [workoutLogActions.createDailyLog(createDailyLogRequest), initialState],
    [
      workoutLogActions.createDailyLogSuccess(createDailyLogResponse),
      {
        ...initialState,
        dailyLogCreate: { dailylog_date: '2022-10-01', status: true },
      },
    ],
    [workoutLogActions.getDailyFitElements(getDailyFitElementsRequest), initialState],
    [workoutLogActions.editMemo(editMemoRequest), initialState],
    [workoutLogActions.getCalendarInfo(getCalendarInfoRequest), initialState],
    [workoutLogActions.getRoutine(getRoutineRequest), initialState],
    [workoutLogActions.getSpecificRoutine(getSpecificRoutineRequest), initialState],
    [workoutLogActions.addFitElements(addFitElementsRequest), initialState],
    [workoutLogActions.createRoutineWithFitElements(createRoutineWithFitElementsRequest), initialState],
  ])('reducer', (action, state) => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(action);
    expect(store.getState().workout_log).toEqual(state);
  });

  describe('saga success', () => {
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
        .silentRun();
    });
    test('getDailyLog', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getDailyLog, getDailyLogRequest), getDailyLogResponse]])
        .dispatch({ type: 'workoutlog/getDailyLogSuccess', payload: getDailyLogResponse })
        .hasFinalState(initialState)
        .silentRun();
    });
    test('getFitElements', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getFitElements, getFitElementsRequest), { payload: getFitElementsRequest }]])
        .dispatch({ type: 'workoutlog/getFitElements', payload: getFitElementsRequest })
        .hasFinalState({
          ...initialState,
          daily_fit_elements: { payload: { fitelements: [0] } },
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
  });
  describe('saga failure', () => {
    test('getFitElement', () => {
      return expectSaga(workoutLogSaga)
        .withReducer(workoutLogSlice.reducer)
        .provide([[call(workoutAPI.getFitElement, getFitElementRequest), throwError(simpleError)]])
        .put({ type: 'workoutlog/getFitElementFailure', payload: simpleError })
        .dispatch({ type: 'workoutlog/getFitElement', payload: getFitElementRequest })
        .hasFinalState(initialState)
        .silentRun();
    });
  });
});
