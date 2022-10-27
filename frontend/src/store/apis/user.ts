import client from './client';

export const signup = async (payload: signupRequestType) => {
  const response = await client.post<userType>(`api/user/signup/`, payload);
  return response.data;
};
export const login = async (payload: loginRequestType) => {
  const response = await client.post<userType>(`api/user/login/`, payload);
  return response.data;
};

export type userType = {
  username: string;
  nickname: string;
  image: string;
};
export type signupRequestType = {
  username: string;
  password: string;
  nickname: string;
  gender: string;
  height: number;
  weight: number;
  age: number;
};
export type loginRequestType = {
  username: string;
  password: string;
};