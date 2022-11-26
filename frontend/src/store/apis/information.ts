import client from './client';

export const getInformation = async (payload: getInformationRequestType) => {
  const response = await client.get(`/api/information/${payload.information_name}/`);
  return response.data;
};

export type getInformationRequestType = {
  information_name: string;
};

export type Youtube = {
  video_id: string;
  title: string;
  thumbnail: string;
  channel: string;
  published: string;
};
