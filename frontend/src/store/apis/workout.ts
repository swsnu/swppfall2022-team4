import { List } from 'reselect/es/types';
import client from './client';

export type getFitElementResponseType = {
    type: string;
    workout_type: string;
    period: number;
    category: string;
    weight: number;
    rep: number;
    set: number;
    time: number;
    date: Date;
};

export type getDailyLogResponseType = {
    date: Date;
    memo: string;
    fitelements: List;
    fit_elements: Array<any>;
};

export type getFitElementRequestType = {
    fitelement_id: number;
};

export type getDailyLogRequestType = {
    year: number;
    month: number;
    specific_date: number;
    user_id: number;
    data: {
        user_id: number;
    }
};

export type getDailyFitElementsRequestType = {
    fitelements: List | null;
};

export type createWorkoutLogRequestType = {
    user_id: number;
    type: string;
    workout_type: string;
    period: number | null;
    category: string;
    weight: number | null;
    rep: number | null;
    set: number | null;
    time: number | null;
    date: Date | null;
}

export type createDailyLogRequestType = {
    user_id: number;
    date: Date;
    memo: string | null;
    fitelements: List;
    year: number;
    month: number;
    specific_date: number;
};

export const getFitElement = async (payload: getFitElementRequestType) => {
    const response = await client.get<getFitElementResponseType>(`/api/fitelement/${payload.fitelement_id}/`);
    return response.data;
};

export const getDailyLog = async (payload: getDailyLogRequestType) => {
    const response = await client.get<getDailyLogResponseType>(`/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&user_id=${payload.user_id}`);

    const temp_list = await Promise.all(
        response.data.fitelements.map(id => {
          return client.get<getFitElementResponseType>(`/api/fitelement/${id}/`);
        })
    );
    
    const return_list = temp_list.map((v) => {
        return v.data
    })

    return [response.data, return_list];
};

export const createWorkoutLog = async (payload: createWorkoutLogRequestType) => {
    const response = await client.post<createWorkoutLogRequestType>(`/api/fitelement/`, payload);
    return response.data;
}

export const createDailyLog = async (payload: createDailyLogRequestType) => {
    const response = await client.post<createDailyLogRequestType>(`/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&user_id=${payload.user_id}`, payload);
    return response.data;
}