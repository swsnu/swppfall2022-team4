import client from './client';

export const getInformation = async (payload: getInformationRequestType) => {
  const response = await client.get(`/api/information/${payload.information_name}/`);
  return response.data;
};

export type getInformationRequestType = {
  information_name: string;
};
