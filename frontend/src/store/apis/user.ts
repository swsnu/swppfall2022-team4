import client from './client';

export const token = async () => {
  const response = await client.get<undefined>(`/api/user/token/`);
  return response.data;
};

export const signup = async (payload: signupRequestType) => {
  const response = await client.post<userType>(`/api/user/signup/`, payload);
  return response.data;
};
export const login = async (payload: loginRequestType) => {
  const response = await client.post<userType>(`/api/user/login/`, payload);
  return response.data;
};
export const check = async () => {
  const response = await client.get<undefined>(`/api/user/check/`);
  return response.data;
};
export const logout = async () => {
  const response = await client.get<undefined>(`/api/user/logout/`);
  return response.data;
};

export const getProfile = async (username: string) => {
  const response = await client.get<profileType>(`/api/user/profile/${username}/`);
  return response.data;
};
export const editProfile = async (payload: { username: string; data: editProfileRequestType }) => {
  const response = await client.put<userType>(`/api/user/profile/${payload.username}/`, payload.data);
  return response.data;
};
export const signout = async (username: string) => {
  const response = await client.delete<undefined>(`/api/user/profile/${username}/`);
  return response.data;
};

export const getProfileContent = async (username: string) => {
  const response = await client.get(`/api/user/profile/${username}/content/`);
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
export type profileType = {
  username: string;
  nickname: string;
  image: string;
  gender: string;
  height: number;
  weight: number;
  age: number;
  exp: number;
  level: number;
  created: string;
};
export type editProfileRequestType =
  | {
      oldPassword: string;
      newPassword: string;
    }
  | {
      nickname: string;
      image: string;
      gender: string;
      height: number;
      weight: number;
      age: number;
    };
