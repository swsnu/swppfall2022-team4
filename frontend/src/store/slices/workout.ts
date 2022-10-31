/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import * as workoutLogAPI from 'store/apis/workout';

interface WorkoutLogState {
    workout_log: {

    } | null;
    routine: {

    } | null;
    daily_log: {

    } | null;
}

const initialState: WorkoutLogState = {
    workout_log: null,
    routine: null,
    daily_log: null
}

export const workoutLogSlice = createSlice({
    name: 'workoutlog',
    initialState,
    reducers: {
        getFitElement: (state, action: PayloadAction<workoutLogAPI.getFitElementRequestType>) => {
            console.log(state)
        }
        
    }
})

export const workoutLogActions = workoutLogSlice.actions;

function* getFitElementSaga(action: PayloadAction<workoutLogAPI.getFitElementRequestType>) {
    try {
        const response: AxiosResponse = yield call(workoutLogAPI.getFitElement, action.payload);
    } catch (error) {
        
    }
}

export default function* workoutLogSaga() {
    yield takeLatest(workoutLogActions.getFitElement, getFitElementSaga);
  }
  