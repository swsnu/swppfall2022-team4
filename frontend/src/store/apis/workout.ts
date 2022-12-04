/* eslint-disable @typescript-eslint/no-explicit-any */
import { List } from 'reselect/es/types';
import client from './client';
import { TagClass } from 'store/apis/tag';

export type getFitElementResponseType = {
  type: string;
  id: number;
  workout_type: string;
  period: number;
  category: string;
  weight: number;
  rep: number;
  set: number;
  time: number;
  date: Date | null;
};

export type getDailyLogResponseType = {
  author: number;
  date: string | null;
  memo: string;
  fitelements: List<getFitElementResponseType>;
  fit_elements: Array<any>;
  calories: number;
  images: string[] | null;
};

export type getFitElementRequestType = {
  fitelement_id: number;
};

export type getFitElementsRequestType = {
  fitelements: number[];
};

export type getDailyLogRequestType = {
  year: number;
  month: number;
  specific_date: number;
  username: string;
  data: {
    username: string;
  };
};

export type getDailyFitElementsRequestType = {
  fitelements: List | null;
};

export type createWorkoutLogRequestType = {
  username: string;
  type: string;
  workout_type: string;
  period: number | null;
  category: string;
  weight: number | null;
  rep: number | null;
  set: number | null;
  time: number | null;
  date: string | null;
};

export type createWorkoutLogResponseType = {
  workout_id: string;
};

export type createDailyLogRequestType = {
  username: string;
  date: string;
  memo: string | null;
  fitelements: List;
  year: number;
  month: number;
  specific_date: number;
};

export type createDailyLogResponseType = {
  dailylog_date: string | null;
};

export type editMemoRequestType = {
  username: string;
  memo: string | null;
  year: number;
  month: number;
  specific_date: number;
};

export type editRoutineTitleRequestType = {
  username: string;
  routine_id: number;
  title: string;
};

export type getCalendarInfoRequestType = {
  username: string;
  year: number;
  month: number;
};

export type calendarInfoResponse = {
  year: number;
  month: number;
  date: number;
  workouts: [];
  calories: number;
};

export type editImageRequestType = {
  year: number;
  month: number;
  specific_date: number;
  username: string;
  image: string;
};

export type editIndexRequestType = {
  year: number;
  month: number;
  specific_date: number;
  username: string;
  log_index: number[];
};

export type deleteImageRequestType = {
  year: number;
  month: number;
  specific_date: number;
  username: string;
  image: string;
  delete: true;
};

export type getCalendarInfoResponseType = {
  fitelements: calendarInfoResponse[];
};

export type getRoutineRequestType = {
  username: string;
};

export type getRoutineResponseType = {
  id: number;
  name: string;
  fitelements: getFitElementResponseType[];
};

export type getSpecificRoutineRequestType = {
  username: string;
  routine_id: number;
};

export type getSpecificRoutineResponseType = {
  name: string;
  fitelements: getFitElementResponseType[];
};

export type addFitElementsRequestType = {
  username: string;
  fitelements: number[];
  year: number;
  month: number;
  specific_date: number;
};

export type addFitElementsResponseType = {
  fitelements: number[];
};

export type createRoutineWithFitElementsRequestType = {
  username: string;
  fitelements: number[];
};

export type getSpecificRoutineFitElementsRequestType = {
  fitelements: number[];
};

export type deleteFitElementRequestType = {
  fitelement_id: number;
  username: string;
};

export type exchangeFitElementsRequestType = {
  fitelement1_id: number;
  fitelement2_id: number;
};

export const getFitElement = async (payload: getFitElementRequestType) => {
  const response = await client.get<getFitElementResponseType>(`/api/fitelement/${payload.fitelement_id}/`);
  return response.data;
};

export const deleteFitElement = async (payload: deleteFitElementRequestType) => {
  const response = await client.delete(`/api/fitelement/${payload.fitelement_id}/?&username=${payload.username}`);
  return response.data;
};

export const getDailyLog = async (payload: getDailyLogRequestType) => {
  const response = await client.get<getDailyLogResponseType>(
    `/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&username=${payload.username}`,
  );
  return response.data;
};

export const editImage = async (payload: editImageRequestType) => {
  const response = await client.put<editImageRequestType>(
    `/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&username=${payload.username}`,
    payload,
  );
  return response.data;
};

export const editIndex = async (payload: editIndexRequestType) => {
  const response = await client.put(
    `/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&username=${payload.username}`,
    payload,
  );
  return response.data;
};

export const deleteImage = async (payload: deleteImageRequestType) => {
  const response = await client.put<deleteImageRequestType>(
    `/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&username=${payload.username}`,
    payload,
  );
  return response.data;
};

export const getFitElements = async (payload: getFitElementsRequestType) => {
  const response = await Promise.all(
    payload.fitelements.map(id => {
      return client.get<getFitElementResponseType>(`/api/fitelement/${id}/`);
    }),
  );

  response.forEach(v => {
    return v.data;
  });

  return response;
};

export const createWorkoutLog = async (payload: createWorkoutLogRequestType) => {
  const response = await client.post<createWorkoutLogResponseType>(`/api/fitelement/`, payload);
  return response.data;
};

export const createDailyLog = async (payload: createDailyLogRequestType) => {
  const response = await client.post<createDailyLogRequestType>(
    `/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&username=${payload.username}`,
    payload,
  );
  return response.data;
};

export const editMemo = async (payload: editMemoRequestType) => {
  const response = await client.put(
    `/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&username=${payload.username}`,
    payload,
  );
  return response.data;
};

export const editRoutineTitle = async (payload: editRoutineTitleRequestType) => {
  const response = await client.put(
    `/api/fitelement/routine/${payload.routine_id}/?&username=${payload.username}`,
    payload,
  );
  return response.data;
};

export const getCalendarInfo = async (payload: getCalendarInfoRequestType) => {
  const response = await client.get<getCalendarInfoResponseType>(
    `/api/fitelement/${payload.year}/${payload.month}/?&username=${payload.username}`,
  );
  return response.data;
};

export const getRoutine = async (payload: getRoutineRequestType) => {
  const response = await client.get<getRoutineResponseType>(`/api/fitelement/routine/?&username=${payload.username}`);
  return response.data;
};

export const addFitElements = async (payload: addFitElementsRequestType) => {
  const response = await client.put<addFitElementsResponseType>(
    `/api/fitelement/dailylog/${payload.year}/${payload.month}/${payload.specific_date}/?&username=${payload.username}`,
    payload,
  );
  return response.data;
};

export const createRoutineWithFitElements = async (payload: createRoutineWithFitElementsRequestType) => {
  const response = await client.post(`/api/fitelement/routine/?&username=${payload.username}`, payload);
  return response.data;
};

export const getSpecificRoutine = async (payload: getSpecificRoutineRequestType) => {
  const response = await client.get<getSpecificRoutineResponseType>(
    `/api/fitelement/routine/${payload.routine_id}/?&username=${payload.username}`,
  );
  return response.data;
};

export const getSpecificRoutineFitElements = async (payload: getSpecificRoutineFitElementsRequestType) => {
  const response = await Promise.all(
    payload.fitelements.map(id => {
      return client.get<getFitElementResponseType>(`/api/fitelement/${id}/`);
    }),
  );

  response.forEach(v => {
    return v.data;
  });

  return response;
};

export const getFitelementTypes = async () => {
  const response = await client.get<TagClass[]>(`/api/fitelement/type/`);
  return response.data;
};
