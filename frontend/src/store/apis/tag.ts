import client from './client';

export const getTag = async () => {
  const response = await client.get<getTagListResponseType>(`/api/tag/`);
  return response.data;
};

export type Tag = {
  id: number;
  name: string;
};

export type TagClass = {
  id: number;
  class: string;
  tags: Tag[];
};

export type getTagListResponseType = {
  tags: Tag[];
};
