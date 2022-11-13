import client from './client';
import { userType } from './user';

export const getGroups = async () => {
  const response = await client.get<getGroupsResponseType>(`/api/group/`);
  return response.data;
};
export const postGroup = async (payload: postGroupRequestType) => {
  const response = await client.post<GroupDetail>(`/api/group/`, payload);
  return response.data;
};
export const getGroupDetail = async (payload: string) => {
  const response = await client.get<GroupDetail>(`/api/group/${payload}/`);
  return response.data;
};
export const deleteGroup = async (payload: string) => {
  const response = await client.delete(`/api/group/${payload}/`);
  return response.data;
};
export const checkGroupMember = async (payload: string) => {
  const response = await client.get<checkGroupMemberResponseType>(`/api/group/${payload}/mem_check/`);
  return response.data;
};
export const getGroupMembers = async (payload: string) => {
  const response = await client.get<getGroupMembersResponseType>(`/api/group/${payload}/member/`);
  return response.data;
};
export const joinGroup = async (payload: string) => {
  const response = await client.post<undefined>(`/api/group/${payload}/member/`);
  return response.data;
};
export const exitGroup = async (payload: string) => {
  const response = await client.delete<undefined>(`/api/group/${payload}/member/`);
  return response.data;
};

export type Group = {
  id: number;
  group_name: string;
  number: number | null;
  start_date: string | null;
  end_date: string | null;
  member_number: number;
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
  number: number | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  free: boolean;
  group_leader: string | null;
  goal: Fitelement[];
};

export type GroupDetail = {
  group_id: number;
  group_name: string;
  number: number | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  free: boolean;
  group_leader: userType;
  goal: Fitelement[];
  member_number: number;
};

export type checkGroupMemberResponseType = {
  member_status: string;
};

export type Member = {
  id: number;
  username: string;
  cert_days: number;
  image: string;
  level: number;
};
export type getGroupMembersResponseType = {
  members: Member[];
};
