import client from './client';

export const getTag = async () => {
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
  tags: Tag[];
};

export type getTagListResponseType = {
  tags: TagClass[];
};

export const createTag = async (payload: createTagRequestType) => {
  const response = await client.post(`/api/tag/`, payload);
  return response.data;
};

export type createTagRequestType = {
  name: string;
  classId: string;
};
