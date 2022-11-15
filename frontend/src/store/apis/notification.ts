import client from './client';

export const getNotificationList = async () => {
  const response = await client.get<notificationType[]>(`/api/notification/`);
  return response.data;
};

export type notificationType = {
  id: number;
  username: string;
  category: string;
  content: string;
  image: string;
  link: string;
};
