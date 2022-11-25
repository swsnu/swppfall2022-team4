/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import { TagClass } from 'store/apis/tag';
import * as workoutLogAPI from 'store/apis/workout';
import { notificationSuccess } from 'utils/sendNotification';

export type Fitelement = {
  data: {
    id: number;
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
};

export type RoutineType = {
  id: number | null;
  name: string;
  fitelements: Fitelement[];
};

export interface WorkoutLogState {
  error: AxiosError | null;
  workout_log: {
    id: number;
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
  routine: RoutineType[];
  daily_log: {
    isDailyLog: boolean;
    date: string | null;
    memo: string | null;
    fit_element: number[] | null;
    calories: number;
    images: string[] | null;
  };
  daily_fit_elements: Fitelement[];
  workoutCreate: {
    status: boolean;
    workout_id: string | null;
  };
  dailyLogCreate: {
    status: boolean;
    dailylog_date: string | null;
  };
  calendar_info: workoutLogAPI.calendarInfoResponse[];
  selected_routine: {
    name: string;
    fitelements: Fitelement[];
  };
  add_fit_elements: {
    fitelements: Fitelement[];
    status: boolean;
  };
  fitelement_type: {
    name: string;
    calories: number;
    category: string;
  };
  fitelement_types: TagClass[];
  fitelementDelete: number;
}

export const initialState: WorkoutLogState = {
  error: null,
  workout_log: {
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
  },
  routine: [],
  daily_log: {
    isDailyLog: false,
    date: null,
    memo: null,
    fit_element: null,
    calories: 0,
    images: [],
  },
  daily_fit_elements: [],
  workoutCreate: {
    status: true,
    workout_id: '0',
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
  add_fit_elements: {
    fitelements: [],
    status: false,
  },
  fitelement_type: {
    name: '',
    category: '',
    calories: 0,
  },
  fitelement_types: [],
  fitelementDelete: 0
};

export const workoutLogSlice = createSlice({
  name: 'workoutlog',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    getFitElement: (state, action: PayloadAction<workoutLogAPI.getFitElementRequestType>) => {
      // Empty function
    },
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
    getFitElementFailure: (state, { payload }) => {
      state.error = payload;
    },
    getFitElementsFailure: (state, { payload }) => {
      state.error = payload;
    },
    getDailyLogFailure: (state, { payload }) => {
      state.error = payload;
    },
    createWorkoutLogFailure: (state, { payload }) => {
      state.error = payload;
    },
    createWorkoutLog: (state, action: PayloadAction<workoutLogAPI.createWorkoutLogRequestType>) => {
      // Empty function
    },
    createWorkoutLogSuccess: (state, { payload }) => {
      state.workoutCreate.workout_id = payload.workout_id;
      state.workoutCreate.status = true;
    },
    getDailyLog: (state, action: PayloadAction<workoutLogAPI.getDailyLogRequestType>) => {
      // Empty function
    },
    createDailyLog: (state, action: PayloadAction<workoutLogAPI.createDailyLogRequestType>) => {
      // Empty function
    },
    createDailyLogSuccess: (state, { payload }) => {
      state.dailyLogCreate.dailylog_date = payload.dailylog_date;
      state.dailyLogCreate.status = true;
    },
    getDailyLogSuccess: (state, { payload }) => {
      console.log(payload);
      state.daily_log.isDailyLog = payload.author === -1 ? false : true;
      state.daily_log.memo = payload.memo;
      state.daily_log.fit_element = payload.fitelements;
      state.daily_log.date = payload.date;
      state.daily_log.calories = payload.calories;
      state.daily_log.images = payload.images;
    },
    getDailyFitElements: (state, { payload }) => {
      // Empty function
    },
    editMemo: (state, action: PayloadAction<workoutLogAPI.editMemoRequestType>) => {
      // Empty function
    },
    editImage: (state, action: PayloadAction<workoutLogAPI.editImageRequestType>) => {
      // Empty function
    },
    getCalendarInfo: (state, action: PayloadAction<workoutLogAPI.getCalendarInfoRequestType>) => {
      // Empty function
    },
    getCalendarInfoSuccess: (state, { payload }) => {
      state.calendar_info = payload;
    },
    getRoutine: (state, action: PayloadAction<workoutLogAPI.getRoutineRequestType>) => {
      // Empty function
    },
    getRoutineSuccess: (state, { payload }) => {
      state.routine = payload;
    },
    getSpecificRoutine: (state, action: PayloadAction<workoutLogAPI.getSpecificRoutineRequestType>) => {
      // Empty function
    },
    getSpecificRoutineSuccess: (state, { payload }) => {
      state.selected_routine.name = payload.name;
    },
    getSpecificRoutineFitElements: (state, { payload }) => {
      getSpecificRoutineFitElementsSaga(payload.routine_id);
    },
    getSpecificRoutineFitElementsSuccess: (state, { payload }) => {
      state.selected_routine.fitelements = payload;
    },
    addFitElements: (state, action: PayloadAction<workoutLogAPI.addFitElementsRequestType>) => {
      // Empty function
    },
    addFitElementsSuccess: (state, { payload }) => {
      state.add_fit_elements.fitelements = payload;
      state.add_fit_elements.status = true;
    },
    createRoutineWithFitElements: (
      state,
      action: PayloadAction<workoutLogAPI.createRoutineWithFitElementsRequestType>,
    ) => {
      // Empty function
    },
    getFitElements: (state, { payload }) => {
      getFitElementsSaga(payload.fitelements);
    },
    getFitElementsSuccess: (state, { payload }) => {
      state.daily_fit_elements = payload;
    },
    getFitElementsType: state => {
      // Empty function
    },
    getFitElementTypesSuccess: (state, { payload }) => {
      state.fitelement_types = payload;
    },
    deleteFitElement: (state, { payload }) => {
      // Empty function
    },
    deleteFitElementSuccess: (state, { payload }) => {
      state.fitelementDelete = payload.id;
      notificationSuccess('FitElement', '기록 삭제에 성공했어요!');
    }
  },
});

export const workoutLogActions = workoutLogSlice.actions;

function* getFitElementSaga(action: PayloadAction<workoutLogAPI.getFitElementRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getFitElement, action.payload);
    yield put(workoutLogActions.getFitElementSuccess(response));
  } catch (error) {
    yield put(workoutLogActions.getFitElementFailure(error));
  }
}

