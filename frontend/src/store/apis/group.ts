import client from './client';

export const getGroups = async (payload: string) => {
  const response = await client.get<getGroupsResponseType>(`/api/group/`);
  return response.data;
};

export type Group = {
  id: number;
  group_name: string;
  number: number;
  start_date: string;
  end_date: string;
};

export type getGroupsResponseType = {
  groups: Group[];
};

export type Fitelement = {
  type: string;
  workout_type: string;
  category: string;
  weight: number;
  rep: number;
  set: number;
  time: number;
};

export type postGroupRequestType = {
  group_name: string;
  number: number;
  start_date: string;
  end_date: string;
  description: string;
  free: boolean;
  group_leader: string;
  goal: Fitelement[];
};

export type GroupLeader = {
  username: string;
  nickname: string;
};

export type GroupDetail = {
  group_id: number;
  group_name: string;
  number: number;
  start_date: string;
  end_date: string;
  description: string;
  free: boolean;
  group_leader: GroupLeader;
  goal: Fitelement[];
};

export const postGroup = async (payload: postGroupRequestType) => {
  const response = await client.post<GroupDetail>(`/api/group/`, payload);
  return response.data;
};

export type getGroupDetailRequestType = {
  group_id: string;
};

export const getGroupDetail = async (payload: getGroupDetailRequestType) => {
  const response = await client.get<GroupDetail>(`/api/group/${payload.group_id}/`);
  return response.data;
};

export type deleteGroupRequestType = {
  group_id: string;
};

export const deleteGroup = async (payload: deleteGroupRequestType) => {
  const response = await client.delete(`/api/group/${payload.group_id}/`);
  return response.data;
};
