import client from './client';

export const getGroups = async (payload: string) => {
  const response = await client.get<getGroupsResponseType>(`/api/group/`);
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

export type GroupLeader = {
  username: string;
  nickname: string;
};

export type GroupDetail = {
  group_id: number;
  group_name: string;
  number: number | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  free: boolean;
  group_leader: GroupLeader;
  goal: Fitelement[];
  member_number: number;
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

export type checkGroupMemberRequestType = {
  group_id: string;
  member: string | null;
};

export type checkGroupMemberResponseType = {
  member_status: string;
};

export const checkGroupMember = async (payload: checkGroupMemberRequestType) => {
  const response = await client.put<checkGroupMemberResponseType>(`/api/group/${payload.group_id}/mem_check/`, payload);
  return response.data;
};

export type getGroupMembersRequestType = {
  group_id: string;
};

export type Member = {
  id: 1;
  username: string;
  cert_days: number;
  image: string;
  level: number;
};

export type getGroupMembersResponseType = {
  members: Member[];
};

export const getGroupMembers = async (payload: getGroupMembersRequestType) => {
  const response = await client.get<getGroupMembersResponseType>(`/api/group/${payload.group_id}/member/`);
  return response.data;
};

export type GroupMemberRequestType = {
  group_id: string;
  member: string;
};

export const joinGroup = async (payload: GroupMemberRequestType) => {
  const response = await client.post<checkGroupMemberResponseType>(`/api/group/${payload.group_id}/member/`, payload);
  return response.data;
};

export const exitGroup = async (payload: GroupMemberRequestType) => {
  const response = await client.delete<checkGroupMemberResponseType>(
    `/api/group/${payload.group_id}/member/${payload.member}/`,
  );
  return response.data;
};
