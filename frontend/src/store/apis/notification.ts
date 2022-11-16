import client from './client';

export const getNotificationList = async () => {
  const response = await client.get<notificationType[]>(`/api/notification/`);
  return response.data;
};
export const deleteAllNotification = async () => {
  const response = await client.delete<undefined>(`/api/notification/`);
  return response.data;
};
export const deleteNotification = async (payload: string) => {
  const response = await client.delete<undefined>(`/api/notification/${payload}/`);
  return response.data;
};

export type notificationType = {
  id: number;
  category: string;
  content: string;
  image: string;
  link: string;
  created: string;
};
