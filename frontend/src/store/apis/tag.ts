import client from './client';

export const getTags = async () => {
  const response = await client.get<getTagListResponseType>(`/api/tag/`);
  return response.data;
};

export type Tag = {
  id: number;
  tag_name: string;
};

export type TagClass = {
  id: number;
  class_name: string;
  class_type: string;
  color: string;
  tags: TagVisual[];
};

export type TagVisual = {
  id: string;
  name: string;
  color: string;
};

export type getTagListResponseType = {
  tags: TagClass[];
};

export const createTagClass = async (payload: createTagClassRequestType) => {
  const response = await client.post(`/api/tag/class/`, payload);
  return response.data;
};

export type createTagClassRequestType = {
  name: string;
  color: string;
};

export const createTag = async (payload: createTagRequestType) => {
  const response = await client.post<tagVisualsResponseType>(`/api/tag/`, payload);
  return response.data;
};

export type createTagRequestType = {
  name: string;
  classId: string;
};

export const searchTag = async (payload: searchTagRequestType) => {
  const response = await client.get<tagVisualsResponseType>(`/api/tag/search/?tag=${payload.tag_name}`);
  return response.data;
};

export type searchTagRequestType = {
  class_name: string;
  tag_name: string;
};

export type tagVisualsResponseType = {
  tags: TagVisual[];
};
