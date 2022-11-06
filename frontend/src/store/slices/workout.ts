/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as workoutLogAPI from 'store/apis/workout';

interface WorkoutLogState {
  workout_log: {
    type: string | null;
    workout_type: string | null;
    period: number | null;
    category: string | null;
    weight: number | null;
    rep: number | null;
    set: number | null;
    time: number | null;
    date: Date | null;
  };
  routine: Array<any>;
  daily_log: {
    isDailyLog: Boolean;
    date: Date | null;
    memo: string | null;
    fit_element: number[] | null;
  };
  daily_fit_elements: Array<any>;
  workoutCreate: {
    status: boolean;
    workout_id: string | null;
  };
  dailyLogCreate: {
    status: boolean;
    dailylog_date: Date | null;
  };
  calendar_info: workoutLogAPI.calendarInfoResponse[];
  selected_routine: workoutLogAPI.getSpecificRoutineResponseType;
}

const initialState: WorkoutLogState = {
  workout_log: {
    type: null,
    workout_type: null,
    period: null,
    category: null,
    weight: null,
    rep: null,
    set: null,
    time: null,
    date: null,
  },
  routine: [],
  daily_log: {
    isDailyLog: false,
    date: null,
    memo: null,
    fit_element: null,
  },
  daily_fit_elements: [],
  workoutCreate: {
    status: false,
    workout_id: null,
  },
  dailyLogCreate: {
    status: false,
    dailylog_date: null,
  },
  calendar_info: [],
  selected_routine: {
    name: '',
    fitelements: [],
  },
};

export const workoutLogSlice = createSlice({
  name: 'workoutlog',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    getFitElement: (state, action: PayloadAction<workoutLogAPI.getFitElementRequestType>) => {},
    getFitElementSuccess: (state, { payload }) => {
      state.workout_log.type = payload.type;
      state.workout_log.workout_type = payload.workout_type;
      state.workout_log.period = payload.period;
      state.workout_log.category = payload.category;
      state.workout_log.weight = payload.weight;
      state.workout_log.rep = payload.rep;
      state.workout_log.set = payload.set;
      state.workout_log.time = payload.time;
      state.workout_log.date = payload.date;
    },
    createWorkoutLog: (state, action: PayloadAction<workoutLogAPI.createWorkoutLogRequestType>) => {},
    createWorkoutLogSuccess: (state, { payload }) => {
      state.workoutCreate.workout_id = payload.workout_id;
      state.workoutCreate.status = true;
    },
    getDailyLog: (state, action: PayloadAction<workoutLogAPI.getDailyLogRequestType>) => {},
    createDailyLog: (state, action: PayloadAction<workoutLogAPI.createDailyLogRequestType>) => {},
    createDailyLogSuccess: (state, { payload }) => {
      state.dailyLogCreate.dailylog_date = payload.dailylog_date;
      state.dailyLogCreate.status = true;
    },
    getDailyLogSuccess: (state, { payload }) => {
      state.daily_log.isDailyLog = payload[0].author === -1 ? false : true;
      state.daily_log.memo = payload[0].memo;
      state.daily_log.fit_element = payload[0].fitelements;
      state.daily_log.date = payload[0].date;
      state.daily_fit_elements = payload[1];
    },
    getDailyFitElements: (state, { payload }) => {},
    editMemo: (state, action: PayloadAction<workoutLogAPI.editMemoRequestType>) => {},
    getCalendarInfo: (state, action: PayloadAction<workoutLogAPI.getCalendarInfoRequestType>) => {},
    getCalendarInfoSuccess: (state, { payload }) => {
      state.calendar_info = payload;
    },
    getRoutine: (state, action: PayloadAction<workoutLogAPI.getRoutineRequestType>) => {},
    getRoutineSuccess: (state, { payload }) => {
      state.routine = payload;
    },
    getSpecificRoutine: (state, action: PayloadAction<workoutLogAPI.getSpecificRoutineRequestType>) => {},
    getSpecificRoutineSuccess: (state, { payload }) => {
      state.selected_routine = payload;
    },
  },
});

export const workoutLogActions = workoutLogSlice.actions;

function* getFitElementSaga(action: PayloadAction<workoutLogAPI.getFitElementRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getFitElement, action.payload);
    yield put(workoutLogActions.getFitElementSuccess(response));
  } catch (error) {}
}

function* getDailyLogSaga(action: PayloadAction<workoutLogAPI.getDailyLogRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getDailyLog, action.payload);
    yield put(workoutLogActions.getDailyLogSuccess(response));
  } catch (error) {}
}

function* createWorkoutLogSaga(action: PayloadAction<workoutLogAPI.createWorkoutLogRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.createWorkoutLog, action.payload);
    yield put(workoutLogActions.createWorkoutLogSuccess(response));
  } catch (error) {}
}

function* createDailyLogSaga(action: PayloadAction<workoutLogAPI.createDailyLogRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.createDailyLog, action.payload);
    yield put(workoutLogActions.createDailyLogSuccess(response));
  } catch (error) {}
}

function* editMemoLogSaga(action: PayloadAction<workoutLogAPI.editMemoRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.editMemo, action.payload);
  } catch (error) {}
}

function* getCalendarInfoSaga(action: PayloadAction<workoutLogAPI.getCalendarInfoRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getCalendarInfo, action.payload);
    yield put(workoutLogActions.getCalendarInfoSuccess(response));
  } catch (error) {}
}

function* getRoutineSaga(action: PayloadAction<workoutLogAPI.getRoutineRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getRoutine, action.payload);
    yield put(workoutLogActions.getRoutineSuccess(response));
  } catch (error) {}
}

function* getSpecificRoutineSaga(action: PayloadAction<workoutLogAPI.getSpecificRoutineRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getSpecificRoutine, action.payload);
    yield put(workoutLogActions.getSpecificRoutineSuccess(response));
  } catch (error) {}
}

export default function* workoutLogSaga() {
  yield takeLatest(workoutLogActions.getFitElement, getFitElementSaga);
  yield takeLatest(workoutLogActions.getDailyLog, getDailyLogSaga);
  yield takeLatest(workoutLogActions.createDailyLog, createDailyLogSaga);
  yield takeLatest(workoutLogActions.createWorkoutLog, createWorkoutLogSaga);
  yield takeLatest(workoutLogActions.editMemo, editMemoLogSaga);
  yield takeLatest(workoutLogActions.getCalendarInfo, getCalendarInfoSaga);
  yield takeLatest(workoutLogActions.getRoutine, getRoutineSaga);
  yield takeLatest(workoutLogActions.getSpecificRoutine, getSpecificRoutineSaga);
}
