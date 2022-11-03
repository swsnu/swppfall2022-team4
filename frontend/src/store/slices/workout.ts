/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as workoutLogAPI from 'store/apis/workout';
import { getFitElementRequestType, getFitElementResponseType } from 'store/apis/workout';

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
    routine: {

    } | null;
    daily_log: {
        date: Date | null;
        memo: string | null;
        fit_element: number[] | null;
    };
    daily_fit_elements: Array<any>
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
    routine: null,
    daily_log: {
        date: null,
        memo: null,
        fit_element: null,
    },
    daily_fit_elements: []
}


export const workoutLogSlice = createSlice({
    name: 'workoutlog',
    initialState,
    reducers: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        getFitElement: (state, action: PayloadAction<workoutLogAPI.getFitElementRequestType>) => {
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
        getDailyLog: (state, action: PayloadAction<workoutLogAPI.getDailyLogRequestType>) => {
            
        },
        getDailyLogSuccess: (state, { payload }) => {
            state.daily_log.memo = payload[0].memo;
            state.daily_log.fit_element = payload[0].fitelements;
            state.daily_log.date = payload[0].date;
            state.daily_fit_elements = payload[1];
        },
        getDailyFitElements: (state, { payload }) => {
        }
    }
})

export const workoutLogActions = workoutLogSlice.actions;

function* getFitElementSaga(action: PayloadAction<workoutLogAPI.getFitElementRequestType>) {
    try {
        const response: AxiosResponse = yield call(workoutLogAPI.getFitElement, action.payload);
        yield put(workoutLogActions.getFitElementSuccess(response));
    } catch (error) {
        
    }
}

function* getDailyLogSaga(action: PayloadAction<workoutLogAPI.getDailyLogRequestType>) {
    try {
        const response: AxiosResponse = yield call(workoutLogAPI.getDailyLog, action.payload);
        yield put(workoutLogActions.getDailyLogSuccess(response));
    } catch (error) {
    }
}


export default function* workoutLogSaga() {
    yield takeLatest(workoutLogActions.getFitElement, getFitElementSaga);
    yield takeLatest(workoutLogActions.getDailyLog, getDailyLogSaga);
  }
  