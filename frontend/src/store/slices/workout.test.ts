import { configureStore } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { rootReducer } from '../index';
import * as workoutAPI from '../apis/workout';
import workoutLogSaga, { initialState, workoutLogSlice, workoutLogActions } from './workout';

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
  user_id: 1,
  data: {
    user_id: 1,
  },
};

const createworkoutLogRequest: workoutAPI.createWorkoutLogRequestType = {
  user_id: 1,
  type: 'test',
  workout_type: 'test',
  period: 0,
  category: 'category',
  weight: 0,
  rep: 0,
  set: 0,
  time: 0,
  date: new Date(2022, 10, 1),
};

const createDailyLogRequest: workoutAPI.createDailyLogRequestType = {
  user_id: 0,
  date: new Date(2022, 10, 1),
  memo: 'memo',
  fitelements: [],
  year: 2022,
  month: 10,
  specific_date: 1,
};

const getDailyFitElementsRequest: workoutAPI.getDailyFitElementsRequestType = {
  fitelements: [],
};

const editMemoRequest: workoutAPI.editMemoRequestType = {
  user_id: 0,
  memo: 'memo',
  year: 2022,
  month: 10,
  specific_date: 1,
};

const getCalendarInfoRequest: workoutAPI.getCalendarInfoRequestType = {
  user_id: 0,
  year: 2022,
  month: 10,
};

const getRoutineRequest: workoutAPI.getRoutineRequestType = {
  user_id: 0,
};

const getSpecificRoutineRequest: workoutAPI.getSpecificRoutineRequestType = {
  user_id: 0,
  routine_id: 0,
};

const addFitElementsRequest: workoutAPI.addFitElementsRequestType = {
  user_id: 1,
  fitelements: [1],
  year: 2022,
  month: 10,
  specific_date: 1,
};

const createRoutineWithFitElementsRequest: workoutAPI.createRoutineWithFitElementsRequestType = {
  user_id: 0,
  fitelements: [],
};

describe('slices - workout', () => {
  test.each([
    [workoutLogActions.getFitElement(getFitElementRequest), initialState],
    [workoutLogActions.getFitElementSuccess(getFitElementResponse), initialState],
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
});