function* deleteFitElementSaga(action: PayloadAction<workoutLogAPI.deleteFitElementRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.deleteFitElement, action.payload);
    yield put(workoutLogActions.deleteFitElementSuccess(response));
  } catch (error) {
    // Empty function
  }
}

function* getFitElementsSaga(action: PayloadAction<workoutLogAPI.getFitElementsRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getFitElements, action.payload);
    yield put(workoutLogActions.getFitElementsSuccess(response));
  } catch (error) {
    yield put(workoutLogActions.getFitElementsFailure(error));
  }
}

function* getDailyLogSaga(action: PayloadAction<workoutLogAPI.getDailyLogRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getDailyLog, action.payload);
    yield put(workoutLogActions.getDailyLogSuccess(response));
    yield put(workoutLogActions.getFitElements(response));
  } catch (error) {
    yield put(workoutLogActions.getDailyLogFailure(error));
  }
}

function* createWorkoutLogSaga(action: PayloadAction<workoutLogAPI.createWorkoutLogRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.createWorkoutLog, action.payload);
    yield put(workoutLogActions.createWorkoutLogSuccess(response));
  } catch (error) {
    yield put(workoutLogActions.createWorkoutLogFailure(error));
  }
}

function* createDailyLogSaga(action: PayloadAction<workoutLogAPI.createDailyLogRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.createDailyLog, action.payload);
    yield put(workoutLogActions.createDailyLogSuccess(response));
  } catch (error) {
    // Empty function
  }
}

