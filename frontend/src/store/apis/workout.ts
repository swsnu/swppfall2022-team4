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

export type getFitElementRequestType = {
    fitelement_id: number;
};

export const getFitElement = async (payload: getFitElementRequestType) => {
    const response = await client.get<getFitElementResponseType>(`/api/fitelement/${payload.fitelement_id}/`);
    return response.data;
};