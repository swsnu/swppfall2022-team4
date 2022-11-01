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

export const getFitElement = async (payload: getFitElementRequestType) => {
    const response = await client.get<getFitElementResponseType>(`/api/fitelement/${payload.fitelement_id}/`);
    return response.data;
};

export const getDailyLog = async (payload: getDailyLogRequestType) => {
    const response = await client.get<getDailyLogResponseType>(`/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&user_id=${payload.user_id}`);

    //Object.assign([], this.collectionPages)
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
