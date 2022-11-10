import client from './client';
import { userType } from './user';

export const getChatroomList = async (username: string) => {
  const response = await client.get<chatroomType[]>(`/api/chat/${username}/`);
  return response.data;
};
export const createChatroom = async (username: string, target: string) => {
  const response = await client.post<string>(`/api/chat/${username}/`, target);
  return response.data;
};
export const getMessageList = async (roomId: string) => {
  const response = await client.get<messageType[]>(`/api/chat/message/${roomId}/`);
  return response.data;
};

export type chatroomType = {
  id: number;
  user: {
    username: string;
    nickname: string;
    image: string;
  } | null;
};
export type messageType = {
  id: number;
  author: userType | null;
  content: string;
  created: string;
};