function* editMemoLogSaga(action: PayloadAction<workoutLogAPI.editMemoRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.editMemo, action.payload);
  } catch (error) {
    // Empty function
  }
}

function* editImageSaga(action: PayloadAction<workoutLogAPI.editImageRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.editImage, action.payload);
  } catch (error) {
    // Empty function
  }
}

function* getCalendarInfoSaga(action: PayloadAction<workoutLogAPI.getCalendarInfoRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getCalendarInfo, action.payload);
    yield put(workoutLogActions.getCalendarInfoSuccess(response));
  } catch (error) {
    // Empty function
  }
}

function* getRoutineSaga(action: PayloadAction<workoutLogAPI.getRoutineRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getRoutine, action.payload);
    yield put(workoutLogActions.getRoutineSuccess(response));
  } catch (error) {
    // Empty function
  }
}

function* getSpecificRoutineSaga(action: PayloadAction<workoutLogAPI.getSpecificRoutineRequestType>) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getSpecificRoutine, action.payload);
    yield put(workoutLogActions.getSpecificRoutineSuccess(response));
    yield put(workoutLogActions.getSpecificRoutineFitElements(response));
  } catch (error) {
    // Empty function
  }
}

function* addFitElementsSaga(action: PayloadAction<workoutLogAPI.addFitElementsRequestType>) {
  try {
    console.log('add1', action.payload);
    const response: AxiosResponse = yield call(workoutLogAPI.addFitElements, action.payload);
    console.log('add2', response);
    yield put(workoutLogActions.addFitElementsSuccess(response));
  } catch (error) {
    // Empty function
  }
}

function* createRoutineWithFitElementsSaga(
  action: PayloadAction<workoutLogAPI.createRoutineWithFitElementsRequestType>,
) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.createRoutineWithFitElements, action.payload);
  } catch (error) {
    // Empty function
  }
}

function* getSpecificRoutineFitElementsSaga(
  action: PayloadAction<workoutLogAPI.getSpecificRoutineFitElementsRequestType>,
) {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getSpecificRoutineFitElements, action.payload);
    yield put(workoutLogActions.getSpecificRoutineFitElementsSuccess(response));
  } catch (error) {
    // Empty function
  }
}

function* getFitElementTypesSaga() {
  try {
    const response: AxiosResponse = yield call(workoutLogAPI.getFitelementTypes);
    yield put(workoutLogActions.getFitElementTypesSuccess(response));
  } catch (error) {
    // Empty function
  }
}

export default function* workoutLogSaga() {
  yield takeLatest(workoutLogActions.getFitElement, getFitElementSaga);
  yield takeLatest(workoutLogActions.getDailyLog, getDailyLogSaga);
  yield takeLatest(workoutLogActions.createDailyLog, createDailyLogSaga);
  yield takeLatest(workoutLogActions.createWorkoutLog, createWorkoutLogSaga);
  yield takeLatest(workoutLogActions.editMemo, editMemoLogSaga);
  yield takeLatest(workoutLogActions.editImage, editImageSaga);
  yield takeLatest(workoutLogActions.getCalendarInfo, getCalendarInfoSaga);
  yield takeLatest(workoutLogActions.getRoutine, getRoutineSaga);
  yield takeLatest(workoutLogActions.getSpecificRoutine, getSpecificRoutineSaga);
  yield takeLatest(workoutLogActions.addFitElements, addFitElementsSaga);
  yield takeLatest(workoutLogActions.createRoutineWithFitElements, createRoutineWithFitElementsSaga);
  yield takeLatest(workoutLogActions.getFitElements, getFitElementsSaga);
  yield takeLatest(workoutLogActions.getSpecificRoutineFitElements, getSpecificRoutineFitElementsSaga);
  yield takeLatest(workoutLogActions.getFitElementsType, getFitElementTypesSaga);
  yield takeLatest(workoutLogActions.deleteFitElement, deleteFitElementSaga);
}
