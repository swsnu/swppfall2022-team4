import client from './client';

export const getPosts = async (payload: getPostsRequestType) => {
  const response = await client.get<getPostsResponseType>(
    `/api/post/?page=${payload.pageNum}&pageSize=${payload.pageSize}`,
  );
  return response.data;
};

export type Post = {
  id: number;
  title: string;
  author_name: string;
  content: string;
  created: string;
  updated: string;
  like_num: number;
  dislike_num: number;
  scrap_num: number;
  //   view_num: number;
  comments_num: number;
};

export type getPostsRequestType = {
  pageNum: number;
  pageSize: number;
};

export type getPostsResponseType = {
  page: number;
  page_size: number;
  page_total: number;
  posts: Post[];
};

export const createPost = async (payload: createPostRequestType) => {
  const response = await client.post<createPostResponseType>(`/api/post/`, payload);
  return response.data;
};

export type createPostRequestType = {
  title: string;
  content: string;
  author_name: string;
};

export type createPostResponseType = {
  page: number;
  page_size: number;
  page_total: number;
  posts: Post[];
};

export const getPostDetail = async (payload: getPostDetailRequestType) => {
  const response = await client.get<getPostsResponseType>(`/api/post/${payload.post_id}/`);
  return response.data;
};

export type getPostDetailRequestType = {
  post_id: string;
};

export const deletePost = async (payload: deletePostRequestType) => {
  const response = await client.delete(`/api/post/${payload.post_id}/`);
  return response.data;
};

export type deletePostRequestType = {
  post_id: string;
};

export const editPost = async (payload: editPostRequestType) => {
  const response = await client.put(`/api/post/${payload.post_id}/`, payload);
  return response.data;
};

export type editPostRequestType = {
  post_id: string;
  title: string;
  content: string;
};
